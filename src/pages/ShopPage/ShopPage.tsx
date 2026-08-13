import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddMedicineModal } from "../../components/AddMedicineModal/AddMedicineModal";
import { EditMedicineModal } from "../../components/EditMedicineModal/EditMedicineModal";
import { DeleteMedicineModal } from "../../components/DeleteMedicineModal/DeleteMedicineModal";
import styles from "./ShopPage.module.css";
import createShopMobile from "../../images/create-shop-mobile.jpg";
import pillMobile from "../../images/mobile-white-round-pill.png";
import pillTablet from "../../images/tablet-white-round-pill.png";

type ShopTab = "drugStore" | "allMedicine";

type Product = {
  id: string;
  name: string;
  supplier: string;
  price: string;
  image: string;
};

const shopInfo = {
  name: "Huel LLC",
  owner: "Datha Harmon",
  address: "Kretoria F45",
  phone: "595-08-2102",
};

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Hydrochloride",
    supplier: "Framing (Wood)",
    price: "৳582",
    image: createShopMobile,
  },
  {
    id: "2",
    name: "Occidentalis",
    supplier: "Specialty Food Stores",
    price: "৳239",
    image: pillTablet,
  },
  {
    id: "3",
    name: "Octinoxate",
    supplier: "Other",
    price: "৳306",
    image: pillMobile,
  },
  {
    id: "4",
    name: "Prednisone",
    supplier: "Retail Sales of Other",
    price: "৳579",
    image: createShopMobile,
  },
  {
    id: "5",
    name: "Helminthos",
    supplier: "Hardware",
    price: "৳470",
    image: pillTablet,
  },
  {
    id: "6",
    name: "Alcohol",
    supplier: "Meat and Fish Markets",
    price: "৳748",
    image: pillMobile,
  },
];

export function ShopPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ShopTab>("drugStore");
  const [products, setProducts] = useState(initialProducts);
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

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

  const handleProductDeleted = (productId: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>{shopInfo.name}</h1>

        <div className={styles.meta}>
          <div className={styles.info}>
            <p className={styles.owner}>
              <span className={styles.ownerLabel}>Owner:</span> {shopInfo.owner}
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
                <span>{shopInfo.address}</span>
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
                <span>{shopInfo.phone}</span>
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
              <img
                className={styles.productImage}
                src={product.image}
                alt={product.name}
                width={335}
                height={300}
              />
              <div className={styles.productCard}>
                <div className={styles.productTop}>
                  <div className={styles.productText}>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.productSupplier}>{product.supplier}</p>
                  </div>
                  <p className={styles.productPrice}>{product.price}</p>
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
        <p className={styles.placeholder}>All medicine filters — coming soon</p>
      )}

      {isAddMedicineOpen ? (
        <AddMedicineModal onClose={() => setIsAddMedicineOpen(false)} />
      ) : null}

      {editingProduct ? (
        <EditMedicineModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      ) : null}

      {deletingProduct ? (
        <DeleteMedicineModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={handleProductDeleted}
        />
      ) : null}
    </div>
  );
}
