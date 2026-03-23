"use server";

import { getPathService } from "./path-service";
import { PathRequest, PathResponse } from "./path-types";

export const fetchPathAction = async (request: PathRequest) => {
  const pathService = await getPathService();
  const result = await pathService.suggest(request);

  return result as PathResponse;
};
