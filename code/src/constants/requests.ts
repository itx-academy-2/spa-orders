import {
  CartManagementDeleteParams,
  CartManagementGetParams,
  CartManagementPatchParams,
  CartManagementPostParams
} from "@/types/cart.types";
import {
  GetAdminOrderByIdParams,
  GetAdminOrderParams,
  GetUserOrderParams,
  OrderPatchParams,
  OrderPostParams,
  OrderPostV2Params
} from "@/types/order.types";
import {
  GetManagerProductByIdParams,
  GetManagerReservedByIdParams,
  GetUserProductByIdParams,
  GetUserProductsBySearchQueryParams,
  UpdateProductBody
} from "@/types/product.types";
import {
  AddressesGetParams,
  AddressesDeleteParams
} from "@/types/address.types";
import { GetUsersForAdminParams } from "@/types/user.types";
import createUrlPath from "@/utils/create-url-path/createUrlPath";

export const URLS = {
  auth: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in"
  },
  products: {
    getSuggestedProduct: "/v1/products/bestseller",
    getBestsellersProducts: "/v1/products/bestsellers",
    getForUser: "/v1/products",
    getForUserById: ({ productId, lang }: GetUserProductByIdParams) =>
      `/v1/products/${productId}?lang=${lang}`,
    getForManager: `/v1/management/products`,
    getDiscountCountForManager: "/v1/management/products/discounted/count",
    post: "/v1/management/products",
    put: "/v1/products",
    patch: ({ productId }: Pick<UpdateProductBody, "productId">) =>
      `/v1/management/products/${productId}`,
    delete: "/v1/products",
    getForManagerById: ({ productId }: GetManagerProductByIdParams) =>
      `/v1/management/products/${productId}`,
    searchByQuery: (params: GetUserProductsBySearchQueryParams) =>
      createUrlPath("/v1/products/search", undefined, params),
    getForManagerImageBySearch: "/v1/management/products/images/search",
    getForManagerProductReservations: ({ productId }: Pick<GetManagerReservedByIdParams, "productId">) =>
      `/v1/management/products/${productId}/reservations`
  },
  sales: {
    getSaleProducts: "/v1/products/sales"
  },
  orders: {
    getForUser: ({ userId, lang, page }: GetUserOrderParams) =>
      `/v1/users/${userId}/orders?lang=${lang}&page=${page}`,
    getForAdmin: (queryParams: GetAdminOrderParams) =>
      createUrlPath("/v1/management/orders", undefined, queryParams),
    getByIdForAdmin: ({ orderId, lang }: GetAdminOrderByIdParams) =>
      `/v1/management/orders/${orderId}?lang=${lang}`,
    post: ({ userId }: Pick<OrderPostParams, "userId">) =>
      `/v1/users/${userId}/orders`,
    postOrderV2: ({ userId }: Pick<OrderPostV2Params, "userId">) =>
      `/v2/users/${userId}/orders`,
    patch: ({ orderId }: Pick<OrderPatchParams, "orderId">) =>
      `/v1/management/orders/${orderId}/status`
  },
  cart: {
    get: ({ userId, lang }: CartManagementGetParams) =>
      `/v1/users/${userId}/cart/items?lang=${lang}`,
    post: ({ userId, productId }: CartManagementPostParams) =>
      `/v1/users/${userId}/cart/${productId}`,
    delete: ({ userId, productId }: CartManagementDeleteParams) =>
      `/v1/users/${userId}/cart/items/${productId}`,
    patchQuantity: ({
      userId,
      productId,
      quantity
    }: CartManagementPatchParams) =>
      `/v1/users/${userId}/cart/${productId}/setquantity?quantity=${quantity}`
  },
  users: {
    getForAdmin: (params: GetUsersForAdminParams) =>
      createUrlPath("/v1/management/users", undefined, params)
  },
  articles: {
    getArticlesTitle: "/v1/articles/details",
    getArticleById: (articleId: number, lang: string) =>
      `/v1/articles/${articleId}?lang=${lang}`,
    getArticlesBySearch: "/v1/articles/search",
    getArticlesByTitle: "/v1/articles/titles"
  },
  metrics: {
    getMetrics: "/v1/filter-analytics/products-on-sale/weekly"
  },
  userInfo: {
    getUserInfo: "/v2/my-info",
    patchUserInfo: "/v2/my-info",
    photo: {
      get: "/v1/my-info/photo",
      put: "/v1/my-info/photo",
      delete: "/v1/my-info/photo"
    }
  },
  viewHistory: {
    get: "/v1/my-view-history",
    put: ({ productId }: { productId: string }) =>
      `/v1/my-view-history/${productId}`,
    delete: ({ productId }: { productId: string }) =>
      `/v1/my-view-history/${productId}`,
    deleteAll: "/v1/my-view-history"
  },
  wishlist: {
    get: "/v1/my-wishlist",
    put: ({ productId }: { productId: string }) =>
      `/v1/my-wishlist/${productId}`,
    delete: ({ productId }: { productId: string }) =>
      `/v1/my-wishlist/${productId}`
  },
  address: {
    get: ({userId}: AddressesGetParams) => `/v1/users/${userId}/addresses`,
    delete: ({ userId, addressId }: AddressesDeleteParams) =>
      `/v1/users/${userId}/addresses/${addressId}`
  }
} as const;
