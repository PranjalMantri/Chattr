import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface AuthState {
  authUser: any;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checking auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data: any) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data: any) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfuly");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.updatedUser });
      toast.success("Profile Updated Successfuly");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
