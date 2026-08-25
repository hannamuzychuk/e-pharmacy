import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CustomerPurchasesModal.module.css";
import type { CustomerPurchase, RecentCustomer } from "../statistics/types";
import { formatMoney, formatTaka } from "../statistics/format";
import { getProductImageUrl } from "../../utils/productImage";

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
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const { overflow: htmlOverflow } = html.style;
    const { overflow, position, top, width } = document.body.style;

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = htmlOverflow;
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
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
          The client's goods
        </h2>

        <div className={styles.client}>
          <div className={styles.clientCol}>
            <span className={styles.clientLabel}>Name</span>
            <span className={styles.clientValue}>{customer.name}</span>
          </div>
          <div className={styles.clientCol}>
            <span className={styles.clientLabel}>Email</span>
            <span className={styles.clientValue}>{customer.email}</span>
          </div>
          <div className={styles.clientCol}>
            <span className={styles.clientLabel}>Spent</span>
            <span className={styles.clientValue}>
              {formatMoney(customer.spent)}
            </span>
          </div>
        </div>

        {isLoading || !purchases ? (
          <p className={styles.status}>Loading purchases...</p>
        ) : purchases.length === 0 ? (
          <p className={styles.status}>No purchases found.</p>
        ) : (
          <ul className={styles.list}>
            {purchases.map((purchase) => (
              <li key={purchase.id}>
                <Link
                  className={styles.item}
                  to="/medicine"
                  onClick={onClose}
                >
                  <img
                    className={styles.image}
                    src={getProductImageUrl(purchase.image)}
                    alt={purchase.name}
                    width={80}
                    height={80}
                  />
                  <div className={styles.itemBody}>
                    <p className={styles.name}>{purchase.name}</p>
                    <p className={styles.description}>{purchase.description}</p>
                    <p className={styles.price}>{formatTaka(purchase.amount)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
