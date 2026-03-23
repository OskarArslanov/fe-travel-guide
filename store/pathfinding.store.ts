"use client";

import { create } from "zustand";
import { StoreProps } from "@/consts/props";
import {
  PathfindingRequest,
  PathfindingResponse,
} from "@/app/api/pathfinding/pathfinding-types";
import { fetchPathfindingAction } from "@/app/api/pathfinding/action";
import { useAlertStore } from "./alert.store";

type PathfindingStoreType = {
  findPath: (request: PathfindingRequest) => Promise<void>;
  path?: PathfindingResponse;
} & StoreProps;

export const usePathfindingStore = create<PathfindingStoreType>()((set) => ({
  isLoading: true,
  findPath: async (request) => {
    try {
      set({ isLoading: true });
      const resp = await fetchPathfindingAction(request);
      set({ path: resp });
    } catch (e) {
      console.error("Failed to fetch paths:", e);
      useAlertStore.getState().addAlert({
        type: "error",
        message: "Failed to build pathfinding. Please try again later.",
      });
      set({ path: undefined });
    } finally {
      set({ isLoading: false });
    }
  },
}));
