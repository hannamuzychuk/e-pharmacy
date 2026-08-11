import { useAuth } from "../../store/auth";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { Outlet } from "react-router-dom";

export function SharedLayout() {
    const { isAuthenticated } = useAuth();

    return (
        <>
        <Header />
        <main>
            <Outlet />
        </main>
        {isAuthenticated && <Footer />}
        </>
    );
}