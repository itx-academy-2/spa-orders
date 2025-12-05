import { useQuery } from "@tanstack/react-query";

import { productsApi } from "@/store/tanstack-api/modules/products/productsApi";
import { productsKeys } from "@/store/tanstack-api/modules/products/queryKeys";

import {
  GetManagerImageSearchParams,
  GetManagerReservedByIdParams,
  GetManagerReservedByIdResponse
} from "@/types/product.types";

export const useGetManagerImageSearchQuery = (params: GetManagerImageSearchParams) => {
  return useQuery({
    queryKey: productsKeys.managerImageSearch(params.searchQuery),
    queryFn: () => productsApi.getManagerImageSearch(params),
    enabled: Boolean(params.searchQuery?.length >= 3),
  });
};

// TODO: change getForManagerProductReservationsMock to getForManagerProductReservations
export const useGetManagerProductReservationsQuery = (
  params: GetManagerReservedByIdParams
) => {
  return useQuery<GetManagerReservedByIdResponse>({
    queryKey: productsKeys.managerProductReservations(params.productId),
    queryFn: () => productsApi.getForManagerProductReservationsMock(params),
  });
};
