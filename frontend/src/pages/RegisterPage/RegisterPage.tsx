import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerRequest } from "../../services/authService";
import styles from "./RegisterPage.module.css";
import pillMobile from "../../images/mobile-white-round-pill.png";
import pillTablet from "../../images/tablet-white-round-pill.png";
import pillDesktop from "../../images/desktop-white-round-pill.png";

type RegisterFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

const enableAutofill = (event: React.FocusEvent<HTMLInputElement>) => {
  event.currentTarget.removeAttribute("readOnly");
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: "onBlur",
  });

  const onInvalid = (
    formErrors: typeof errors,
  ) => {
    const messages = Object.values(formErrors)
      .map((error) => error?.message)
      .filter(Boolean);

    if (messages.length === 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    messages.forEach((message) => toast.error(String(message)));
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      await registerRequest(data);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <picture className={styles.pill}>
        <source media="(min-width: 1440px)" srcSet={pillDesktop} />
        <source media="(min-width: 768px)" srcSet={pillTablet} />
        <img src={pillMobile} alt="" width={95} height={93} />
      </picture>

      <section className={styles.left}>
        <h1>
          Your medication,
          <br />
          delivered Say goodbye
          <br />
          to all <em className={styles.accent}>your healthcare</em>
          <br />
          worries with us
        </h1>
      </section>

      <section className={styles.right}>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
          autoComplete="off"
        >
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.srOnly} htmlFor="name">
                User name
              </label>
              <input
                id="name"
                className={styles.input}
                type="text"
                placeholder="User name"
                autoComplete="name"
                readOnly
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Minimum 2 characters",
                  },
                })}
                onFocus={enableAutofill}
              />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.srOnly} htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="Email address"
                autoComplete="email"
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
              <label className={styles.srOnly} htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                className={styles.input}
                type="tel"
                placeholder="Phone number"
                autoComplete="tel"
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
              <label className={styles.srOnly} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                readOnly
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                  pattern: {
                    value: /[!@#$%^&*(),.?":{}|<>_\-+=]/,
                    message: "Password must contain a special character",
                  },
                })}
                onFocus={enableAutofill}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}
            </div>
          </div>

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className={styles.hint}>
          <Link to="/login">Already have an account?</Link>
        </p>
      </section>
    </div>
  );
}
