import { fetcher } from "@/store/tanstack-api/client/fetcher";

import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";
import {
  GetManagerImageSearchParams,
  GetManagerImageSearchResponse,
  GetManagerReservedByIdParams,
  GetManagerReservedByIdResponse
} from "@/types/product.types";
import { mockProductReservations } from "@/containers/tables/reservations-table/ReservationsTable.constants";

export const productsApi = {
  getManagerImageSearch: async (
    params: GetManagerImageSearchParams
  ): Promise<GetManagerImageSearchResponse> => {
    return fetcher<GetManagerImageSearchResponse>(URLS.products.getForManagerImageBySearch, {
      method: httpMethods.get,
      query: { query: params.searchQuery },
    });
  },
  getForManagerProductReservations: async (
    params: GetManagerReservedByIdParams
  ): Promise<GetManagerReservedByIdResponse> => {
    const { productId, ...query } = params;
    return fetcher<GetManagerReservedByIdResponse>(
      URLS.products.getForManagerProductReservations({ productId }),
      {
        method: httpMethods.get,
        query,
      }
    );
  },
  getForManagerProductReservationsMock: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: GetManagerReservedByIdParams
  ): Promise<GetManagerReservedByIdResponse> => {
    return mockProductReservations;
  },
};
