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
  suppliers: string[];
  shopProductKeys: Set<string>;
  onAdded: (product: Product) => void;
};

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
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      width={335}
                      height={300}
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
