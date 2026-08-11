import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useForm } from "react-hook-form";
import { loginRequest } from "../../services/authService";
import toast from "react-hot-toast";
import styles from "./LoginPage.module.css";
import pillMobile from "../../images/mobile-white-round-pill.png";
import pillTablet from "../../images/tablet-white-round-pill.png";
import pillDesktop from "../../images/desktop-white-round-pill.png";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
  });

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

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      await loginRequest(data);
      login();
      toast.success("Logged in successfully");
      navigate("/shop");
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
            onFocus={(event) => {
              event.currentTarget.removeAttribute("readOnly");
            }}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}

          <label className={styles.srOnly} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={styles.input}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            readOnly
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            onFocus={(event) => {
              event.currentTarget.removeAttribute("readOnly");
            }}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          <button className={styles.submit} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className={styles.hint}>
          <Link to="/register">Don&apos;t have an account?</Link>
        </p>
      </section>
    </div>
  );
}
