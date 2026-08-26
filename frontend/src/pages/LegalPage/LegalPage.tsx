import type { ReactNode } from "react";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
