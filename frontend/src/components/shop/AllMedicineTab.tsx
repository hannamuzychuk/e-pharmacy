import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addCatalogToShopRequest,
  formatProductPrice,
  getProductsRequest,
  type Product,
} from "../../services/productService";
import { EllipsisText } from "../EllipsisText/EllipsisText";
import styles from "./AllMedicineTab.module.css";
import { FilterSelect } from "./FilterSelect";
import { CatalogPagination } from "./CatalogPagination";
import {
  getPageItems,
  useCatalogPageSize,
} from "./catalogPagination";
import { getProductImageUrl } from "../../utils/productImage";

type AllMedicineTabProps = {
  shopId: string;
  catalog: Product[];
  categories: string[];
  shopProductKeys: Set<string>;
  onAdded: (product: Product) => void;
};

type Filters = {
  search: string;
  category: string;
};

const INITIAL_FILTERS: Filters = {
  search: "",
  category: "all",
};

export function AllMedicineTab({
  shopId,
  catalog,
  categories,
  shopProductKeys,
  onAdded,
}: AllMedicineTabProps) {
  const [draft, setDraft] = useState<Filters>(INITIAL_FILTERS);
  const [applied, setApplied] = useState<Filters>(INITIAL_FILTERS);
  const [filteredCatalog, setFilteredCatalog] = useState(catalog);
  const [isFiltering, setIsFiltering] = useState(false);
  const [page, setPage] = useState(1);
  const [addingId, setAddingId] = useState<string | null>(null);
  const pageSize = useCatalogPageSize();

  useEffect(() => {
    setFilteredCatalog(catalog);
  }, [catalog]);

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
  }, [applied, pageSize, filteredCatalog.length]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleFilter = async () => {
    try {
      setIsFiltering(true);
      const data = await getProductsRequest(shopId, {
        category: draft.category,
        search: draft.search,
      });
      setApplied(draft);
      setFilteredCatalog(data.catalog);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsFiltering(false);
    }
  };

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

  return (
    <div className={styles.wrap}>
      <form
        className={styles.filters}
        onSubmit={(event) => {
          event.preventDefault();
          void handleFilter();
        }}
      >
        <FilterSelect
          label="Product category"
          hideLabel
          placeholder="Product category"
          value={draft.category}
          options={categoryOptions}
          onChange={(category) =>
            setDraft((prev) => ({ ...prev, category }))
          }
        />

        <label className={styles.field}>
          <span className={styles.srOnly}>Search medicine</span>
          <input
            className={styles.input}
            type="search"
            placeholder="Search medicine"
            value={draft.search}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, search: event.target.value }))
            }
          />
        </label>

        <button
          className={styles.filterBtn}
          type="submit"
          disabled={isFiltering}
        >
          <svg width="16" height="16" aria-hidden="true">
            <use href="/icons.svg#icon-filter" />
          </svg>
          {isFiltering ? "..." : "Filter"}
        </button>
      </form>

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
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      width={335}
                      height={300}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className={styles.productCard}>
                    <div className={styles.productTop}>
                      <div className={styles.productText}>
                        <h2 className={styles.productName}>
                          <Link to={`/medicine/${product.id}`}>
                            <EllipsisText text={product.name} length={22} />
                          </Link>
                        </h2>
                        <p className={styles.productSupplier}>
                          <EllipsisText text={product.supplier} length={24} />
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
                        className={styles.detailsLink}
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

          <CatalogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
