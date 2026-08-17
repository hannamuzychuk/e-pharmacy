import type {
  CustomerPurchase,
  StatisticsData,
} from "./types";

export const mockStatistics: StatisticsData = {
  metrics: {
    products: 8430,
    suppliers: 211,
    customers: 140,
  },
  recentCustomers: [
    {
      id: "1",
      name: "Alex Shatov",
      email: "alexshatov@gmail.com",
      spent: 2890.66,
    },
    {
      id: "2",
      name: "Philip Harbach",
      email: "philip.h@gmail.com",
      spent: 2767.04,
    },
    {
      id: "3",
      name: "Mirko Fisuk",
      email: "mirkofisuk@gmail.com",
      spent: 2996,
    },
    {
      id: "4",
      name: "Olga Semklo",
      email: "olga.s@cool.design",
      spent: 1220.66,
    },
    {
      id: "5",
      name: "Burak Long",
      email: "longburak@gmail.com",
      spent: 1890.66,
    },
  ],
  incomeExpenses: [
    {
      id: "t1",
      type: "Expense",
      description: "Qonto billing",
      amount: -49.88,
    },
    {
      id: "t2",
      type: "Income",
      description: "Cruip.com Market Ltd 70 Wilson St London",
      amount: 249.88,
    },
    {
      id: "t3",
      type: "Income",
      description: "Notion Labs Inc",
      amount: 99.99,
    },
    {
      id: "t4",
      type: "Income",
      description: "Market Cap Ltd",
      amount: 1200.88,
    },
    {
      id: "t5",
      type: "Error",
      description: "App.com Market Ltd 70 Wilson St London",
      amount: 99.99,
    },
    {
      id: "t6",
      type: "Expense",
      description: "App.com Market Ltd 70 Wilson St London",
      amount: -49.88,
    },
  ],
};

export const mockCustomerPurchases: Record<string, CustomerPurchase[]> = {
  "1": [
    { id: "p1", productName: "Moringa", date: "12 Mar 2026", amount: 470 },
    { id: "p2", productName: "Hydrochloride", date: "08 Mar 2026", amount: 582 },
    { id: "p3", productName: "Prednisone", date: "02 Mar 2026", amount: 1838.66 },
  ],
  "2": [
    { id: "p4", productName: "Occidentalis", date: "15 Mar 2026", amount: 239 },
    { id: "p5", productName: "Octinoxate", date: "11 Mar 2026", amount: 306 },
    { id: "p6", productName: "Alcohol", date: "04 Mar 2026", amount: 2222.04 },
  ],
  "3": [
    { id: "p7", productName: "Helminthos", date: "16 Mar 2026", amount: 470 },
    { id: "p8", productName: "Moringa", date: "09 Mar 2026", amount: 2526 },
  ],
  "4": [
    { id: "p9", productName: "Prednisone", date: "14 Mar 2026", amount: 579 },
    { id: "p10", productName: "Octinoxate", date: "03 Mar 2026", amount: 641.66 },
  ],
  "5": [
    { id: "p11", productName: "Alcohol", date: "17 Mar 2026", amount: 748 },
    { id: "p12", productName: "Hydrochloride", date: "06 Mar 2026", amount: 1142.66 },
  ],
};
