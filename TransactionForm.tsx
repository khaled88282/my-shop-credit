import { useState, useEffect } from 'react';
import { addTransaction, getCustomer } from '../store';
import { Customer, TransactionItem } from '../types';
import { ArrowLeft, Plus, Trash2, ShoppingCart, Save } from 'lucide-react';

interface TransactionFormProps {
  customerId: string;
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function TransactionForm({ customerId, onNavigate }: TransactionFormProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<TransactionItem[]>([{ name: '', quantity: 1, unitPrice: 0, total: 0 }]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const c = getCustomer(customerId);
    if (c) setCustomer(c);
  }, [customerId]);

  const updateItem = (index: number, field: keyof TransactionItem, value: string | number) => {
    const updated = [...items];
    if (field === 'name') {
      updated[index] = { ...updated[index], name: value as string };
    } else if (field === 'quantity') {
      const q = Math.max(0, Number(value));
      updated[index] = { ...updated[index], quantity: q, total: q * updated[index].unitPrice };
    } else if (field === 'unitPrice') {
      const p = Math.max(0, Number(value));
      updated[index] = { ...updated[index], unitPrice: p, total: updated[index].quantity * p };
    }
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { name: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((i) => i.name.trim() && i.total > 0);
    if (validItems.length === 0) return;

    setSaving(true);
    addTransaction({
      customerId,
      date,
      items: validItems,
      total: grandTotal,
      note: note.trim(),
    });
    setSaving(false);
    onNavigate('ledger', { customerId });
  };

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('ledger', { customerId })}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">New Transaction</h1>
          <p className="text-sm text-slate-500">
            Recording credit purchase for <strong>{customer.name}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Transaction Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" /> Items Purchased
            </h2>
            <button
              type="button"
              onClick={addItemRow}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>

          {/* Column Headers */}
          <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs font-medium text-slate-500 px-1">
            <div className="col-span-5">Item Name</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Unit Price (AED)</div>
            <div className="col-span-2 text-right">Total (AED)</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(idx, 'name', e.target.value)}
                placeholder="Item name"
                required
                className="md:col-span-5 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={item.quantity || ''}
                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                placeholder="Qty"
                min="0"
                step="1"
                required
                className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={item.unitPrice || ''}
                onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                placeholder="Price"
                min="0"
                step="0.01"
                required
                className="md:col-span-2 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="md:col-span-2 text-right font-semibold text-slate-700 text-sm">
                AED {item.total.toFixed(2)}
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  disabled={items.length === 1}
                  className="p-1.5 text-slate-300 hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Grand Total */}
          <div className="border-t border-slate-200 pt-3 flex justify-end">
            <div className="bg-slate-900 text-white px-5 py-3 rounded-lg">
              <p className="text-xs text-slate-300 mb-0.5">Grand Total</p>
              <p className="text-xl font-bold">AED {grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any additional notes..."
            rows={2}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || items.every((i) => !i.name.trim() || i.total === 0)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Transaction'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('ledger', { customerId })}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
