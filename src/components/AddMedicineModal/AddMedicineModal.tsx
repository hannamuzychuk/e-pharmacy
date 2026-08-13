import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styles from "./AddMedicineModal.module.css";
import defaultPreview from "../../images/medicine-placeholder.png";
import defaultPreview2x from "../../images/medicine-placeholder-2x.png";

type AddMedicineFormValues = {
  name: string;
  price: string;
  description: string;
};

type AddMedicineModalProps = {
  onClose: () => void;
};

export function AddMedicineModal({ onClose }: AddMedicineModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(defaultPreview);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMedicineFormValues>({
    mode: "onBlur",
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

  const onSubmit = async (data: AddMedicineFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = { ...data, image: imageFile };
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!payload.name) {
        throw new Error("Medicine name is required");
      }
      toast.success("Medicine added successfully");
      reset();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={closeWithoutSaving}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-medicine-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          type="button"
          aria-label="Close"
          onClick={closeWithoutSaving}
        >
          <svg className={styles.closeIcon} width="20" height="20" aria-hidden="true">
            <use href="/icons.svg#icon-close-20" />
          </svg>
        </button>

        <h2 id="add-medicine-title" className={styles.title}>
          Add medicine to store
        </h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
        >
          <div className={styles.upload}>
            <div
              className={`${styles.previewFrame}${imageFile ? ` ${styles.previewFrameFilled}` : ""}`}
            >
              <img
                className={styles.preview}
                src={imagePreview}
                srcSet={
                  !imageFile
                    ? `${defaultPreview} 1x, ${defaultPreview2x} 2x`
                    : undefined
                }
                alt="Medicine preview"
                width={130}
                height={130}
              />
            </div>
            <input
              ref={fileInputRef}
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={onImageChange}
            />
            <button
              className={styles.uploadBtn}
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                className={styles.uploadIcon}
                width="18"
                height="18"
                aria-hidden="true"
              >
                <use href="/icons.svg#icon-attachment" />
              </svg>
              Upload image
            </button>
          </div>

          <div className={styles.fieldsRow}>
            <label className={styles.field}>
              <span className={styles.label}>Medicine Name</span>
              <input
                className={styles.input}
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

            <label className={styles.field}>
              <span className={styles.label}>Price</span>
              <input
                className={styles.input}
                type="text"
                inputMode="decimal"
                placeholder="Enter text"
                autoComplete="off"
                {...register("price", {
                  required: "Price is required",
                  pattern: {
                    value: /^\d+([.,]\d{1,2})?$/,
                    message: "Enter a valid price",
                  },
                })}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>Description</span>
            <div className={styles.textareaShell}>
              <textarea
                className={styles.textarea}
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

          <div className={styles.actions}>
            <button
              className={`btn btnPrimary ${styles.submitBtn}`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add medicine"}
            </button>
            <button
              className={`btn btnCancel ${styles.cancelBtn}`}
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
