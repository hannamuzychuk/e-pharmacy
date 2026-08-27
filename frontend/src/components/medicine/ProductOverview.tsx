import styles from "./ProductOverview.module.css";
import { getProductImageUrl } from "../../utils/productImage";
import type { Medicine } from "./types";

type ProductOverviewProps = {
  medicine: Medicine;
  isAdding: boolean;
  onAdd: () => void;
};

export function ProductOverview({
  medicine,
  isAdding,
  onAdd,
}: ProductOverviewProps) {
  return (
    <section className={styles.overview}>
      <img
        className={styles.image}
        src={getProductImageUrl(medicine.image)}
        alt={medicine.name}
        width={364}
        height={284}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.infoCard}>
        <div className={styles.header}>
          <div className={styles.text}>
            <h1 className={styles.name}>{medicine.name}</h1>
            <p className={styles.supplier}>{medicine.supplier}</p>
          </div>
          <p className={styles.priceHeader}>{medicine.price}</p>
        </div>

        <div className={styles.footer}>
          <p className={styles.priceFooter}>{medicine.price}</p>
          <button
            className={`btn btnPrimary ${styles.addBtn}`}
            type="button"
            onClick={onAdd}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to shop"}
          </button>
        </div>
      </div>
    </section>
  );
}
