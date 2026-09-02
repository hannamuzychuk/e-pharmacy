import styles from "./CatalogPagination.module.css";

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageItems: Array<number | "ellipsis">;
  onPageChange: (page: number) => void;
  label?: string;
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

export function CatalogPagination({
  currentPage,
  totalPages,
  pageItems,
  onPageChange,
  label = "Catalog pagination",
}: CatalogPaginationProps) {
  const items =
    totalPages <= 1 ? [currentPage] : pageItems;

  return (
    <nav className={styles.pagination} aria-label={label}>
      <div className={styles.navGroup}>
        <button
          className={styles.pageBtn}
          type="button"
          aria-label="First page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
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
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          <PaginationIcon id="icon-chevron-left" className={styles.icon} />
        </button>
      </div>

      <div className={styles.pageGroup}>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={item}
              className={`${styles.pageBtn} ${styles.pageBtnNumber} ${
                item === currentPage ? styles.pageBtnActive : ""
              }`}
              type="button"
              aria-current={item === currentPage ? "page" : undefined}
              onClick={() => onPageChange(item)}
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
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          <PaginationIcon id="icon-chevron-right" className={styles.icon} />
        </button>
        <button
          className={styles.pageBtn}
          type="button"
          aria-label="Last page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <PaginationIcon
            id="icon-chevron-right-double"
            className={styles.iconDouble}
          />
        </button>
      </div>
    </nav>
  );
}
