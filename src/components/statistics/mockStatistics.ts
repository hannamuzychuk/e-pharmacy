import type { CustomerPurchase, StatisticsData } from "./types";
import productImageA from "../../images/create-shop-mobile.jpg";
import productImageB from "../../images/create-shop-tablet.jpg";
import productImageC from "../../images/medicine-placeholder.png";

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

const catalog = {
  vitaminC: {
    name: "Vitamin C Medicine",
    description: "Antioxidant Aid for Heart Health",
    image: productImageA,
    amount: 90,
  },
  stomach: {
    name: "Stomach Medicine",
    description: "Soothes Indigestion, Eases Stomach Pain",
    image: productImageB,
    amount: 32,
  },
  antibiotic: {
    name: "Antibiotic",
    description: "Prefabricated Metal",
    image: productImageC,
    amount: 748,
  },
  hydrochloride: {
    name: "Hydrochloride",
    description: "Framing (Wood)",
    image: productImageA,
    amount: 582,
  },
  prednisone: {
    name: "Prednisone",
    description: "Retail Sales of Other",
    image: productImageB,
    amount: 579,
  },
  octinoxate: {
    name: "Octinoxate",
    description: "Specialty Food Stores",
    image: productImageC,
    amount: 306,
  },
} as const;

export const mockCustomerPurchases: Record<string, CustomerPurchase[]> = {
  "1": [
    { id: "p1", ...catalog.vitaminC },
    { id: "p2", ...catalog.stomach },
    { id: "p3", ...catalog.antibiotic },
  ],
  "2": [
    { id: "p6", ...catalog.stomach },
    { id: "p7", ...catalog.octinoxate },
    { id: "p8", ...catalog.antibiotic },
  ],
  "3": [
    { id: "p9", ...catalog.vitaminC },
    { id: "p10", ...catalog.hydrochloride },
  ],
  "4": [
    { id: "p11", ...catalog.prednisone },
    { id: "p12", ...catalog.octinoxate },
  ],
  "5": [
    { id: "p13", ...catalog.antibiotic },
    { id: "p14", ...catalog.hydrochloride },
  ],
};
