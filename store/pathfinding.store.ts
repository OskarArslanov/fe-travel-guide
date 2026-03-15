"use client";

import { create } from "zustand";
import { StoreProps } from "@/consts/props";
import {
  PathfindingRequest,
  PathfindingResponse,
} from "@/app/api/pathfinding/pathfinding-types";
import { findPath } from "@/store/api/pathfinding.api";

type PathfindingStoreType = {
  findPath: (request: PathfindingRequest) => Promise<void>;
  path?: PathfindingResponse;
} & StoreProps;

export const usePathfindingStore = create<PathfindingStoreType>()((set) => ({
  isLoading: true,
  findPath: async (request) => {
    try {
      set({ isLoading: true });
      const resp = await findPath(request);
      set({ path: resp });
    } catch (e) {
      console.error("Failed to fetch paths:", e);
      set({ error: e, path: undefined });
    } finally {
      set({ isLoading: false });
    }
  },
}));
