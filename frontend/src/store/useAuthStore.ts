import { create } from "zustand";

export const useAuthStore = create(() => ({
  userAuth: null,
  isCheckingAuth: true,
}));
