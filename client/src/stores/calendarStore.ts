import { create } from "zustand";
import api from "../services/api";
import type { Delivery } from "../types";

interface CalendarState {
  events: Delivery[];
  loading: boolean;
  fetchEvents: (filters?: Record<string, string>) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  loading: false,

  fetchEvents: async (filters = {}) => {
    set({ loading: true });
    const params = new URLSearchParams(filters);
    const { data } = await api.get(`/deliveries?${params}`);
    set({ events: data, loading: false });
  },
}));
