import { ReserveButtonContainerProps } from "@/pages/product-details/components/reserve-button-container/ReserveButtonContainer.types";

import {
    useAddToReservationsMutation,
    useGetMyReservationsQuery,
    useRemoveFromReservationsMutation
} from "@/store/tanstack-api/modules/reservations";
import ReserveButton from "@/pages/product-details/components/reserve-button/ReserveButton";

export const ReserveButtonContainer = ({
    productId
}: ReserveButtonContainerProps) => {
    const { data } = useGetMyReservationsQuery();

    const reservedProducts = data ?? [];

    const isReserved = reservedProducts.some((product) => {
        return product.id === productId;
    });

    const addMutation = useAddToReservationsMutation();
    const removeMutation = useRemoveFromReservationsMutation();
    const isLoading = addMutation.isPending || removeMutation.isPending;

    const handleToggle = () => {
        if (isReserved) {
            removeMutation.mutate({ productId });
        } else {
            addMutation.mutate({ productId });
        }
    };

    return (
        <ReserveButton
            isReserved={isReserved}
            isLoading={isLoading}
            onToggle={handleToggle}
        />
    );
};

export default ReserveButtonContainer;
