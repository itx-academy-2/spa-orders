import { fetcher } from "@/store/tanstack-api/client/fetcher";

import { URLS } from "@/constants/requests";
import { httpMethods } from "@/constants/methods";

import {
  GetMyReservationsParams,
  GetMyReservationsResponse,
  ReservationProductParams,
  GetMyReservationsMetadataResponse,
} from "@/types/product.types";

export const reservationsApi = {
  getMyReservations: async (
    params?: GetMyReservationsParams
  ): Promise<GetMyReservationsResponse> => {
    return fetcher<GetMyReservationsResponse>(URLS.reservations.getMyReservations, {
      method: httpMethods.get,
      query: params,
    });
  },

  addToReservations: async (
    params: ReservationProductParams
  ): Promise<void> => {
    return fetcher<void>(
      URLS.reservations.put({ productId: params.productId }),
      {
        method: httpMethods.put,
      }
    );
  },

  removeFromReservations: async (
    params: ReservationProductParams
  ): Promise<void> => {
    return fetcher<void>(
      URLS.reservations.delete({ productId: params.productId }),
      {
        method: httpMethods.delete,
      }
    );
  },

  getMyReservationsMetadata: () =>
    fetcher<GetMyReservationsMetadataResponse>(
      URLS.reservations.getMyReservationsMetadata,
      { method: httpMethods.get }
    ),
};
