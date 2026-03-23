"use client";

import { create } from "zustand";
import { GeoLocationType } from "@/app/api/geo/geo-types";
import { StoreProps } from "@/consts/props";
import { fetchGeoAction } from "@/app/api/geo/action";
import { useAlertStore } from "./alert.store";

type GeoStoreType = {
  fetchGeo: () => Promise<void>;
  geo?: GeoLocationType;
} & StoreProps;

export const useGeoStore = create<GeoStoreType>()((set) => ({
  isLoading: true,
  fetchGeo: async () => {
    try {
      set({ isLoading: true });
      const resp = await fetchGeoAction();
      set({ geo: resp });
    } catch (e) {
      console.error("Failed to fetch geo:", e);
      useAlertStore
        .getState()
        .addAlert({
          message:
            "Не удалось определить геолокацию. Проверьте соединение с интернетом.",
          type: "error",
        });
      set({ error: e });
    } finally {
      set({ isLoading: false });
    }
  },
}));
