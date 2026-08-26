import { useMemo, useState } from "react";
import { ReviewCard } from "./ReviewCard";
import styles from "./ReviewsTab.module.css";
import type { Review } from "./types";
import { getPageItems } from "../shop/catalogPagination";

const PAGE_SIZE = 3;

type ReviewsTabProps = {
  reviews: Review[];
};

function PaginationIcon({
  id,
  className,
}: {
  id: string;
  className: string;
}) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`/icons.svg#${id}`} />
    </svg>
  );
}

export function ReviewsTab({ reviews }: ReviewsTabProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleReviews = reviews.slice(start, start + PAGE_SIZE);
  const pageItems = useMemo(
    () => getPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (reviews.length === 0) {
    return <p className={styles.empty}>No reviews yet</p>;
  }

  return (
    <div className={styles.wrap}>
      <ul className={styles.list}>
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav className={styles.pagination} aria-label="Reviews pagination">
          <div className={styles.navGroup}>
            <button
              className={styles.pageBtn}
              type="button"
              aria-label="First page"
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
            >
              <PaginationIcon
                id="icon-chevron-left-double"
                className={styles.iconDouble}
              />
            </button>
            <button
              className={styles.pageBtn}
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              <PaginationIcon
                id="icon-chevron-left"
                className={styles.icon}
              />
            </button>
          </div>

          <div className={styles.pageGroup}>
            {pageItems.map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className={styles.ellipsis}
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  className={
                    item === currentPage
                      ? `${styles.pageBtn} ${styles.pageBtnActive}`
                      : `${styles.pageBtn} ${styles.pageBtnNumber}`
                  }
                  type="button"
                  aria-label={`Page ${item}`}
                  aria-current={item === currentPage ? "page" : undefined}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <div className={styles.navGroup}>
            <button
              className={styles.pageBtn}
              type="button"
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              <PaginationIcon
                id="icon-chevron-right"
                className={styles.icon}
              />
            </button>
            <button
              className={styles.pageBtn}
              type="button"
              aria-label="Last page"
              disabled={currentPage === totalPages}
              onClick={() => setPage(totalPages)}
            >
              <PaginationIcon
                id="icon-chevron-right-double"
                className={styles.iconDouble}
              />
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
