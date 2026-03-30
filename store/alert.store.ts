"use client";

import { create } from "zustand";

type AlertType = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type AlertStoreType = {
  addAlert: (alert: Omit<AlertType, "id">) => void;
  removeAlert: (id: number) => void;
  alerts: AlertType[];
};

export const useAlertStore = create<AlertStoreType>()((set, get) => ({
  alerts: [],
  addAlert: async (alert: Omit<AlertType, "id">) => {
    const newAlert = { ...alert, id: Date.now() };
    set({ alerts: [...get().alerts, newAlert] });
  },
  removeAlert: (id: number) => {
    set({ alerts: get().alerts.filter((alert) => alert.id !== id) });
  },
}));
