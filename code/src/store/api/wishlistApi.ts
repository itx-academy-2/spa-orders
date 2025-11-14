import { appApi } from "@/store/api/appApi";
import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";
import { rtkQueryTags } from "@/constants/api-tags";

import {
  GetUserWishlistParams,
  GetUserWishlistResponse,
} from "@/types/product.types";

export const wishlistApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getUserWishlist: build.query<
      GetUserWishlistResponse,
      GetUserWishlistParams | void
    >({
      query: (params) => ({
        url: URLS.wishlist.get,
        method: httpMethods.get,
        params: params ?? {}
      }),
      providesTags: [rtkQueryTags.WISHLIST]
    }),
    addToWishlist: build.mutation<void, string>({
      query: (productId: string) => ({
        url: URLS.wishlist.put({ productId }),
        method: httpMethods.put
      }),
      invalidatesTags: [rtkQueryTags.WISHLIST]
    }),
    removeFromWishlist: build.mutation<void, string>({
      query: (productId: string) => ({
        url: URLS.wishlist.delete({ productId }),
        method: httpMethods.delete
      }),
      invalidatesTags: [rtkQueryTags.WISHLIST]
    })
  })
});

export const {
  useGetUserWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} = wishlistApi;
