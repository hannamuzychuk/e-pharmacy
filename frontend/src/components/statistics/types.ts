export type StatisticsMetrics = {
  products: number;
  suppliers: number;
  customers: number;
};

export type StatisticsPanelKey = keyof StatisticsMetrics;

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
  name: string;
  description: string;
  image: string;
  amount: number;
};

export type StatisticsProduct = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  stock: string;
  image: string;
};

export type StatisticsSupplier = {
  id: string;
  name: string;
  company: string;
  address: string;
  amount: number;
  status: string;
};

export type StatisticsData = {
  metrics: StatisticsMetrics;
  products: StatisticsProduct[];
  suppliers: StatisticsSupplier[];
  recentCustomers: RecentCustomer[];
  incomeExpenses: IncomeExpense[];
};
