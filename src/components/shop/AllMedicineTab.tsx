import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addCatalogToShopRequest,
  formatProductPrice,
  type Product,
} from "../../services/productService";
import styles from "./AllMedicineTab.module.css";
import { FilterSelect } from "./FilterSelect";
import createShopMobile from "../../images/create-shop-mobile.jpg";

const MOBILE_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 8;
const DESKTOP_MEDIA_QUERY = "(min-width: 1440px)";

function useCatalogPageSize() {
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") {
      return MOBILE_PAGE_SIZE;
    }

    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      ? DESKTOP_PAGE_SIZE
      : MOBILE_PAGE_SIZE;
  });

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updatePageSize = () => {
      setPageSize(media.matches ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE);
    };

    updatePageSize();
    media.addEventListener("change", updatePageSize);

    return () => media.removeEventListener("change", updatePageSize);
  }, []);

  return pageSize;
}

type AllMedicineTabProps = {
  shopId: string;
  catalog: Product[];
  categories: string[];
  suppliers: string[];
  shopProductKeys: Set<string>;
  onAdded: (product: Product) => void;
};

function getProductImage(image: string | null | undefined) {
  if (!image) {
    return createShopMobile;
  }

  return image;
}

function getPageItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 4) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  if (current <= 2) {
    return [1, 2, 3, "ellipsis"];
  }

  if (current >= total - 1) {
    return ["ellipsis", total - 2, total - 1, total];
  }

  return ["ellipsis", current - 1, current, current + 1, "ellipsis"];
}

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

export function AllMedicineTab({
  shopId,
  catalog,
  categories,
  suppliers,
  shopProductKeys,
  onAdded,
}: AllMedicineTabProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [supplier, setSupplier] = useState("all");
  const [page, setPage] = useState(1);
  const [addingId, setAddingId] = useState<string | null>(null);
  const pageSize = useCatalogPageSize();

  const filteredCatalog = useMemo(() => {
    const query = search.trim().toLowerCase();

    return catalog.filter((product) => {
      if (category !== "all" && product.category !== category) {
        return false;
      }

      if (supplier !== "all" && product.supplier !== supplier) {
        return false;
      }

      if (
        query &&
        !product.name.toLowerCase().includes(query) &&
        !product.description.toLowerCase().includes(query)
      ) {
        return false;
      }

      return true;
    });
  }, [catalog, category, supplier, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredCatalog.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageItems = useMemo(
    () => getPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  useEffect(() => {
    setPage(1);
  }, [search, category, supplier, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleAddToShop = async (product: Product) => {
    const productKey = `${product.name}|${product.supplier}`;

    if (shopProductKeys.has(productKey)) {
      toast.error("Product is already in your shop");
      return;
    }

    try {
      setAddingId(product.id);
      const { product: addedProduct, message } = await addCatalogToShopRequest(
        shopId,
        product.id,
      );
      onAdded(addedProduct);
      toast.success(message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setAddingId(null);
    }
  };

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "All categories" },
      ...categories.map((item) => ({ value: item, label: item })),
    ],
    [categories],
  );

  const supplierOptions = useMemo(
    () => [
      { value: "all", label: "All suppliers" },
      ...suppliers.map((item) => ({ value: item, label: item })),
    ],
    [suppliers],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            className={styles.input}
            type="search"
            placeholder="Search medicine"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <FilterSelect
          label="Category"
          value={category}
          options={categoryOptions}
          onChange={setCategory}
        />

        <FilterSelect
          label="Supplier"
          value={supplier}
          options={supplierOptions}
          onChange={setSupplier}
        />
      </div>

      {filteredCatalog.length === 0 ? (
        <p className={styles.empty}>No medicines match your filters.</p>
      ) : (
        <>
          <ul className={styles.productList}>
            {visibleProducts.map((product) => {
              const productKey = `${product.name}|${product.supplier}`;
              const isInShop = shopProductKeys.has(productKey);
              const isAdding = addingId === product.id;

              return (
                <li key={product.id} className={styles.product}>
                  <Link to={`/medicine/${product.id}`}>
                    <img
                      className={styles.productImage}
                      src={getProductImage(product.image)}
                      alt={product.name}
                      width={335}
                      height={300}
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <div className={styles.productCard}>
                    <div className={styles.productTop}>
                      <div className={styles.productText}>
                        <h2 className={styles.productName}>
                          <Link to={`/medicine/${product.id}`}>
                            {product.name}
                          </Link>
                        </h2>
                        <p className={styles.productSupplier}>
                          {product.supplier}
                        </p>
                      </div>
                      <p className={styles.productPrice}>
                        {formatProductPrice(product.price)}
                      </p>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={`btn btnPrimary ${styles.productBtn}`}
                        type="button"
                        disabled={isInShop || isAdding}
                        onClick={() => handleAddToShop(product)}
                      >
                        {isAdding ? "..." : isInShop ? "Added" : "Add to shop"}
                      </button>
                      <Link
                        className={`btn btnSoft ${styles.productBtn} ${styles.detailsBtn}`}
                        to={`/medicine/${product.id}`}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 ? (
            <nav className={styles.pagination} aria-label="Catalog pagination">
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
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
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
        </>
      )}
    </div>
  );
}
