"use client";

import { create } from "zustand";
import { PathRequest, PathResponse } from "@/app/api/path/path-types";
import { fetchPath } from "@/store/api/path.api";
import { StoreProps } from "@/consts/props";

type PathStoreType = {
  fetchPath: (request: Partial<PathRequest>) => Promise<void>;
  path?: PathResponse;
} & StoreProps;

export const usePathStore = create<PathStoreType>()((set) => ({
  isLoading: true,
  fetchPath: async (request) => {
    try {
      set({ isLoading: true });
      const resp = await fetchPath(request);
      set({ path: resp });
    } catch (e) {
      console.error("Failed to fetch paths:", e);
      set({ error: e, path: undefined });
    } finally {
      set({ isLoading: false });
    }
  },
}));
