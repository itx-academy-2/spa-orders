import { ROLES } from "@/constants/common";
import { UserRole } from "@/types/user.types";

export const isUserAllowed = (
    isAuthenticated: boolean,
    userRole: UserRole | null | undefined
): boolean => {
    switch (true) {
        case !isAuthenticated:
            return false;
        case userRole === ROLES.SHOP_MANAGER:
        case userRole === ROLES.ADMIN:
            return false;
        default:
            return true;
    }
};
