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
  OrderPostParams
} from "@/types/order.types";
import {
  GetManagerProductByIdParams,
  GetUserProductByIdParams,
  GetUserProductsBySearchQueryParams,
  UpdateProductBody
} from "@/types/product.types";
import { GetUsersForAdminParams } from "@/types/user.types";
import createUrlPath from "@/utils/create-url-path/createUrlPath";

export const URLS = {
  auth: {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in"
  },
  products: {
    getForUser: "/v1/products",
    getForUserById: ({ productId, lang }: GetUserProductByIdParams) =>
      `/v1/products/${productId}?lang=${lang}`,
    getForManager: `/v1/management/products`,
    post: "/v1/management/products",
    put: "/v1/products",
    patch: ({ productId }: Pick<UpdateProductBody, "productId">) =>
      `/v1/management/products/${productId}`,
    delete: "/v1/products",
    getForManagerById: ({ productId }: GetManagerProductByIdParams) =>
      `/v1/management/products/${productId}`,
    searchByQuery: (params: GetUserProductsBySearchQueryParams) =>
      createUrlPath("/v1/products/search", undefined, params)
  },
  orders: {
    getForUser: ({ userId, lang }: GetUserOrderParams) =>
      `/v1/users/${userId}/orders?lang=${lang}`,
    getForAdmin: (queryParams: GetAdminOrderParams) =>
      createUrlPath("/v1/management/orders", undefined, queryParams),
    getByIdForAdmin: ({ orderId, lang }: GetAdminOrderByIdParams) =>
      `/v1/management/orders/${orderId}?lang=${lang}`,
    post: ({ userId }: Pick<OrderPostParams, "userId">) =>
      `/v1/users/${userId}/orders`,
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
  }
} as const;
