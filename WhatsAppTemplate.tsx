import { useState, useEffect } from 'react';
import { getCustomer, getCustomerTransactions, getCustomers } from '../store';
import { Customer, Transaction } from '../types';
import { ArrowLeft, MessageCircle, Send, Copy, Check } from 'lucide-react';

interface WhatsAppTemplateProps {
  customerId?: string;
  onNavigate: (view: string, data?: Record<string, string>) => void;
}

export default function WhatsAppTemplate({ customerId, onNavigate }: WhatsAppTemplateProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showSelector, setShowSelector] = useState(!customerId);
  const [copied, setCopied] = useState(false);
  const [templateType, setTemplateType] = useState<'daily' | 'summary' | 'reminder'>('summary');

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
      setTransactions(getCustomerTransactions(id));
      setShowSelector(false);
    }
  };

  const totalDebt = transactions.reduce((sum, t) => sum + t.total, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayTxns = transactions.filter((t) => t.date === today);
  const todayTotal = todayTxns.reduce((sum, t) => sum + t.total, 0);

  const generateMessage = (): string => {
    if (!selectedCustomer) return '';

    const shopName = 'Abdun Nur Grocery LLC';
    const phone = '+971 4 XXX XXXX';
    const address = 'Deira, Dubai, UAE';

    if (templateType === 'daily') {
      const itemsList = todayTxns
        .map((t) => t.items.map((i) => `  • ${i.name} x${i.quantity} = AED ${i.total.toFixed(2)}`).join('\n'))
        .join('\n');

      return `السلام عليكم ${selectedCustomer.name}،

📅 تاريخ: ${today}

🛒 مشترياتكم اليوم من ${shopName}:
${itemsList || '  لا توجد مشتريات اليوم'}

💰 إجمالي اليوم: AED ${todayTotal.toFixed(2)}
📊 الرصيد المستحق الكلي: AED ${totalDebt.toFixed(2)}

شكراً لاختياركم متجرنا 🙏
${shopName}
📞 ${phone}
📍 ${address}`;
    }

    if (templateType === 'reminder') {
      return `عزيزي ${selectedCustomer.name}،

تحية طيبة وبعد،

نود تذكيركم بأن لديكم رصيد مستحق لدى ${shopName}:

💰 المبلغ المستحق: AED ${totalDebt.toFixed(2)}

نرجو التكرم بتسوية المبلغ في أقرب وقت ممكن.

لأي استفسار، يرجى التواصل معنا:
📞 ${phone}
📍 ${address}

مع خالص التقدير،
${shopName}`;
    }

    // Summary template (default)
    const last5 = transactions.slice(0, 5);
    const itemsList = last5
      .map(
        (t) =>
          `📅 ${t.date}: ${t.items.map((i) => `${i.name} x${i.quantity}`).join(', ')} = AED ${t.total.toFixed(2)}`
      )
      .join('\n');

    return `السلام عليكم ${selectedCustomer.name}،

📊 كشف حساب من ${shopName}:

${itemsList}
${transactions.length > 5 ? `\n... و ${transactions.length - 5} معاملة أخرى` : ''}

💰 إجمالي الرصيد المستحق: AED ${totalDebt.toFixed(2)}

يرجى التواصل معنا لأي استفسار:
📞 ${phone}
📍 ${address}

شكراً لتعاملكم معنا 🙏
${shopName}`;
  };

  const message = generateMessage();

  const whatsappUrl = selectedCustomer
    ? `https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Customer selector
  if (showSelector || !selectedCustomer) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">WhatsApp Message</h1>
        </div>
        <p className="text-sm text-slate-500">Select a customer to generate a WhatsApp message template.</p>
        <div className="space-y-2">
          {customers.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No customers found.</p>
          ) : (
            customers.map((c) => (
              <button
                key={c.id}
                onClick={() => loadCustomer(c.id)}
                className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-slate-400" />
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
          <h1 className="text-2xl font-bold text-slate-800">WhatsApp Message</h1>
          <p className="text-sm text-slate-500">{selectedCustomer.name} — {selectedCustomer.phone}</p>
        </div>
      </div>

      {/* Template Type Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Message Template</h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTemplateType('daily')}
            className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              templateType === 'daily'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            📅 Daily Purchase
          </button>
          <button
            onClick={() => setTemplateType('summary')}
            className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              templateType === 'summary'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            📊 Account Summary
          </button>
          <button
            onClick={() => setTemplateType('reminder')}
            className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              templateType === 'reminder'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            💰 Payment Reminder
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-green-800 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Message Preview
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm max-h-80 overflow-y-auto">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{message}</pre>
        </div>
      </div>

      {/* Debt Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center">
        <span className="text-sm text-slate-500">Total Outstanding:</span>
        <span className="font-bold text-red-600">AED {totalDebt.toFixed(2)}</span>
      </div>

      {/* Send Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
      >
        <Send className="w-5 h-5" /> Open in WhatsApp
      </a>
    </div>
  );
}
