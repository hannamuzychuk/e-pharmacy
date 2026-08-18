import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteProductRequest } from "../../services/productService";
import { getApiErrorMessage } from "../../services/http";
import styles from "./DeleteMedicineModal.module.css";

export type DeleteMedicineProduct = {
  id: string;
  name: string;
  supplier: string;
  image: string;
};

type DeleteMedicineModalProps = {
  shopId: string;
  product: DeleteMedicineProduct;
  onClose: () => void;
  onDeleted?: (productId: string) => void;
};

export function DeleteMedicineModal({
  shopId,
  product,
  onClose,
  onDeleted,
}: DeleteMedicineModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await deleteProductRequest(shopId, product.id);
      toast.success("Medicine deleted successfully");
      onDeleted?.(product.id);
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-medicine-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          <svg
            className={styles.closeIcon}
            width="20"
            height="20"
            aria-hidden="true"
          >
            <use href="/icons.svg#icon-close-20" />
          </svg>
        </button>

        <h2 id="delete-medicine-title" className={styles.title}>
          Confirm deletion
        </h2>
        <p className={styles.message}>
          Are you sure you want to delete this item?
        </p>

        <div className={styles.product}>
          <div className={styles.previewFrame}>
            <img
              className={styles.preview}
              src={product.image}
              alt={product.name}
              width={130}
              height={130}
            />
          </div>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productSupplier}>{product.supplier}</p>
        </div>

        <div className={styles.actions}>
          <button
            className={`btn btnPrimary ${styles.confirmBtn}`}
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Confirm"}
          </button>
          <button
            className={`btn btnCancel ${styles.cancelBtn}`}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
