"use client";

import { create } from "zustand";
import { GeoLocationType } from "@/app/api/geo/geo-types";
import { fetchGeo } from "@/store/api/geo.api";
import { StoreProps } from "@/consts/props";

type GeoStoreType = {
  fetchGeo: () => Promise<void>;
  geo?: GeoLocationType;
} & StoreProps;

export const useGeoStore = create<GeoStoreType>()((set) => ({
  isLoading: true,
  fetchGeo: async () => {
    try {
      set({ isLoading: true });
      const resp = await fetchGeo();
      set({ geo: resp });
    } catch (e) {
      console.error("Failed to fetch geo:", e);
      set({ error: e });
    } finally {
      set({ isLoading: false });
    }
  },
}));
