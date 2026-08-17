import styles from "./IncomeExpenses.module.css";
import type { IncomeExpense, TransactionType } from "./types";
import { formatSignedMoney } from "./format";

type IncomeExpensesProps = {
  items: IncomeExpense[];
};

const typeClass: Record<TransactionType, string> = {
  Income: styles.income,
  Expense: styles.expense,
  Error: styles.error,
};

export function IncomeExpenses({ items }: IncomeExpensesProps) {
  return (
    <section className={styles.card} aria-labelledby="income-expenses-title">
      <div className={styles.head}>
        <h2 id="income-expenses-title" className={styles.title}>
          Income/Expenses
        </h2>
      </div>

      <div className={styles.body}>
        <p className={styles.today}>Today</p>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.row}>
              <div className={styles.main}>
                <span className={`${styles.tag} ${typeClass[item.type]}`}>
                  {item.type}
                </span>
                <p className={styles.description}>{item.description}</p>
              </div>
              <span className={`${styles.amount} ${typeClass[item.type]}`}>
                {formatSignedMoney(item.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
