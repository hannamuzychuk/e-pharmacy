import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AddMedicineModal } from "../../components/AddMedicineModal/AddMedicineModal";
import { EditMedicineModal } from "../../components/EditMedicineModal/EditMedicineModal";
import { DeleteMedicineModal } from "../../components/DeleteMedicineModal/DeleteMedicineModal";
import { getShopRequest, type Shop } from "../../services/shopService";
import {
  formatProductPrice,
  getProductsRequest,
  type Product,
} from "../../services/productService";
import { getApiErrorMessage } from "../../services/http";
import { useAuth } from "../../store/auth";
import styles from "./ShopPage.module.css";
import createShopMobile from "../../images/create-shop-mobile.jpg";

type ShopTab = "drugStore" | "allMedicine";

function getProductImage(image: string | null | undefined) {
  if (!image) {
    return createShopMobile;
  }

  return image;
}

export function ShopPage() {
  const navigate = useNavigate();
  const { shopId } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ShopTab>("drugStore");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

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
  };

  const handleProductDeleted = (productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

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
        <ul className={styles.productList}>
          {products.map((product) => (
            <li key={product.id} className={styles.product}>
              <Link to={`/medicine/${product.id}`}>
                <img
                  className={styles.productImage}
                  src={getProductImage(product.image)}
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
                    <p className={styles.productSupplier}>{product.supplier}</p>
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
      ) : (
        <p className={styles.placeholder}>
          {categories.length > 0
            ? `Categories: ${categories.join(", ")}`
            : "All medicine filters — coming soon"}
        </p>
      )}

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
