import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ProductOverview } from "../../components/medicine/ProductOverview";
import {
  TabsContainer,
  type MedicineTab,
} from "../../components/medicine/TabsContainer";
import type { Medicine } from "../../components/medicine/types";
import {
  addProductRequest,
  formatProductPrice,
  getProductRequest,
  getProductsRequest,
  type Product,
  type ProductReview,
} from "../../services/productService";
import { getApiErrorMessage } from "../../services/http";
import { useAuth } from "../../store/auth";
import styles from "./MedicinePage.module.css";
import createShopMobile from "../../images/create-shop-mobile.jpg";

function toMedicine(
  product: Product,
  reviews: ProductReview[],
): Medicine {
  const descriptionText =
    product.description ||
    `${product.name} is a ${product.category.toLowerCase()} product supplied by ${product.supplier}. Current stock: ${product.stock}.`;

  return {
    id: product.id,
    name: product.name,
    supplier: product.supplier,
    price: formatProductPrice(product.price),
    image: product.image || createShopMobile,
    description: [{ text: descriptionText }],
    reviews: reviews.map((review) => ({
      id: review.id,
      author: review.author,
      date: review.date || "Recently",
      text: review.text,
    })),
  };
}

export function MedicinePage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { shopId } = useAuth();
  const [activeTab, setActiveTab] = useState<MedicineTab>("description");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!shopId) {
      navigate("/create-shop", { replace: true });
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        let targetId = productId;

        if (!targetId) {
          const list = await getProductsRequest(shopId);
          targetId = list.products[0]?.id;
        }

        if (!targetId) {
          throw new Error("No medicines found");
        }

        if (!productId) {
          navigate(`/medicine/${targetId}`, { replace: true });
          return;
        }

        const data = await getProductRequest(shopId, targetId);
        setProduct(data.product);
        setMedicine(toMedicine(data.product, data.reviews));
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        navigate("/shop", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [shopId, productId, navigate]);

  const handleAddToShop = async () => {
    if (!shopId || !product) {
      return;
    }

    try {
      setIsAdding(true);
      await addProductRequest(shopId, {
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
        suppliers: product.suppliers,
      });
      toast.success("Medicine added to shop");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading || !medicine) {
    return (
      <div className={styles.page}>
        <p className={styles.status}>Loading medicine...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ProductOverview
        medicine={medicine}
        isAdding={isAdding}
        onAdd={handleAddToShop}
      />
      <TabsContainer
        medicine={medicine}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
