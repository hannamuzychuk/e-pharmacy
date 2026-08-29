import styles from "./Loader.module.css";

type LoaderProps = {
  label?: string;
  variant?: "page" | "inline";
};

export function Loader({
  label = "Loading...",
  variant = "page",
}: LoaderProps) {
  return (
    <div
      className={variant === "page" ? styles.page : styles.inline}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.visual} aria-hidden="true">
        <span className={styles.blob} />
        <span className={styles.ringTrack} />
        <span className={styles.ringSweep} />
        <span className={styles.pills}>
          <span className={`${styles.pill} ${styles.pillOne}`}>
            <span className={styles.pillLight} />
            <span className={styles.pillDark} />
          </span>
          <span className={`${styles.pill} ${styles.pillTwo}`}>
            <span className={styles.pillLight} />
            <span className={styles.pillDark} />
          </span>
          <span className={`${styles.pill} ${styles.pillThree}`}>
            <span className={styles.pillLight} />
            <span className={styles.pillDark} />
          </span>
        </span>
      </div>
      <p className={styles.label}>
        <span>{label.replace(/\.\.\.$/, "")}</span>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </p>
    </div>
  );
}
