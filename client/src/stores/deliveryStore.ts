import { create } from "zustand";
import api from "../services/api";
import type { Delivery, DeliveryStats } from "../types";

interface DeliveryState {
  deliveries: Delivery[];
  stats: DeliveryStats | null;
  loading: boolean;
  fetchDeliveries: (filters?: Record<string, string>) => Promise<void>;
  fetchStats: () => Promise<void>;
  updateDeliveryInList: (delivery: Delivery) => void;
  addDelivery: (delivery: Delivery) => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  deliveries: [],
  stats: null,
  loading: false,

  fetchDeliveries: async (filters = {}) => {
    set({ loading: true });
    const params = new URLSearchParams(filters);
    const { data } = await api.get(`/deliveries?${params}`);
    set({ deliveries: data, loading: false });
  },

  fetchStats: async () => {
    const { data } = await api.get("/deliveries/stats");
    set({ stats: data });
  },

  updateDeliveryInList: (delivery) =>
    set((state) => ({
      deliveries: state.deliveries.map((d) =>
        d.id === delivery.id ? { ...d, ...delivery } : d
      ),
    })),

  addDelivery: (delivery) =>
    set((state) => ({
      deliveries: [delivery, ...state.deliveries],
    })),
}));
