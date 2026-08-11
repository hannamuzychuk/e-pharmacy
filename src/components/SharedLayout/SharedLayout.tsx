import { useAuth } from "../../store/auth";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import styles from "./SharedLayout.module.css";

export function SharedLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}
