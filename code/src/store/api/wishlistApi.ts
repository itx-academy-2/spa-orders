import { appApi } from "@/store/api/appApi";
import { Product } from "@/types/product.types";
import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";
import { rtkQueryTags } from "@/constants/api-tags";

export const wishlistApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<Product[], void>({
      query: () => ({
        url: URLS.wishlist.get,
        method: httpMethods.get
      }),
      providesTags: [rtkQueryTags.WISHLIST]
    }),
    addWishlist: build.mutation<void, string>({
      query: (productId) => ({
        url: URLS.wishlist.post(productId),
        method: httpMethods.post,
        //body: { productId }
      }),
      invalidatesTags: [rtkQueryTags.WISHLIST]
    }),
    removeWishlist: build.mutation<void, string>({
      query: (productId) => ({
        url: URLS.wishlist.delete(productId),
        method: httpMethods.delete
      }),
      invalidatesTags: [rtkQueryTags.WISHLIST]
    })
  })
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation
} = wishlistApi;
