import { getPathService } from "./path-service";
import { PathRequest, PathResponse } from "./path-types";

export const fetchPathAction = async (request: PathRequest) => {
  const result = await getPathService().suggest(request);

  return result as PathResponse;
};
