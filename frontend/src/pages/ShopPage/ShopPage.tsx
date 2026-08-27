import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AddMedicineModal } from "../../components/AddMedicineModal/AddMedicineModal";
import { EditMedicineModal } from "../../components/EditMedicineModal/EditMedicineModal";
import { DeleteMedicineModal } from "../../components/DeleteMedicineModal/DeleteMedicineModal";
import { EllipsisText } from "../../components/EllipsisText/EllipsisText";
import { AllMedicineTab } from "../../components/shop/AllMedicineTab";
import { CatalogPagination } from "../../components/shop/CatalogPagination";
import {
  getPageItems,
  useCatalogPageSize,
} from "../../components/shop/catalogPagination";
import { getShopRequest, type Shop } from "../../services/shopService";
import {
  formatProductPrice,
  getProductsRequest,
  type Product,
} from "../../services/productService";
import { getApiErrorMessage } from "../../services/http";
import { useAuth } from "../../store/auth";
import { getProductImageUrl } from "../../utils/productImage";
import styles from "./ShopPage.module.css";

type ShopTab = "drugStore" | "allMedicine";

export function ShopPage() {
  const navigate = useNavigate();
  const { shopId } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ShopTab>("drugStore");
  const [products, setProducts] = useState<Product[]>([]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = useCatalogPageSize();

  useEffect(() => {
    if (!shopId) {
      navigate("/create-shop", { replace: true });
      return;
    }

    const loadData = async () => {
      try {
        const [shopData, productsData] = await Promise.all([
          getShopRequest(shopId),
          getProductsRequest(shopId),
        ]);
        setShop(shopData);
        setProducts(productsData.products);
        setCatalog(productsData.catalog);
        setCategories(productsData.categories);
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        navigate("/create-shop", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [shopId, navigate]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, products.length]);

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageItems = useMemo(
    () => getPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleEditData = () => {
    navigate("/edit-shop");
  };

  const handleAddMedicine = () => {
    setIsAddMedicineOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleProductAdded = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    if (!categories.includes(product.category)) {
      setCategories((prev) => [...prev, product.category].sort());
    }
  };

  const handleProductUpdated = (product: Product) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? product : item)),
    );
    if (product.category && !categories.includes(product.category)) {
      setCategories((prev) => [...prev, product.category].sort());
    }
  };

  const handleProductDeleted = (productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  const shopProductKeys = useMemo(
    () => new Set(products.map((product) => `${product.name}|${product.supplier}`)),
    [products],
  );

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>{shop?.shopName ?? "Your shop"}</h1>

        <div className={styles.meta}>
          <div className={styles.info}>
            <p className={styles.owner}>
              <span className={styles.ownerLabel}>Owner:</span>{" "}
              {shop?.ownerName ?? "—"}
            </p>

            <div className={styles.contacts}>
              <div className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#icon-map-pin" />
                </svg>
                <span>
                  {shop
                    ? `${shop.streetAddress}, ${shop.city}`
                    : isLoading
                      ? "Loading..."
                      : "—"}
                </span>
              </div>

              <div className={styles.contactItem}>
                <svg
                  className={styles.contactIcon}
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#icon-phone" />
                </svg>
                <span>{shop?.phone ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={`btn btnSoft ${styles.editBtn}`}
              type="button"
              onClick={handleEditData}
            >
              Edit data
            </button>
            <button
              className={`btn btnPrimary ${styles.addBtn}`}
              type="button"
              onClick={handleAddMedicine}
            >
              Add medicine
            </button>
          </div>
        </div>
      </div>

      <div className={styles.tabs} role="tablist">
        <button
          className={`${styles.tab} ${activeTab === "drugStore" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "drugStore"}
          onClick={() => setActiveTab("drugStore")}
        >
          Drug store
        </button>
        <button
          className={`${styles.tab} ${activeTab === "allMedicine" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "allMedicine"}
          onClick={() => setActiveTab("allMedicine")}
        >
          All medicine
        </button>
      </div>

      {activeTab === "drugStore" ? (
        <>
          <ul className={styles.productList}>
            {visibleProducts.map((product) => (
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
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btnSoft ${styles.productBtn}`}
                      type="button"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <CatalogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={setPage}
            label="Drug store pagination"
          />
        </>
      ) : shopId ? (
        <AllMedicineTab
          shopId={shopId}
          catalog={catalog}
          categories={categories}
          shopProductKeys={shopProductKeys}
          onAdded={handleProductAdded}
        />
      ) : null}

      {isAddMedicineOpen && shopId ? (
        <AddMedicineModal
          shopId={shopId}
          onClose={() => setIsAddMedicineOpen(false)}
          onAdded={handleProductAdded}
        />
      ) : null}

      {editingProduct && shopId ? (
        <EditMedicineModal
          shopId={shopId}
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onUpdated={handleProductUpdated}
        />
      ) : null}

      {deletingProduct && shopId ? (
        <DeleteMedicineModal
          shopId={shopId}
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={handleProductDeleted}
        />
      ) : null}
    </div>
  );
}
