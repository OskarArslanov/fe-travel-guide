"use client";

import { create } from "zustand";
import { StoreProps } from "@/consts/props";

type AlertType = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type AlertStoreType = {
  addAlert: (alert: Omit<AlertType, "id">) => Promise<void>;
  removeAlert: (id: number) => void;
  alerts: AlertType[];
} & StoreProps;

export const useAlertStore = create<AlertStoreType>()((set, get) => ({
  alerts: [],
  isLoading: false,
  addAlert: async (alert: Omit<AlertType, "id">) => {
    try {
      const newAlert = { ...alert, id: Date.now() };
      set({ alerts: [...get().alerts, newAlert] });
    } catch (e) {
      console.error("Failed to add alert:", e);
      set({ error: e });
    } finally {
      set({ isLoading: false });
    }
  },
  removeAlert: (id: number) => {
    try {
      set({ alerts: get().alerts.filter((alert) => alert.id !== id) });
    } catch (e) {
      console.error("Failed to remove alert:", e);
      set({ error: e });
    }
  },
}));
