import { Customer, Transaction } from './types';

const CUSTOMERS_KEY = 'angcms_customers';
const TRANSACTIONS_KEY = 'angcms_transactions';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ---- Customers ----

export function getCustomers(): Customer[] {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
  const customers = getCustomers();
  const newCustomer: Customer = {
    ...customer,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  saveCustomers(customers);
  return newCustomer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  customers[index] = { ...customers[index], ...updates };
  saveCustomers(customers);
  return customers[index];
}

export function deleteCustomer(id: string): boolean {
  const customers = getCustomers();
  const filtered = customers.filter((c) => c.id !== id);
  if (filtered.length === customers.length) return false;
  saveCustomers(filtered);
  // Also delete related transactions
  const transactions = getTransactions().filter((t) => t.customerId !== id);
  saveTransactions(transactions);
  return true;
}

export function getCustomer(id: string): Customer | undefined {
  return getCustomers().find((c) => c.id === id);
}

// ---- Transactions ----

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;
  transactions[index] = { ...transactions[index], ...updates };
  saveTransactions(transactions);
  return transactions[index];
}

export function deleteTransaction(id: string): boolean {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  if (filtered.length === transactions.length) return false;
  saveTransactions(filtered);
  return true;
}

export function getCustomerTransactions(customerId: string): Transaction[] {
  return getTransactions()
    .filter((t) => t.customerId === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCustomerTotalDebt(customerId: string): number {
  return getCustomerTransactions(customerId).reduce((sum, t) => sum + t.total, 0);
}

export function getDailyTransactions(date: string): Transaction[] {
  return getTransactions().filter((t) => t.date === date);
}

export function getMonthlyTransactions(yearMonth: string): Transaction[] {
  return getTransactions().filter((t) => t.date.substring(0, 7) === yearMonth);
}

export function getTotalDailyDebt(date: string): number {
  return getDailyTransactions(date).reduce((sum, t) => sum + t.total, 0);
}

export function getTotalMonthlyDebt(yearMonth: string): number {
  return getMonthlyTransactions(yearMonth).reduce((sum, t) => sum + t.total, 0);
}
