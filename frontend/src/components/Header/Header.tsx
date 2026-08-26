import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ResponsivePicture } from "../ResponsivePicture/ResponsivePicture";
import { logoDesktop, logoMobile } from "../../images/assets";
import styles from "./Header.module.css";

function LogoMark() {
  return (
    <ResponsivePicture
      sources={[
        { image: logoDesktop, media: "(min-width: 768px)" },
        { image: logoMobile },
      ]}
      imgClassName={styles.logoIcon}
      width={32}
      height={32}
    />
  );
}

const navItems = [
  { to: "/shop", label: "Shop" },
  { to: "/medicine", label: "Medicine" },
  { to: "/statistics", label: "Statistics" },
];

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
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

      <nav className={styles.nav} aria-label="Main">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className={styles.logout} type="button" onClick={handleLogout}>
        Log out
      </button>

      <button
        className={styles.menuButton}
        type="button"
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(true)}
      >
        <svg
          className={styles.menuIcon}
          width="32"
          height="26"
          aria-hidden="true"
        >
          <use href="/icons.svg#icon-menu" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className={styles.mobileMenu} role="dialog" aria-modal="true">
          <button
            className={styles.backdrop}
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          />

          <aside className={styles.drawer}>
            <button
              className={styles.closeButton}
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className={styles.closeIcon}
                width="32"
                height="32"
                aria-hidden="true"
              >
                <use href="/icons.svg#icon-close" />
              </svg>
            </button>

            <nav className={styles.drawerNav} aria-label="Mobile">
              <div className={styles.drawerLinks}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? styles.drawerLinkActive : styles.drawerLink
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <button
              className={styles.drawerLogout}
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </aside>
        </div>
      )}
    </header>
  );
}
