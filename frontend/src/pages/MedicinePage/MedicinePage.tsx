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
  addCatalogToShopRequest,
  formatProductPrice,
  getProductRequest,
  getProductsRequest,
  type Product,
  type ProductReview,
} from "../../services/productService";
import { getApiErrorMessage } from "../../services/http";
import { useAuth } from "../../store/auth";
import { Loader } from "../../components/Loader/Loader";
import { getProductImageUrl } from "../../utils/productImage";
import styles from "./MedicinePage.module.css";

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
    image: getProductImageUrl(product.image),
    description: [{ text: descriptionText }],
    reviews: reviews.map((review) => ({
      id: review.id,
      author: review.author,
      date: review.date,
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
  const [isInShop, setIsInShop] = useState(false);
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
          targetId = list.catalog[0]?.id ?? list.products[0]?.id;
        }

        if (!targetId) {
          throw new Error("No medicines found");
        }

        if (!productId) {
          navigate(`/medicine/${targetId}`, { replace: true });
          return;
        }

        const [data, list] = await Promise.all([
          getProductRequest(shopId, targetId),
          getProductsRequest(shopId),
        ]);

        const shopKeys = new Set(
          list.products.map(
            (item) => `${item.name}|${item.suppliers || item.supplier}`,
          ),
        );
        const key = `${data.product.name}|${data.product.suppliers || data.product.supplier}`;

        setProduct(data.product);
        setMedicine(toMedicine(data.product, data.reviews));
        setIsInShop(shopKeys.has(key));
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
    if (!shopId || !product || isInShop) {
      return;
    }

    try {
      setIsAdding(true);
      const { message } = await addCatalogToShopRequest(shopId, product.id);
      setIsInShop(true);
      toast.success(message || "Medicine added to shop");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : getApiErrorMessage(error),
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading || !medicine) {
    return (
      <div className={styles.page}>
        <Loader label="Loading medicine..." />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ProductOverview
        medicine={medicine}
        isAdding={isAdding}
        isInShop={isInShop}
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
