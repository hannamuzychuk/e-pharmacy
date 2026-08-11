import { useAuth } from "../../store/auth";
import { Link, NavLink, useNavigate } from "react-router-dom";

export function Header() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return (
            <header>
                <Link to="/">E-Pharmacy</Link>
            </header>
        );
    }

    return (
        <header>
        <Link to="/shop">E-Pharmacy</Link>
        <nav>
          <NavLink to="/shop">Shop</NavLink>{" | "}
          <NavLink to="/medicine">Medicine</NavLink>{" | "}
          <NavLink to="/statistics">Statistics</NavLink>
        </nav>
        <button onClick={handleLogout}>Log out</button>
      </header>
  
    )
}