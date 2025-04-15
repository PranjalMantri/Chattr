import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface ChatState {
  messages: any[];
  users: any[];
  selectedUser: any;
  isMessagesLoading: boolean;
  isUsersLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isMessagesLoading: false,
  isUsersLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      console.log(res.data);
    } catch (error: any) {
      toast.error(error.data.response.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.post(`/messages/${userId}`);
      set({ messages: res.data });
      console.log(res.data);
    } catch (error: any) {
      toast.error(error.data.response.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
