import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../store/auth";

export function PrivateRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}