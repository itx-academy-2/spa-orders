import { isUserAllowed } from "@/utils/is-user-allowed/isUserAllowed";
import { ROLES } from "@/constants/common";

describe("isUserAllowed", () => {
    test("returns false if user is not authenticated", () => {
        expect(isUserAllowed(false, null)).toBe(false);
        expect(isUserAllowed(false, ROLES.USER)).toBe(false);
        expect(isUserAllowed(false, ROLES.ADMIN)).toBe(false);
    });

    test("returns false if user is ADMIN", () => {
        expect(isUserAllowed(true, ROLES.ADMIN)).toBe(false);
    });

    test("returns false if user is SHOP_MANAGER", () => {
        expect(isUserAllowed(true, ROLES.SHOP_MANAGER)).toBe(false);
    });

    test("returns true for authenticated USER", () => {
        expect(isUserAllowed(true, ROLES.USER)).toBe(true);
    });

    test("returns true for authenticated user with unknown role", () => {
        expect(isUserAllowed(true, null)).toBe(true);
        expect(isUserAllowed(true, undefined)).toBe(true);
    });
});
