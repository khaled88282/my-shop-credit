import { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerLedger from './components/CustomerLedger';
import TransactionForm from './components/TransactionForm';
import InvoiceGenerator from './components/InvoiceGenerator';
import LegalNotice from './components/LegalNotice';
import WhatsAppTemplate from './components/WhatsAppTemplate';
import {
  LayoutDashboard,
  Users,
  Plus,
  FileText,
  AlertTriangle,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';

interface ViewState {
  view: string;
  data: Record<string, string>;
}

export default function App() {
  const [state, setState] = useState<ViewState>({ view: 'dashboard', data: {} });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useCallback((view: string, data?: Record<string, string>) => {
    setState({ view, data: data || {} });
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const renderView = () => {
    switch (state.view) {
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'customers':
        return <CustomerList onNavigate={navigate} />;
      case 'customer-form':
        return <CustomerForm customerId={state.data.customerId} onNavigate={navigate} />;
      case 'ledger':
        return <CustomerLedger customerId={state.data.customerId} onNavigate={navigate} />;
      case 'transaction-form':
        return <TransactionForm customerId={state.data.customerId} onNavigate={navigate} />;
      case 'invoice':
        return <InvoiceGenerator customerId={state.data.customerId} onNavigate={navigate} />;
      case 'invoice-select':
        return <InvoiceGenerator onNavigate={navigate} />;
      case 'legal-notice':
        return <LegalNotice customerId={state.data.customerId} onNavigate={navigate} />;
      case 'legal-select':
        return <LegalNotice onNavigate={navigate} />;
      case 'whatsapp':
        return <WhatsAppTemplate customerId={state.data.customerId} onNavigate={navigate} />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'customer-form', label: 'Add Customer', icon: Plus },
    { id: 'invoice-select', label: 'Invoice PDF', icon: FileText },
    { id: 'legal-select', label: 'Legal Notice', icon: AlertTriangle },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-white min-h-screen fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Abdun Nur Grocery</h1>
              <p className="text-xs text-slate-400">Credit Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                state.view === item.id
                  ? 'bg-cyan-500/20 text-cyan-400 font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">Deira, Dubai, UAE</p>
          <p className="text-xs text-slate-600 text-center mt-1">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white z-50 flex flex-col">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-sm leading-tight">Abdun Nur Grocery</h1>
                  <p className="text-xs text-slate-400">Credit Management</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    state.view === item.id
                      ? 'bg-cyan-500/20 text-cyan-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-600" />
            <span className="font-bold text-sm text-slate-800">Abdun Nur Grocery</span>
          </div>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
}
