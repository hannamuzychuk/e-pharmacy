import { useEffect } from "react";
import styles from "./CustomerPurchasesModal.module.css";
import type { CustomerPurchase, RecentCustomer } from "../statistics/types";
import { formatMoney } from "../statistics/format";

type CustomerPurchasesModalProps = {
  customer: RecentCustomer;
  purchases: CustomerPurchase[] | null;
  isLoading: boolean;
  onClose: () => void;
};

export function CustomerPurchasesModal({
  customer,
  purchases,
  isLoading,
  onClose,
}: CustomerPurchasesModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-purchases-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <svg
            className={styles.closeIcon}
            width="20"
            height="20"
            aria-hidden="true"
          >
            <use href="/icons.svg#icon-close-20" />
          </svg>
        </button>

        <h2 id="customer-purchases-title" className={styles.title}>
          Customer purchases
        </h2>
        <p className={styles.meta}>
          {customer.name}
          <span className={styles.email}>{customer.email}</span>
        </p>

        {isLoading || !purchases ? (
          <p className={styles.status}>Loading purchases...</p>
        ) : purchases.length === 0 ? (
          <p className={styles.status}>No purchases found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.productName}</td>
                  <td>{purchase.date}</td>
                  <td>{formatMoney(purchase.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
