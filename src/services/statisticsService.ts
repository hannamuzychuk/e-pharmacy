import { mockCustomerPurchases, mockStatistics } from "../components/statistics/mockStatistics";
import type { CustomerPurchase, StatisticsData } from "../components/statistics/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchStatistics(): Promise<StatisticsData> {
  await delay(500);
  return mockStatistics;
}

export async function fetchCustomerPurchases(
  customerId: string,
): Promise<CustomerPurchase[]> {
  await delay(600);

  const purchases = mockCustomerPurchases[customerId];

  if (!purchases) {
    throw new Error("Customer purchases not found");
  }

  return purchases;
}
