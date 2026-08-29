import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { SharedLayout } from "../components/SharedLayout/SharedLayout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { Loader } from "../components/Loader/Loader";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";

const ShopPage = lazy(() =>
  import("../pages/ShopPage/ShopPage").then((m) => ({ default: m.ShopPage })),
);
const MedicinePage = lazy(() =>
  import("../pages/MedicinePage/MedicinePage").then((m) => ({
    default: m.MedicinePage,
  })),
);
const StatisticsPage = lazy(() =>
  import("../pages/StatisticsPage/StatisticsPage").then((m) => ({
    default: m.StatisticsPage,
  })),
);
const CreateShopPage = lazy(() =>
  import("../pages/CreateShopPage/CreateShopPage").then((m) => ({
    default: m.CreateShopPage,
  })),
);
const EditShopPage = lazy(() =>
  import("../pages/EditShopPage/EditShopPage").then((m) => ({
    default: m.EditShopPage,
  })),
);
const PrivacyPolicyPage = lazy(() =>
  import("../pages/LegalPage/PrivacyPolicyPage").then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
);
const TermsConditionsPage = lazy(() =>
  import("../pages/LegalPage/TermsConditionsPage").then((m) => ({
    default: m.TermsConditionsPage,
  })),
);

function withPageSuspense(Page: ComponentType): ReactNode {
  return (
    <Suspense fallback={<Loader label="Loading..." />}>
      <Page />
    </Suspense>
  );
}

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
          { path: "shop", element: withPageSuspense(ShopPage) },
          { path: "medicine", element: withPageSuspense(MedicinePage) },
          {
            path: "medicine/:productId",
            element: withPageSuspense(MedicinePage),
          },
          { path: "statistics", element: withPageSuspense(StatisticsPage) },
          { path: "create-shop", element: withPageSuspense(CreateShopPage) },
          { path: "edit-shop", element: withPageSuspense(EditShopPage) },
          {
            path: "privacy-policy",
            element: withPageSuspense(PrivacyPolicyPage),
          },
          {
            path: "terms-conditions",
            element: withPageSuspense(TermsConditionsPage),
          },
        ],
      },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
]);
