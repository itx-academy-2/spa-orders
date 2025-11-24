import { create } from "zustand";

type UserState = {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
