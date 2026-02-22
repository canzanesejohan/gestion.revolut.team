import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const { user, isAuthenticated, login, logout, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return { user, isAuthenticated, login, logout };
}
