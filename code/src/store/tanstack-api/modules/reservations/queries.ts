import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationsApi } from "@/store/tanstack-api/modules/reservations/reservationsApi";
import { reservationsKeys } from "@/store/tanstack-api/modules/reservations/queryKeys";
import {
  GetMyReservationsResponse,
  GetMyReservationsParams,
  ReservationProductParams
} from "@/types/product.types";

export const useGetMyReservationsQuery = (params?: GetMyReservationsParams) => {
  return useQuery<GetMyReservationsResponse>({
    queryKey: reservationsKeys.myReservations(),
    queryFn: () => reservationsApi.getMyReservations(params),
  });
};

export const useAddToReservationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReservationProductParams) =>
      reservationsApi.addToReservations(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.myReservations(),
      });
    },
  });
};

export const useRemoveFromReservationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReservationProductParams) =>
      reservationsApi.removeFromReservations(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.myReservations(),
      });
    },
  });
};
