import styles from "./KeyIndicators.module.css";
import type { StatisticsMetrics } from "./types";
import { formatInteger } from "./format";

type KeyIndicatorsProps = {
  metrics: StatisticsMetrics;
};

const cards = [
  {
    key: "products",
    label: "All products",
    icon: "icon-stats-coins",
    accent: true,
  },
  {
    key: "suppliers",
    label: "All suppliers",
    icon: "icon-stats-coins",
    accent: false,
  },
  {
    key: "customers",
    label: "All Customers",
    icon: "icon-stats-users",
    accent: false,
  },
] as const;

export function KeyIndicators({ metrics }: KeyIndicatorsProps) {
  return (
    <ul className={styles.list}>
      {cards.map((card) => (
        <li
          key={card.key}
          className={`${styles.card} ${card.accent ? styles.cardAccent : ""}`}
        >
          <div className={styles.top}>
            <svg
              className={styles.icon}
              width="18"
              height="18"
              aria-hidden="true"
            >
              <use href={`/icons.svg#${card.icon}`} />
            </svg>
            <span className={styles.label}>{card.label}</span>
          </div>
          <p className={styles.value}>{formatInteger(metrics[card.key])}</p>
        </li>
      ))}
    </ul>
  );
}
