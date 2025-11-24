import { useUserStore } from "@/store/tanstack-api/useUserStore";

export const getAuthHeaders = (): Record<string, string> => {
    const token = useUserStore.getState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
};
