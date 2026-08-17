import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { KeyIndicators } from "../../components/statistics/KeyIndicators";
import { RecentCustomers } from "../../components/statistics/RecentCustomers";
import { IncomeExpenses } from "../../components/statistics/IncomeExpenses";
import { CustomerPurchasesModal } from "../../components/CustomerPurchasesModal/CustomerPurchasesModal";
import {
  fetchCustomerPurchases,
  fetchStatistics,
} from "../../services/statisticsService";
import type {
  CustomerPurchase,
  RecentCustomer,
  StatisticsData,
} from "../../components/statistics/types";
import styles from "./StatisticsPage.module.css";

export function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] =
    useState<RecentCustomer | null>(null);
  const [purchases, setPurchases] = useState<CustomerPurchase[] | null>(null);
  const [isPurchasesLoading, setIsPurchasesLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const statistics = await fetchStatistics();
        if (!cancelled) {
          setData(statistics);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCustomer(null);
    setPurchases(null);
    setIsPurchasesLoading(false);
    setLoadingId(null);
  }, []);

  const handleView = async (customer: RecentCustomer) => {
    try {
      setLoadingId(customer.id);
      setSelectedCustomer(customer);
      setPurchases(null);
      setIsPurchasesLoading(true);
      const details = await fetchCustomerPurchases(customer.id);
      setPurchases(details);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
      setSelectedCustomer(null);
    } finally {
      setIsPurchasesLoading(false);
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Statistics</h1>

      {isLoading ? (
        <p className={styles.status}>Loading statistics...</p>
      ) : !data ? (
        <p className={styles.status}>Could not load statistics.</p>
      ) : (
        <div className={styles.content}>
          <KeyIndicators metrics={data.metrics} />
          <div className={styles.panels}>
            <RecentCustomers
              customers={data.recentCustomers}
              loadingId={loadingId}
              onView={handleView}
            />
            <IncomeExpenses items={data.incomeExpenses} />
          </div>
        </div>
      )}

      {selectedCustomer && (
        <CustomerPurchasesModal
          customer={selectedCustomer}
          purchases={purchases}
          isLoading={isPurchasesLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
