import styles from "./ReviewCard.module.css";
import type { Review } from "./types";

type ReviewCardProps = {
  review: Review;
};

const MAX_RATING = 5;

type StarFill = "full" | "half" | "empty";

function getStarFill(rating: number, index: number): StarFill {
  const starValue = index + 1;

  if (rating >= starValue) {
    return "full";
  }

  if (rating >= starValue - 0.5) {
    return "half";
  }

  return "empty";
}

function formatRatingLabel(rating: number) {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

function StarIcon({ fill }: { fill: StarFill }) {
  if (fill === "half") {
    return (
      <span className={styles.starWrap}>
        <svg
          className={styles.starEmpty}
          width="16"
          height="16"
          aria-hidden="true"
        >
          <use href="/icons.svg#icon-star" />
        </svg>
        <svg
          className={styles.starHalf}
          width="16"
          height="16"
          aria-hidden="true"
        >
          <use href="/icons.svg#icon-star" />
        </svg>
      </span>
    );
  }

  return (
    <svg
      className={fill === "full" ? styles.starFilled : styles.starEmpty}
      width="16"
      height="16"
      aria-hidden="true"
    >
      <use href="/icons.svg#icon-star" />
    </svg>
  );
}

export function ReviewCard({ review }: ReviewCardProps) {
  const rating = Math.min(MAX_RATING, Math.max(0, review.rating));

  return (
    <li className={styles.card}>
      <div className={styles.top}>
        <div>
          <p className={styles.author}>{review.author}</p>
          <p className={styles.date}>{review.date}</p>
        </div>
        <div
          className={styles.rating}
          role="img"
          aria-label={`Rating: ${formatRatingLabel(rating)} out of ${MAX_RATING}`}
        >
          {Array.from({ length: MAX_RATING }, (_, index) => (
            <StarIcon key={index} fill={getStarFill(rating, index)} />
          ))}
        </div>
      </div>
      <p className={styles.text}>{review.text}</p>
    </li>
  );
}
