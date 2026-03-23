"use server";

import { PathfindingRequest } from "./pathfinding-types";
import { getPathfindingService } from "./pathfinding-service";

export const fetchPathfindingAction = async (request: PathfindingRequest) => {
  const pathfindingService = await getPathfindingService();
  const result = await pathfindingService.buildPath(request);
  return result;
};
