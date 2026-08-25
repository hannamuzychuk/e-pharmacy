import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logoMobile from "../../images/logo-mobile.png";
import logoDesktop from "../../images/logo-desktop.png";

const navItems = [
  { to: "/shop", label: "Shop" },
  { to: "/medicine", label: "Medicine" },
  { to: "/statistics", label: "Statistics" },
];

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/goITclub/",
    iconId: "icon-facebook",
    width: 28,
    height: 28,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/goitclub/",
    iconId: "icon-instagram",
    width: 28,
    height: 28,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/c/GoIT",
    iconId: "icon-youtube",
    width: 25,
    height: 18,
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link className={styles.logo} to="/shop">
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
              <span>E-Pharmacy</span>
            </Link>

            <p className={styles.tagline}>
              Created a drug franchise that embodies effective formulas and
              changes the approach to treatment.
            </p>
          </div>

          <nav className={styles.nav} aria-label="Footer">
            {navItems.map((item) => (
              <Link key={item.to} className={styles.navLink} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ul className={styles.socials}>
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    className={styles.socialLink}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <svg
                      width={social.width}
                      height={social.height}
                      aria-hidden="true"
                    >
                      <use href={`/icons.svg#${social.iconId}`} />
                    </svg>
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © E-Pharmacy 2023. All Rights Reserved
          </p>
          <span className={styles.sep} aria-hidden="true" />
          <a className={styles.legalLink} href="#">
            Privacy Policy
          </a>
          <span
            className={`${styles.sep} ${styles.sepDesktop}`}
            aria-hidden="true"
          />
          <a className={styles.legalLink} href="#">
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
}
