import { create } from "zustand";
import api from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    connectSocket(data.user.id);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.clear();
    disconnectSocket();
    set({ user: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (userStr && token) {
      const user = JSON.parse(userStr) as User;
      connectSocket(user.id);
      set({ user, isAuthenticated: true });
    }
  },
}));
