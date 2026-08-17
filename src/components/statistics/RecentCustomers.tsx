import styles from "./RecentCustomers.module.css";
import type { RecentCustomer } from "./types";
import { formatMoney } from "./format";

type RecentCustomersProps = {
  customers: RecentCustomer[];
  loadingId: string | null;
  onView: (customer: RecentCustomer) => void;
};

export function RecentCustomers({
  customers,
  loadingId,
  onView,
}: RecentCustomersProps) {
  return (
    <section className={styles.section} aria-labelledby="recent-customers-title">
      <div className={styles.scroll}>
        <div className={styles.card}>
          <div className={styles.head}>
            <h2 id="recent-customers-title" className={styles.title}>
              Recent Customers
            </h2>
          </div>

          <table className={styles.table}>
            <colgroup>
              <col className={styles.colName} />
              <col className={styles.colEmail} />
              <col className={styles.colSpent} />
              <col className={styles.colAction} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Spent</th>
                <th scope="col">
                  <span className={styles.actionHead}>Medicine</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{formatMoney(customer.spent)}</td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      type="button"
                      onClick={() => onView(customer)}
                      disabled={loadingId === customer.id}
                    >
                      {loadingId === customer.id ? "..." : "View"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
