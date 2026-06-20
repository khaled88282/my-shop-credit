import { useState, useEffect } from 'react';
import { getCustomer, getCustomerTransactions, getCustomers } from '../store';
import { Customer, Transaction } from '../types';
import { ArrowLeft, AlertTriangle, Download, Shield, Users } from 'lucide-react';
import { generateLegalNoticePDF } from '../pdfUtils';

interface LegalNoticeProps {
  customerId?: string;
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function LegalNotice({ customerId, onNavigate }: LegalNoticeProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showSelector, setShowSelector] = useState(!customerId);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setCustomers(getCustomers());
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  const loadCustomer = (id: string) => {
    const c = getCustomer(id);
    if (c) {
      setSelectedCustomer(c);
      const txns = getCustomerTransactions(id);
      setTransactions(txns);
      setShowSelector(false);
    }
  };

  const totalDebt = transactions.reduce((sum, t) => sum + t.total, 0);

  const handleGenerate = () => {
    if (selectedCustomer && transactions.length > 0) {
      generateLegalNoticePDF(selectedCustomer, transactions);
    }
  };

  // Customer selector
  if (showSelector || !selectedCustomer) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Legal Notice</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 font-medium">Formal Notice of Default</p>
            <p className="text-xs text-red-600 mt-1">
              This tool generates a formal legal notice for customers who have abandoned their debt. 
              Select the customer to proceed.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {customers.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No customers found.</p>
          ) : (
            customers.map((c) => {
              const debt = getCustomerTransactions(c.id).reduce((s, t) => s + t.total, 0);
              return (
                <button
                  key={c.id}
                  onClick={() => loadCustomer(c.id)}
                  className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.phone}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-600 text-sm">AED {debt.toFixed(2)}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate(customerId ? 'ledger' : 'dashboard', customerId ? { customerId } : undefined)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Legal Notice Generator</h1>
          <p className="text-sm text-slate-500">{selectedCustomer.name} — {selectedCustomer.phone}</p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-8 h-8 text-red-500 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">Formal Notice of Default</h3>
            <p className="text-sm text-red-700 mt-1">
              This document will serve as a formal demand for payment. It includes:
            </p>
            <ul className="text-sm text-red-600 mt-2 space-y-1 list-disc list-inside">
              <li>Complete debt summary with all transaction details</li>
              <li>14-day demand for payment</li>
              <li>Warning of police complaint at Deira Police Station</li>
              <li>Warning of legal proceedings in Dubai Courts</li>
              <li>Credit bureau reporting notice</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Debt Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Debt Summary</h2>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
              <span className="text-slate-600">{t.date} — {t.items.map((i) => i.name).join(', ')}</span>
              <span className="font-medium text-slate-800">AED {t.total.toFixed(2)}</span>
            </div>
          ))}
          {transactions.length > 5 && (
            <p className="text-xs text-slate-400 text-center">... and {transactions.length - 5} more transactions</p>
          )}
        </div>
        <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
          <span className="font-semibold text-slate-700">Total Outstanding Debt:</span>
          <span className="text-xl font-bold text-red-600">AED {totalDebt.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirmation */}
      {!confirmed ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-sm text-amber-800 mb-3">
            <strong>Confirm:</strong> I verify that the customer <strong>{selectedCustomer.name}</strong> has abandoned 
            their debt of <strong>AED {totalDebt.toFixed(2)}</strong> and I wish to generate a Formal Notice of Default 
            for legal/police complaint purposes.
          </p>
          <button
            onClick={() => setConfirmed(true)}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            I Confirm — Proceed to Generate
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5" /> Download Legal Notice PDF
        </button>
      )}
    </div>
  );
}
