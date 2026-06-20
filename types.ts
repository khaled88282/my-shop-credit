export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface TransactionItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  date: string;
  items: TransactionItem[];
  total: number;
  note: string;
}

export type ViewType =
  | 'dashboard'
  | 'customers'
  | 'customer-form'
  | 'ledger'
  | 'transaction-form'
  | 'invoice'
  | 'legal-notice'
  | 'whatsapp';
