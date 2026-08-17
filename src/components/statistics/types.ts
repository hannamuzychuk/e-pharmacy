export type StatisticsMetrics = {
  products: number;
  suppliers: number;
  customers: number;
};

export type RecentCustomer = {
  id: string;
  name: string;
  email: string;
  spent: number;
};

export type TransactionType = "Income" | "Expense" | "Error";

export type IncomeExpense = {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
};

export type CustomerPurchase = {
  id: string;
  productName: string;
  date: string;
  amount: number;
};

export type StatisticsData = {
  metrics: StatisticsMetrics;
  recentCustomers: RecentCustomer[];
  incomeExpenses: IncomeExpense[];
};
