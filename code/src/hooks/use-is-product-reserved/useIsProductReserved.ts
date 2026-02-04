import { useGetMyReservationsQuery } from "@/store/tanstack-api/modules/reservations";
import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { isUserAllowed } from "@/utils/is-user-allowed/isUserAllowed";

export const useIsProductReserved = (productId?: string) => {
    const isAuthenticated = useIsAuthSelector();
    const userRole = useUserRoleSelector();

    const canUserSeeReserved = isUserAllowed(isAuthenticated, userRole);

    const { data } = useGetMyReservationsQuery({
        enabled: canUserSeeReserved,
    });

    const reservedProducts = data ?? [];

    const isReserved =
        productId && canUserSeeReserved
            ? reservedProducts.some((p) => p.id === productId)
            : false;

    return {
        isReserved,
        reservedProducts
    };
};
