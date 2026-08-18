import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";

export function PublicRoute() {
  const { isAuthenticated, shopId } = useAuth();
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={shopId ? "/shop" : "/create-shop"} replace />;
}