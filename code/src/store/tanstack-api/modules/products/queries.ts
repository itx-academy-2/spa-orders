import { useQuery } from "@tanstack/react-query";

import { productsApi } from "@/store/tanstack-api/modules/products/productsApi";
import { productsKeys } from "@/store/tanstack-api/modules/products/queryKeys";

import { GetManagerImageSearchParams } from "@/types/product.types";

export const useGetManagerImageSearchQuery = (params: GetManagerImageSearchParams) => {
  return useQuery({
    queryKey: productsKeys.managerImageSearch(params.searchQuery),
    queryFn: () => productsApi.getManagerImageSearch(params),
    enabled: Boolean(params.searchQuery?.length >= 3),
  });
};
