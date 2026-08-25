import { api, getApiErrorMessage } from "./http";
import type { CustomerPurchase, StatisticsData } from "../components/statistics/types";

export async function fetchStatistics(): Promise<StatisticsData> {
  try {
    const { data } = await api.get<StatisticsData>("/api/statistics");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function fetchCustomerPurchases(
  customerId: string,
): Promise<CustomerPurchase[]> {
  try {
    const { data } = await api.get<CustomerPurchase[]>(
      `/api/statistics/${customerId}/goods`,
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
