import { useState, useEffect } from 'react';
import { getCustomer, getCustomerTransactions, getCustomers } from '../store';
import { Customer, Transaction } from '../types';
import { ArrowLeft, FileText, Download, Users } from 'lucide-react';
import { generateInvoicePDF } from '../pdfUtils';

interface InvoiceGeneratorProps {
  customerId?: string;
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function InvoiceGenerator({ customerId, onNavigate }: InvoiceGeneratorProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showSelector, setShowSelector] = useState(!customerId);

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

  const filteredTransactions = transactions.filter((t) => {
    if (dateFrom && t.date < dateFrom) return false;
    if (dateTo && t.date > dateTo) return false;
    return true;
  });

  const filteredTotal = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

  const handleGenerate = () => {
    if (selectedCustomer && filteredTransactions.length > 0) {
      generateInvoicePDF(selectedCustomer, filteredTransactions);
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
          <h1 className="text-2xl font-bold text-slate-800">Generate Invoice</h1>
        </div>
        <p className="text-sm text-slate-500">Select a customer to generate their credit invoice PDF.</p>
        <div className="space-y-2">
          {customers.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No customers found.</p>
          ) : (
            customers.map((c) => (
              <button
                key={c.id}
                onClick={() => loadCustomer(c.id)}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.phone}</p>
                  </div>
                </div>
              </button>
            ))
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
          <h1 className="text-2xl font-bold text-slate-800">Generate Invoice</h1>
          <p className="text-sm text-slate-500">{selectedCustomer.name} — {selectedCustomer.phone}</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Date Range (Optional)</h2>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-xs text-slate-500">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="block px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="block px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Invoice Preview
          </h2>
          <span className="text-xs text-slate-400">{filteredTransactions.length} transactions</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No transactions found for the selected period.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {filteredTransactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex justify-between p-2 bg-slate-50 rounded text-sm">
                <span className="text-slate-600">{t.date} — {t.items.map((i) => i.name).join(', ')}</span>
                <span className="font-medium text-slate-800">AED {t.total.toFixed(2)}</span>
              </div>
            ))}
            {filteredTransactions.length > 5 && (
              <p className="text-xs text-slate-400 text-center">... and {filteredTransactions.length - 5} more transactions</p>
            )}
          </div>
        )}

        <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
          <span className="font-semibold text-slate-700">Total Amount:</span>
          <span className="text-xl font-bold text-red-600">AED {filteredTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={filteredTransactions.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        <Download className="w-5 h-5" /> Download Invoice PDF
      </button>
    </div>
  );
}
