import { useState } from "react";
import toast from "react-hot-toast";
import { ProductOverview } from "../../components/medicine/ProductOverview";
import {
  TabsContainer,
  type MedicineTab,
} from "../../components/medicine/TabsContainer";
import { mockMedicine } from "../../components/medicine/mockMedicine";
import styles from "./MedicinePage.module.css";

export function MedicinePage() {
  const [activeTab, setActiveTab] = useState<MedicineTab>("description");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToShop = async () => {
    try {
      setIsAdding(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success("Medicine added to shop");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.page}>
      <ProductOverview
        medicine={mockMedicine}
        isAdding={isAdding}
        onAdd={handleAddToShop}
      />
      <TabsContainer
        medicine={mockMedicine}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
