import { create } from "zustand";
import api from "../services/api";
import type { Checkin } from "../types";

interface CheckinState {
  checkins: Checkin[];
  summary: {
    todayCheckins: number;
    totalMembers: number;
    completionRate: number;
    avgMood: number;
    unresolvedBlockers: number;
  } | null;
  loading: boolean;
  fetchCheckins: (filters?: Record<string, string>) => Promise<void>;
  fetchSummary: () => Promise<void>;
  addCheckin: (checkin: Checkin) => void;
}

export const useCheckinStore = create<CheckinState>((set) => ({
  checkins: [],
  summary: null,
  loading: false,

  fetchCheckins: async (filters = {}) => {
    set({ loading: true });
    const params = new URLSearchParams(filters);
    const { data } = await api.get(`/checkins?${params}`);
    set({ checkins: data, loading: false });
  },

  fetchSummary: async () => {
    const { data } = await api.get("/checkins/summary");
    set({ summary: data });
  },

  addCheckin: (checkin) =>
    set((state) => ({ checkins: [checkin, ...state.checkins] })),
}));
