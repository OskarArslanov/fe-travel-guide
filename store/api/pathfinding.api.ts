import {
  PathfindingRequest,
  PathfindingResponse,
} from "@/app/api/pathfinding/pathfinding-types";
import { baseFetch } from "@/consts/base-fetch";
import { buildParams } from "@/consts/utils";

export const findPath = async (request: PathfindingRequest) => {
  const resp = await baseFetch(`/api/pathfinding` + buildParams(request));
  return resp as PathfindingResponse;
};
