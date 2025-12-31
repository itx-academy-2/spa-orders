import { ReserveButtonContainerProps } from "@/pages/product-details/components/reserve-button-container/ReserveButtonContainer.types";
import ReserveButton from "@/pages/product-details/components/reserve-button/ReserveButton";

import AuthModal from "@/containers/modals/auth/AuthModal";
import {
    useGetMyReservationsQuery,
    useRemoveFromReservationsMutation
} from "@/store/tanstack-api/modules/reservations";
import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { isUserAllowed } from "@/utils/is-user-allowed/isUserAllowed";
import { useModalContext } from "@/context/modal/ModalContext";
import useAddToReservations from "@/hooks/use-add-to-reservations/useAddToReservations";

export const ReserveButtonContainer = ({
    productId
}: ReserveButtonContainerProps) => {
    const isAuthenticated = useIsAuthSelector();
    const userRole = useUserRoleSelector();

    const { openModal } = useModalContext();

    const canUserInteract = !isUserAllowed(isAuthenticated, userRole);

    const { data } = useGetMyReservationsQuery({
        enabled: !canUserInteract
    });

    const reservedProducts = data ?? [];

    const isReserved = reservedProducts.some((product) => {
        return product.id === productId;
    });

    const { handleAddToReservations, isPending: isAdding } = useAddToReservations();
    const removeMutation = useRemoveFromReservationsMutation();
    const isRemoving = removeMutation.isPending;

    const isLoading = isAdding || isRemoving;

    const handleToggle = () => {
        if (canUserInteract) {
            openModal(<AuthModal />);
            return;
        }
        if (isReserved) {
            removeMutation.mutate({ productId });
        } else {
            handleAddToReservations({ productId });
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
