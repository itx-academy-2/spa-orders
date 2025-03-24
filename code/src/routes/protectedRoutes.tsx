import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import DashboardLayout from "@/layouts/dashboard-layout/DashboardLayout";

import { ROLES } from "@/constants/common";
import routePaths from "@/constants/routes";
import ProtectedRoute from "@/routes/protected-route/ProtectedRoute";

const OrdersPage = lazy(() => import("@/pages/orders/OrdersPage"));
const CartPage = lazy(() => import("@/pages/cart/CartPage"));
const DashboardOrdersPage = lazy(
  () => import("@/pages/dashboard/dashboard-orders/DashboardOrdersPage")
);
const DashboardMetricsPage = lazy(
  () => import("@/pages/dashboard/dashboard-metrics/DashboardMetricsPage")
);
const DashboardProductsPage = lazy(
  () => import("@/pages/dashboard/dashboard-products/DashboardProductsPage")
);
const DashboardUsersPage = lazy(
  () => import("@/pages/dashboard/dashboard-users/DashboardUsersPage")
);
const DashboardNewProductPage = lazy(
  () =>
    import("@/pages/dashboard/dashboard-new-product/DashboardNewProductPage")
);
const DashboardOrderDetailsPage = lazy(
  () => import("@/pages/dashboard-order-details/DashboardOrderDetailsPage")
);
const DashboardUpdateProductPage = lazy(
  () =>
    import(
      "@/pages/dashboard/dashboard-update-product/DashboardUpdateProductPage"
    )
);
const DashboardProductPage = lazy(
  () => import("@/pages/dashboard/dashboard-product/DashboardProductPage")
);

const protectedRoutes: RouteObject[] = [
  {
    path: routePaths.orders.path,
    element: (
      <ProtectedRoute
        element={<OrdersPage />}
        allowedRoles={[ROLES.USER, ROLES.ADMIN, ROLES.SHOP_MANAGER]}
      />
    )
  },
  {
    path: routePaths.dashboard.path,
    element: (
      <ProtectedRoute
        element={<DashboardLayout />}
        allowedRoles={[ROLES.ADMIN, ROLES.SHOP_MANAGER]}
      />
    ),
    children: [
      {
        path: routePaths.dashboard.orders.path,
        element: <DashboardOrdersPage />
      },
      {
        path: routePaths.dashboard.orderDetails.path(),
        element: <DashboardOrderDetailsPage />
      },
      {
        path: routePaths.dashboard.products.path,
        element: <DashboardProductsPage />
      },
      {
        path: routePaths.dashboard.metrics.path,
        element: <DashboardMetricsPage />
      },
      {
        path: routePaths.dashboard.users.path,
        element: <DashboardUsersPage />
      },
      {
        path: routePaths.dashboard.products.new.path,
        element: <DashboardNewProductPage />
      },
      {
        path: routePaths.dashboard.products.update.path(),
        element: <DashboardUpdateProductPage />
      },
      {
        path: routePaths.dashboard.products.productDetails.path(),
        element: <DashboardProductPage />
      }
    ]
  },
  {
    path: routePaths.cart.path,
    element: (
      <ProtectedRoute
        element={<CartPage />}
        allowedRoles={[ROLES.ADMIN, ROLES.SHOP_MANAGER, ROLES.USER]}
      />
    )
  }
];

export default protectedRoutes;
