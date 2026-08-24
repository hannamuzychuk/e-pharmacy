import styles from "./KeyIndicators.module.css";
import type { StatisticsMetrics, StatisticsPanelKey } from "./types";
import { formatInteger } from "./format";

type KeyIndicatorsProps = {
  metrics: StatisticsMetrics;
  activeKey: StatisticsPanelKey;
  onActiveKeyChange: (key: StatisticsPanelKey) => void;
};

const cards: {
  key: StatisticsPanelKey;
  label: string;
  icon: string;
}[] = [
  {
    key: "products",
    label: "All products",
    icon: "icon-stats-coins",
  },
  {
    key: "suppliers",
    label: "All suppliers",
    icon: "icon-stats-coins",
  },
  {
    key: "customers",
    label: "All Customers",
    icon: "icon-stats-users",
  },
];

export function KeyIndicators({
  metrics,
  activeKey,
  onActiveKeyChange,
}: KeyIndicatorsProps) {
  return (
    <ul className={styles.list}>
      {cards.map((card) => {
        const isActive = activeKey === card.key;

        return (
          <li key={card.key}>
            <button
              type="button"
              className={`${styles.card} ${isActive ? styles.cardAccent : ""}`}
              aria-pressed={isActive}
              onClick={() => onActiveKeyChange(card.key)}
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
            </button>
          </li>
        );
      })}
    </ul>
  );
}
