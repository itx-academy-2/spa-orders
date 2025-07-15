import { rtkQueryTags } from "@/constants/api-tags";
import { httpMethods } from "@/constants/methods";
import { URLS } from "@/constants/requests";
import { appApi } from "@/store/api/appApi";
import {
  GetUserProductsParams,
  GetUserProductsResponse,
  Product
} from "@/types/product.types";

const viewHistoryApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getViewHistoryApi: build.query<
      GetUserProductsResponse,
      GetUserProductsParams
    >({
      query: (params) => ({ url: URLS.viewHistory.get, params: params ?? {} }),
      providesTags: [rtkQueryTags.VIEW_HISTORY]
    }),
    updateViewedProducts: build.mutation<Product, string>({
      query: (productId: string) => ({
        url: URLS.viewHistory.put({ productId }),
        method: httpMethods.put
      }),
      invalidatesTags: [rtkQueryTags.VIEW_HISTORY]
    }),
    deleteViewProduct: build.mutation<Product, string>({
      query: (productId: string) => ({
        url: URLS.viewHistory.delete({ productId }),
        method: httpMethods.delete
      }),
      invalidatesTags: [rtkQueryTags.VIEW_HISTORY]
    }),
    deleteAllViewProducts: build.mutation<void, void>({
      query: () => ({
        url: URLS.viewHistory.deleteAll,
        method: httpMethods.delete
      }),
      invalidatesTags: [rtkQueryTags.VIEW_HISTORY]
    })
  })
});

export const {
  useGetViewHistoryApiQuery,
  useDeleteViewProductMutation,
  useDeleteAllViewProductsMutation,
  useUpdateViewedProductsMutation
} = viewHistoryApi;
