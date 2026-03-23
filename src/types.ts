export interface Transaction {
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  bank: string;
}
