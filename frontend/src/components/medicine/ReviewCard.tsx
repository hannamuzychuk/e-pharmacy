import styles from "./ReviewCard.module.css";
import type { Review } from "./types";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <li className={styles.card}>
      <p className={styles.author}>{review.author}</p>
      <p className={styles.date}>{review.date}</p>
      <p className={styles.text}>{review.text}</p>
    </li>
  );
}
