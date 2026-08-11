import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";

export function PublicRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/shop" replace /> : <Outlet />;
}