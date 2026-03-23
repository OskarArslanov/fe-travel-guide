"use server";

import { headers } from "next/headers";
import { getGeoService } from "./geo-service";

export const fetchGeoAction = async () => {
  const geoService = await getGeoService();
  const headerList = await headers();
  const geo = await geoService.locateRequest(headerList);
  return geo;
};
