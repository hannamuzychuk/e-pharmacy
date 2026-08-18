import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getShopRequest, updateShopRequest } from "../../services/shopService";
import { getApiErrorMessage } from "../../services/http";
import { useAuth } from "../../store/auth";
import styles from "../CreateShopPage/CreateShopPage.module.css";
import createShopMobile from "../../images/create-shop-mobile.jpg";
import createShopTablet from "../../images/create-shop-tablet.jpg";
import createShopDesktop from "../../images/create-shop-desktop.jpg";

type EditShopFormValues = {
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  hasDelivery: "yes" | "no";
};

const emptyShopData: EditShopFormValues = {
  shopName: "",
  ownerName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  zipCode: "",
  hasDelivery: "yes",
};

const enableAutofill = (event: React.FocusEvent<HTMLInputElement>) => {
  event.currentTarget.removeAttribute("readOnly");
};

export function EditShopPage() {
  const navigate = useNavigate();
  const { shopId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditShopFormValues>({
    mode: "onBlur",
    defaultValues: emptyShopData,
  });

  useEffect(() => {
    if (!shopId) {
      navigate("/create-shop", { replace: true });
      return;
    }

    const loadShop = async () => {
      try {
        const shop = await getShopRequest(shopId);
        reset({
          shopName: shop.shopName,
          ownerName: shop.ownerName,
          email: shop.email,
          phone: shop.phone,
          streetAddress: shop.streetAddress,
          city: shop.city,
          zipCode: shop.zipCode,
          hasDelivery: shop.hasDelivery,
        });
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        navigate("/shop", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    void loadShop();
  }, [shopId, navigate, reset]);

  const onInvalid = (formErrors: typeof errors) => {
    const messages = Object.values(formErrors)
      .map((error) => error?.message)
      .filter(Boolean);

    if (messages.length === 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    messages.forEach((message) => toast.error(String(message)));
  };

  const onSubmit = async (data: EditShopFormValues) => {
    try {
      setIsSubmitting(true);
      if (!shopId) {
        throw new Error("Shop not found");
      }

      await updateShopRequest(shopId, data);
      toast.success("Shop data updated successfully");
      navigate("/shop");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <p className={styles.subtitle}>Loading shop data...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Edit data</h1>
        <p className={styles.subtitle}>
          This information will be displayed publicly so be careful what you
          share.
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          autoComplete="off"
        >
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="shopName">
                Shop Name
              </label>
              <input
                id="shopName"
                className={styles.input}
                type="text"
                placeholder="Enter text"
                readOnly
                {...register("shopName", {
                  required: "Shop name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
                onFocus={enableAutofill}
              />
              {errors.shopName && (
                <p className={styles.error}>{errors.shopName.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="ownerName">
                Shop Owner Name
              </label>
              <input
                id="ownerName"
                className={styles.input}
                type="text"
                placeholder="Enter text"
                readOnly
                {...register("ownerName", {
                  required: "Owner name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
                onFocus={enableAutofill}
              />
              {errors.ownerName && (
                <p className={styles.error}>{errors.ownerName.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="Enter text"
                readOnly
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                onFocus={enableAutofill}
              />
              {errors.email && (
                <p className={styles.error}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                className={styles.input}
                type="tel"
                placeholder="Enter text"
                readOnly
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]{7,20}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                onFocus={enableAutofill}
              />
              {errors.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="streetAddress">
                Street Address
              </label>
              <input
                id="streetAddress"
                className={styles.input}
                type="text"
                placeholder="Enter text"
                readOnly
                {...register("streetAddress", {
                  required: "Street address is required",
                })}
                onFocus={enableAutofill}
              />
              {errors.streetAddress && (
                <p className={styles.error}>{errors.streetAddress.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">
                City
              </label>
              <input
                id="city"
                className={styles.input}
                type="text"
                placeholder="Enter text"
                readOnly
                {...register("city", {
                  required: "City is required",
                })}
                onFocus={enableAutofill}
              />
              {errors.city && (
                <p className={styles.error}>{errors.city.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="zip">
                Zip / Postal
              </label>
              <input
                id="zip"
                className={styles.input}
                type="text"
                placeholder="Enter text"
                readOnly
                {...register("zipCode", {
                  required: "Zip / Postal is required",
                })}
                onFocus={enableAutofill}
              />
              {errors.zipCode && (
                <p className={styles.error}>{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <fieldset className={styles.delivery}>
            <legend className={styles.label}>Has Own Delivery System?</legend>
            <div className={styles.radios}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  value="yes"
                  {...register("hasDelivery", {
                    required: "Please select an option",
                  })}
                />
                <span className={styles.radioMark} aria-hidden="true">
                  <svg className={styles.radioIconOff} width="18" height="18">
                    <use href="/icons.svg#icon-radio" />
                  </svg>
                  <svg className={styles.radioIconOn} width="18" height="18">
                    <use href="/icons.svg#icon-radio-checked" />
                  </svg>
                </span>
                <span>Yes</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  value="no"
                  {...register("hasDelivery", {
                    required: "Please select an option",
                  })}
                />
                <span className={styles.radioMark} aria-hidden="true">
                  <svg className={styles.radioIconOff} width="18" height="18">
                    <use href="/icons.svg#icon-radio" />
                  </svg>
                  <svg className={styles.radioIconOn} width="18" height="18">
                    <use href="/icons.svg#icon-radio-checked" />
                  </svg>
                </span>
                <span>No</span>
              </label>
            </div>
          </fieldset>

          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </section>

      <div className={styles.imageWrap}>
        <picture>
          <source media="(min-width: 1440px)" srcSet={createShopDesktop} />
          <source media="(min-width: 768px)" srcSet={createShopTablet} />
          <img
            className={styles.image}
            src={createShopMobile}
            alt="Medicine products"
            width={335}
            height={470}
          />
        </picture>
      </div>
    </div>
  );
}
