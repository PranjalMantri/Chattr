import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

// User and Message types (minimal, adjust as needed)
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt?: Date;
}

export interface OnlineUser {
  userId: string;
  socketId: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: OnlineUser[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  signup: (data: Omit<User, "_id"> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<User>("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checking auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<User>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful");
      get().connectSocket();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data: Omit<User, "_id"> & { password: string }) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<User>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfuly");
      get().connectSocket();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
      get().disconnectSocket();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put<{ updatedUser: User }>(
        "/auth/update-profile",
        data
      );
      set({ authUser: res.data.updatedUser });
      toast.success("Profile Updated Successfuly");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Profile update failed"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    console.log("Connect socket was called");
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    console.log("Creating socket");
    const socket: Socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
      set({ onlineUsers });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.disconnect();
    }
  },
}));
