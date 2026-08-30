import styles from "./ProductOverview.module.css";
import type { Medicine } from "./types";

type ProductOverviewProps = {
  medicine: Medicine;
  isAdding: boolean;
  isInShop?: boolean;
  onAdd: () => void;
};

export function ProductOverview({
  medicine,
  isAdding,
  isInShop = false,
  onAdd,
}: ProductOverviewProps) {
  return (
    <section className={styles.overview}>
      <img
        className={styles.image}
        src={medicine.image}
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
            disabled={isAdding || isInShop}
          >
            {isInShop ? "In shop" : isAdding ? "Adding..." : "Add to shop"}
          </button>
        </div>
      </div>
    </section>
  );
}
