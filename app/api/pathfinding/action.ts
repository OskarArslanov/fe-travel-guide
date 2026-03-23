import { PathfindingRequest } from "./pathfinding-types";
import { getPathfindingService } from "./pathfinding-service";

export const fetchPathfindingAction = async (
  request: PathfindingRequest,
) => {
  const result = await getPathfindingService().buildPath(request);
  return result;
};
