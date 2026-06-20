import { useState, useEffect } from 'react';
import { getCustomers, getCustomerTotalDebt, deleteCustomer } from '../store';
import { Customer } from '../types';
import { Search, Plus, Trash2, BookOpen, FileText, AlertTriangle, MessageCircle, Edit3 } from 'lucide-react';

interface CustomerListProps {
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function CustomerList({ onNavigate }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    setCustomers(getCustomers());
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <button
          onClick={() => onNavigate('customer-form')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Customer Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400">{customers.length === 0 ? 'No customers yet.' : 'No matching customers found.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => {
            const debt = getCustomerTotalDebt(customer.id);
            return (
              <div key={customer.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{customer.name}</h3>
                    <p className="text-sm text-slate-500">{customer.phone}</p>
                    <p className="text-xs text-slate-400">{customer.address}</p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                      debt > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    AED {debt.toFixed(2)}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onNavigate('ledger', { customerId: customer.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-xs font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Ledger
                  </button>
                  <button
                    onClick={() => onNavigate('transaction-form', { customerId: customer.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Transaction
                  </button>
                  <button
                    onClick={() => onNavigate('invoice', { customerId: customer.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-xs font-medium"
                  >
                    <FileText className="w-3.5 h-3.5" /> Invoice
                  </button>
                  <button
                    onClick={() => onNavigate('whatsapp', { customerId: customer.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-xs font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button
                    onClick={() => onNavigate('legal-notice', { customerId: customer.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-xs font-medium"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Legal Notice
                  </button>
                  <button
                    onClick={() => onNavigate('customer-form', { customerId: customer.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors text-xs font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  {confirmDelete === customer.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(customer.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors text-xs font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
