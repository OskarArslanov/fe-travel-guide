import { PathRequest, PathResponse } from "@/app/api/path/path-types";
import { baseFetch } from "@/consts/base-fetch";
import { buildParams } from "@/consts/utils";

export const fetchPath = async (request: Partial<PathRequest>) => {
  const resp = await baseFetch(`/api/path` + buildParams(request));
  return resp as PathResponse;
};
