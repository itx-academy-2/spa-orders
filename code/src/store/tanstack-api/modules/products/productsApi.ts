import { fetcher } from "@/store/tanstack-api/client/fetcher";
import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";
import {
  GetManagerImageSearchParams,
  GetManagerImageSearchResponse
} from "@/types/product.types";

export const productsApi = {
  getManagerImageSearch: async (
    params: GetManagerImageSearchParams
  ): Promise<GetManagerImageSearchResponse> => {
    return fetcher<GetManagerImageSearchResponse>(URLS.products.getForManagerImageBySearch, {
      method: httpMethods.get,
      query: { query: params.searchQuery },
    });
  },
};
