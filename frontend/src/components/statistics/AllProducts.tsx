import { EllipsisText } from "../EllipsisText/EllipsisText";
import styles from "./AllProducts.module.css";
import type { StatisticsProduct } from "./types";
import { formatTaka } from "./format";

type AllProductsProps = {
  products: StatisticsProduct[];
};

export function AllProducts({ products }: AllProductsProps) {
  return (
    <section className={styles.section} aria-labelledby="all-products-title">
      <div className={styles.scroll}>
        <div className={styles.card}>
          <div className={styles.head}>
            <h2 id="all-products-title" className={styles.title}>
              All Products
            </h2>
          </div>

          <table className={styles.table}>
            <colgroup>
              <col className={styles.colName} />
              <col className={styles.colCategory} />
              <col className={styles.colSupplier} />
              <col className={styles.colPrice} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Supplier</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <EllipsisText text={product.name} length={22} />
                  </td>
                  <td>
                    <EllipsisText text={product.category} length={18} />
                  </td>
                  <td>
                    <EllipsisText text={product.supplier} length={20} />
                  </td>
                  <td>{formatTaka(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
