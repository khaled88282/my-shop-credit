import { useState, useEffect } from 'react';
import { getCustomers, getTransactions, getTotalDailyDebt, getTotalMonthlyDebt } from '../store';
import { Customer, Transaction } from '../types';
import { Users, FileText, TrendingUp, CalendarDays, AlertTriangle, ShoppingBag } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);

  useEffect(() => {
    setCustomers(getCustomers());
    setTransactions(getTransactions());
  }, []);

  const totalOutstanding = transactions.reduce((sum, t) => sum + t.total, 0);
  const dailyDebt = getTotalDailyDebt(today);
  const monthlyDebt = getTotalMonthlyDebt(currentMonth);

  // Top debtors
  const debtMap: Record<string, number> = {};
  transactions.forEach((t) => {
    debtMap[t.customerId] = (debtMap[t.customerId] || 0) + t.total;
  });

  const topDebtors = customers
    .map((c) => ({ ...c, debt: debtMap[c.id] || 0 }))
    .filter((c) => c.debt > 0)
    .sort((a, b) => b.debt - a.debt)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold">Abdun Nur Grocery LLC</h1>
        </div>
        <p className="text-slate-300 text-sm">Credit Management System — Deira, Dubai</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Total Customers"
          value={customers.length.toString()}
          color="bg-blue-500"
          onClick={() => onNavigate('customers')}
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Total Outstanding"
          value={`AED ${totalOutstanding.toFixed(2)}`}
          color="bg-amber-500"
        />
        <StatCard
          icon={<CalendarDays className="w-6 h-6" />}
          label="Today's Debt"
          value={`AED ${dailyDebt.toFixed(2)}`}
          color="bg-emerald-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="This Month"
          value={`AED ${monthlyDebt.toFixed(2)}`}
          color="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('customer-form')}
            className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            <Users className="w-4 h-4" /> Add Customer
          </button>
          <button
            onClick={() => onNavigate('customers')}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> View Ledgers
          </button>
          <button
            onClick={() => onNavigate('invoice-select')}
            className="flex items-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> Generate Invoice
          </button>
          <button
            onClick={() => onNavigate('legal-select')}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            <AlertTriangle className="w-4 h-4" /> Legal Notice
          </button>
        </div>
      </div>

      {/* Top Debtors */}
      {topDebtors.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Top Debtors
          </h2>
          <div className="space-y-3">
            {topDebtors.map((customer, idx) => (
              <div
                key={customer.id}
                onClick={() => onNavigate('ledger', { customerId: customer.id })}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-800">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.phone}</p>
                  </div>
                </div>
                <span className="font-semibold text-red-600">AED {customer.debt.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((t) => {
                const cust = customers.find((c) => c.id === t.customerId);
                return (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">{cust?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">
                        {t.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">AED {t.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{t.date}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {customers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No Customers Yet</h3>
          <p className="text-slate-400 mb-4">Start by adding your first customer to begin tracking credit.</p>
          <button
            onClick={() => onNavigate('customer-form')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Customer
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}
