import { useGetMyReservationsQuery } from "@/store/tanstack-api/modules/reservations";
import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { isUserAllowed } from "@/utils/is-user-allowed/isUserAllowed";

export const useIsProductReserved = (productId: string) => {
    const isAuthenticated = useIsAuthSelector();
    const userRole = useUserRoleSelector();

    const canUserInteract = !isUserAllowed(isAuthenticated, userRole);

    const { data } = useGetMyReservationsQuery({
        enabled: !canUserInteract,
    });

    const reservedProducts = data ?? [];

    const isReserved = reservedProducts.some((p) => p.id === productId);

    return {
        isReserved
    };
};
