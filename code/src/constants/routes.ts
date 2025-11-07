import { OrderId } from "@/types/order.types";

const routes = {
  home: {
    path: "/"
  },
  products: {
    path: "/products"
  },
  sales: {
    path: "/products/sales"
  },
  helpCenter: {
    path: "/help-center"
  },
  productDetails: {
    path: (productId = ":productId") => `/products/${productId}`
  },
  cart: {
    path: "/cart"
  },
  computers: {
    path: "/products?category=computer"
  },
  tablets: {
    path: "/products?category=tablet"
  },
  mobiles: {
    path: "/products?category=mobile"
  },
  orders: {
    path: "/orders"
  },
  userCabinet: {
    path: "/user-cabinet",
    profile: { path: "/user-cabinet/profile" },
    viewHistory: { path: "/user-cabinet/view-history" },
    wishlist: { path: "/user-cabinet/wishlist" },
    addresses: { path: "/user-cabinet/addresses" },
    reservations: { path: "/user-cabinet/reservations" }
  },
  dashboard: {
    path: "/dashboard",
    orders: {
      path: "/dashboard/orders"
    },
    metrics: {
      path: "/dashboard/metrics"
    },
    products: {
      path: "/dashboard/products",
      new: {
        path: "/dashboard/products/new"
      },
      update: {
        path: (productId: string = ":productId") =>
          `/dashboard/products/${productId}/edit`
      },
      productDetails: {
        path: (productId: string = ":productId") =>
          `/dashboard/products/${productId}`
      }
    },
    users: {
      path: "/dashboard/users"
    },
    orderDetails: {
      path: (orderId: OrderId = ":orderId") => `/dashboard/orders/${orderId}`
    }
  },
  error: {
    notFound: {
      path: "/not-found"
    },
    unknown: {
      path: "/unknown"
    }
  },
  any: {
    path: "*"
  }
} as const;

export default routes;
