import { useState, useEffect } from 'react';
import { getCustomer, getCustomerTransactions, deleteTransaction, getCustomerTotalDebt } from '../store';
import { Customer, Transaction } from '../types';
import { ArrowLeft, Plus, FileText, AlertTriangle, MessageCircle, Trash2, CalendarDays, ShoppingBag } from 'lucide-react';

interface CustomerLedgerProps {
  customerId: string;
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function CustomerLedger({ customerId, onNavigate }: CustomerLedgerProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const c = getCustomer(customerId);
    if (c) setCustomer(c);
    refreshData();
  }, [customerId]);

  const refreshData = () => {
    setTransactions(getCustomerTransactions(customerId));
    setTotalDebt(getCustomerTotalDebt(customerId));
  };

  const handleDeleteTxn = (id: string) => {
    deleteTransaction(id);
    refreshData();
    setConfirmDelete(null);
  };

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Customer not found.</p>
        <button onClick={() => onNavigate('customers')} className="mt-4 text-blue-600 hover:underline">
          Back to Customers
        </button>
      </div>
    );
  }

  // Get available months for filter
  const availableMonths = [...new Set(transactions.map((t) => t.date.substring(0, 7)))].sort().reverse();

  const filteredTransactions = filterMonth
    ? transactions.filter((t) => t.date.substring(0, 7) === filterMonth)
    : transactions;

  const filteredTotal = filteredTransactions.reduce((sum, t) => sum + t.total, 0);

  // Group transactions by date
  const groupedByDate: Record<string, Transaction[]> = {};
  filteredTransactions.forEach((t) => {
    if (!groupedByDate[t.date]) groupedByDate[t.date] = [];
    groupedByDate[t.date].push(t);
  });

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => onNavigate('customers')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors mt-1"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{customer.name}</h1>
          <p className="text-sm text-slate-500">{customer.phone} • {customer.address}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Total Outstanding</p>
          <p className={`text-xl font-bold ${totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            AED {totalDebt.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onNavigate('transaction-form', { customerId })}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Transaction
        </button>
        <button
          onClick={() => onNavigate('invoice', { customerId })}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <FileText className="w-4 h-4" /> Download Invoice
        </button>
        <button
          onClick={() => onNavigate('whatsapp', { customerId })}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
        <button
          onClick={() => onNavigate('legal-notice', { customerId })}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <AlertTriangle className="w-4 h-4" /> Legal Notice
        </button>
      </div>

      {/* Filter */}
      {availableMonths.length > 1 && (
        <div className="flex items-center gap-3">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {new Date(m + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          {filterMonth && (
            <span className="text-sm text-slate-500">
              Filtered Total: <strong className="text-slate-800">AED {filteredTotal.toFixed(2)}</strong>
            </span>
          )}
        </div>
      )}

      {/* Transactions */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No transactions recorded yet.</p>
          <button
            onClick={() => onNavigate('transaction-form', { customerId })}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Add first transaction
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {new Date(date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  AED {groupedByDate[date].reduce((s, t) => s + t.total, 0).toFixed(2)}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {groupedByDate[date].map((txn) => (
                  <div key={txn.id} className="px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="space-y-1">
                          {txn.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <span className="text-slate-800">{item.name}</span>
                              <span className="text-slate-400">× {item.quantity}</span>
                              <span className="text-slate-500">@ AED {item.unitPrice.toFixed(2)}</span>
                              <span className="font-medium text-slate-700">= AED {item.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        {txn.note && (
                          <p className="text-xs text-slate-400 mt-1 italic">Note: {txn.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span className="font-bold text-red-600 text-sm">AED {txn.total.toFixed(2)}</span>
                        {confirmDelete === txn.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleDeleteTxn(txn.id)}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs px-2 py-1 bg-slate-200 rounded"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(txn.id)}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
