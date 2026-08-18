import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  updateProductRequest,
  type Product,
} from "../../services/productService";
import { getApiErrorMessage } from "../../services/http";
import shared from "../AddMedicineModal/AddMedicineModal.module.css";
import styles from "./EditMedicineModal.module.css";

export type EditMedicineProduct = Product;

type EditMedicineFormValues = {
  name: string;
  price: string;
  description: string;
};

type EditMedicineModalProps = {
  shopId: string;
  product: EditMedicineProduct;
  onClose: () => void;
  onUpdated?: (product: Product) => void;
};

const defaultDescription =
  "Although it's typically considered safe, excessive consumption can lead to side effects. Therefore, it's recommended to consult a healthcare professional before using.";

export function EditMedicineModal({
  shopId,
  product,
  onClose,
  onUpdated,
}: EditMedicineModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product.image);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditMedicineFormValues>({
    mode: "onBlur",
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description || defaultDescription,
    },
  });

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

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const closeWithoutSaving = () => {
    reset();
    onClose();
  };

  const onInvalid = (formErrors: typeof errors) => {
    const messages = Object.values(formErrors)
      .map((error) => error?.message)
      .filter(Boolean);

    if (messages.length === 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    messages.forEach((msg) => toast.error(String(msg)));
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      event.target.value = "";
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image must be under ${maxSizeMb}MB`);
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: EditMedicineFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await updateProductRequest(shopId, product.id, {
        name: data.name,
        price: data.price,
        description: data.description,
        category: product.category,
        stock: product.stock,
        suppliers: product.suppliers,
        photo: imageFile,
      });
      toast.success("Medicine updated successfully");
      onUpdated?.(result.product);
      reset();
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={shared.overlay}
      onClick={closeWithoutSaving}
      role="presentation"
    >
      <div
        className={shared.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-medicine-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={shared.closeBtn}
          type="button"
          aria-label="Close"
          onClick={closeWithoutSaving}
        >
          <svg
            className={shared.closeIcon}
            width="20"
            height="20"
            aria-hidden="true"
          >
            <use href="/icons.svg#icon-close-20" />
          </svg>
        </button>

        <h2 id="edit-medicine-title" className={shared.title}>
          Edit medicine
        </h2>

        <form
          className={shared.form}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
        >
          <div className={shared.upload}>
            <div
              className={`${shared.previewFrame} ${shared.previewFrameFilled}`}
            >
              <img
                className={shared.preview}
                src={imagePreview}
                alt="Medicine preview"
                width={130}
                height={130}
              />
            </div>
            <input
              ref={fileInputRef}
              className={shared.fileInput}
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />
            <button
              className={shared.uploadBtn}
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                className={shared.uploadIcon}
                width="18"
                height="18"
                aria-hidden="true"
              >
                <use href="/icons.svg#icon-attachment" />
              </svg>
              Change image
            </button>
          </div>

          <div className={shared.fieldsRow}>
            <label className={shared.field}>
              <span className={shared.label}>Medicine Name</span>
              <input
                className={`${shared.input} ${styles.inputFilled}`}
                type="text"
                placeholder="Enter text"
                autoComplete="off"
                {...register("name", {
                  required: "Medicine name is required",
                  minLength: {
                    value: 2,
                    message: "Medicine name must be at least 2 characters",
                  },
                })}
              />
            </label>

            <label className={shared.field}>
              <span className={shared.label}>Price</span>
              <input
                className={`${shared.input} ${styles.inputFilled}`}
                type="text"
                inputMode="decimal"
                placeholder="Enter text"
                autoComplete="off"
                {...register("price", {
                  required: "Price is required",
                  minLength: {
                    value: 1,
                    message: "Price is required",
                  },
                })}
              />
            </label>
          </div>

          <label className={shared.field}>
            <span className={shared.label}>Description</span>
            <div className={`${shared.textareaShell} ${styles.textareaShellFilled}`}>
              <textarea
                className={shared.textarea}
                placeholder="Enter text"
                rows={4}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                })}
              />
            </div>
          </label>

          <div className={shared.actions}>
            <button
              className={`btn btnPrimary ${shared.submitBtn} ${styles.submitBtn}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save medicine"}
            </button>
            <button
              className={`btn btnCancel ${shared.cancelBtn}`}
              type="button"
              onClick={closeWithoutSaving}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
