import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationsApi } from "@/store/tanstack-api/modules/reservations/reservationsApi";
import { reservationsKeys } from "@/store/tanstack-api/modules/reservations/queryKeys";
import {
  GetMyReservationsParams,
  ReservationProductParams,
  GetMyReservationsMetadataResponse,
} from "@/types/product.types";

type UseGetMyReservationsArgs = {
  params?: GetMyReservationsParams;
  enabled?: boolean;
};

export const useGetMyReservationsQuery = ({
  params,
  enabled = true,
}: UseGetMyReservationsArgs = {}) =>
  useQuery({
    queryKey: reservationsKeys.myReservations(),
    queryFn: () => reservationsApi.getMyReservations(params),
    enabled,
  });

export const useAddToReservationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReservationProductParams) =>
      reservationsApi.addToReservations(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.myReservations(),
      });
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.myReservationsMetadata(),
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
      queryClient.invalidateQueries({
        queryKey: reservationsKeys.myReservationsMetadata(),
      });
    },
  });
};

export const useGetMyReservationsMetadataQuery = (enabled = true) =>
  useQuery<GetMyReservationsMetadataResponse>({
    queryKey: reservationsKeys.myReservationsMetadata(),
    queryFn: () => reservationsApi.getMyReservationsMetadata(),
    enabled,
  });