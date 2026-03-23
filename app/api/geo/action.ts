"use server";

import { headers } from "next/headers";
import { getGeoService } from "./geo-service";

export const fetchGeoAction = async () => {
  const headerList = await headers();
  const geo = await getGeoService().locateRequest(headerList);
  return geo;
};
