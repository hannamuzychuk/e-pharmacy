import { createBrowserRouter, Navigate } from "react-router-dom";
import { SharedLayout } from "../components/SharedLayout/SharedLayout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";
import { ShopPage } from "../pages/ShopPage/ShopPage";
import { MedicinePage } from "../pages/MedicinePage/MedicinePage";
import { StatisticsPage } from "../pages/StatisticsPage/StatisticsPage";
import { CreateShopPage } from "../pages/CreateShopPage/CreateShopPage";
import { EditShopPage } from "../pages/EditShopPage/EditShopPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        element: <PublicRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          { path: "shop", element: <ShopPage /> },
          { path: "medicine", element: <MedicinePage /> },
          { path: "medicine/:productId", element: <MedicinePage /> },
          { path: "statistics", element: <StatisticsPage /> },
          { path: "create-shop", element: <CreateShopPage /> },
          { path: "edit-shop", element: <EditShopPage /> },
        ],
      },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
