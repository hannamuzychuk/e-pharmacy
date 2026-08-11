import { useAuth } from "../../store/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logoMobile from "../../images/logo-mobile.png";
import logoDesktop from "../../images/logo-desktop.png";

function LogoMark() {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={logoDesktop} />
      <img
        className={styles.logoIcon}
        src={logoMobile}
        alt=""
        width={32}
        height={32}
      />
    </picture>
  );
}

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <header className={styles.header}>
        <Link className={styles.logo} to="/register">
          <LogoMark />
          <span>E-Pharmacy</span>
        </Link>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/shop">
        <LogoMark />
        <span>E-Pharmacy</span>
      </Link>
      <nav className={styles.nav}>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/medicine">Medicine</NavLink>
        <NavLink to="/statistics">Statistics</NavLink>
      </nav>
      <button className={styles.logout} type="button" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
