import { useAddToReservationsMutation } from "@/store/tanstack-api/modules/reservations";
import useSnackbar from "@/hooks/use-snackbar/useSnackbar";
import { ReservationProductParams } from "@/types/product.types";
import { APIError } from "@/types/common";

const useAddToReservations = () => {
    const { openSnackbarWithTimeout } = useSnackbar();
    const addMutation = useAddToReservationsMutation();

    const handleAddToReservations = async (params: ReservationProductParams) => {
        try {
            await addMutation.mutateAsync(params);

            openSnackbarWithTimeout({
                variant: "success",
                messageTranslationKey: "reservations.add.success",
            });
        } catch (err) {
            const error = err as { status: number; data?: APIError };
            const apiError = error.data;

            if (!apiError) {
                openSnackbarWithTimeout({
                    variant: "error",
                    messageTranslationKey: "reservations.add.fail",
                });
                return;
            }

            if (apiError.status === 400) {
                switch (apiError.title) {
                    case "Reservation Limit Exceeded":
                        openSnackbarWithTimeout({
                            variant: "error",
                            messageTranslationKey: "reservations.add.limit.exceeded",
                        });
                        break;

                    case "Reservation Total Cost Exceeded":
                        openSnackbarWithTimeout({
                            variant: "error",
                            messageTranslationKey: "reservations.add.totalCost.exceeded",
                        });
                        break;

                    default:
                        openSnackbarWithTimeout({
                            variant: "error",
                            messageTranslationKey: "reservations.add.fail",
                        });
                }
            } else {
                openSnackbarWithTimeout({
                    variant: "error",
                    messageTranslationKey: "reservations.add.fail",
                });
            }
        }
    };

    return { handleAddToReservations, ...addMutation } as const;
};

export default useAddToReservations;
