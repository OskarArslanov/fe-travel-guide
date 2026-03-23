"use client";

import { create } from "zustand";
import { PathRequest, PathResponse } from "@/app/api/path/path-types";
import { StoreProps } from "@/consts/props";
import { fetchPathAction } from "@/app/api/path/action";
import { useAlertStore } from "./alert.store";

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
      console.log(e);
      useAlertStore.getState().addAlert({
        type: "error",
        message: "Failed to build path. Please try again later.",
      });
      set({ path: undefined });
    } finally {
      set({ isLoading: false });
    }
  },
}));
