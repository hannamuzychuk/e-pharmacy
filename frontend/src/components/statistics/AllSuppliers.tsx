import { EllipsisText } from "../EllipsisText/EllipsisText";
import styles from "./AllSuppliers.module.css";
import type { StatisticsSupplier } from "./types";
import { formatTaka } from "./format";

type AllSuppliersProps = {
  suppliers: StatisticsSupplier[];
};

export function AllSuppliers({ suppliers }: AllSuppliersProps) {
  return (
    <section className={styles.section} aria-labelledby="all-suppliers-title">
      <div className={styles.scroll}>
        <div className={styles.card}>
          <div className={styles.head}>
            <h2 id="all-suppliers-title" className={styles.title}>
              All Suppliers
            </h2>
          </div>

          <table className={styles.table}>
            <colgroup>
              <col className={styles.colName} />
              <col className={styles.colCompany} />
              <col className={styles.colAddress} />
              <col className={styles.colAmount} />
              <col className={styles.colStatus} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Company</th>
                <th scope="col">Address</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <EllipsisText text={supplier.name} length={18} />
                  </td>
                  <td>
                    <EllipsisText text={supplier.company} length={20} />
                  </td>
                  <td>
                    <EllipsisText text={supplier.address} length={28} />
                  </td>
                  <td>{formatTaka(supplier.amount)}</td>
                  <td>
                    <span className={styles.status}>{supplier.status}</span>
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
