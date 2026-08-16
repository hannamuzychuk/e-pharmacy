import { DescriptionTab } from "./DescriptionTab";
import { ReviewsTab } from "./ReviewsTab";
import styles from "./TabsContainer.module.css";
import type { Medicine } from "./types";

export type MedicineTab = "description" | "reviews";

type TabsContainerProps = {
  medicine: Medicine;
  activeTab: MedicineTab;
  onTabChange: (tab: MedicineTab) => void;
};

export function TabsContainer({
  medicine,
  activeTab,
  onTabChange,
}: TabsContainerProps) {
  return (
    <section className={styles.card}>
      <div className={styles.tabs} role="tablist">
        <button
          className={`${styles.tab} ${activeTab === "description" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "description"}
          onClick={() => onTabChange("description")}
        >
          Description
        </button>
        <button
          className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`}
          type="button"
          role="tab"
          aria-selected={activeTab === "reviews"}
          onClick={() => onTabChange("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className={styles.content} role="tabpanel">
        {activeTab === "description" ? (
          <DescriptionTab paragraphs={medicine.description} />
        ) : (
          <ReviewsTab reviews={medicine.reviews} />
        )}
      </div>
    </section>
  );
}
