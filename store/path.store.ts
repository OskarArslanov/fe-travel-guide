"use client";

import { create } from "zustand";
import { PathRequest, PathResponse } from "@/app/api/path/path-types";
import { StoreProps } from "@/consts/props";
import { fetchPathAction } from "@/app/api/path/action";

type PathStoreType = {
  fetchPath: (request: PathRequest) => Promise<void>;
  path?: PathResponse;
} & StoreProps;

export const usePathStore = create<PathStoreType>()((set) => ({
  isLoading: true,
  fetchPath: async (request) => {
    try {
      set({ isLoading: true });
      const resp = await fetchPathAction(request);
      set({ path: resp });
    } catch (e) {
      console.error("Failed to fetch paths:", e);
      set({ error: e, path: undefined });
    } finally {
      set({ isLoading: false });
    }
  },
}));
