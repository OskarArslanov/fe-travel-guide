import { GeoLocationType } from "@/app/api/geo/geo-types";
import { baseFetch } from "@/consts/base-fetch";

export const fetchGeo = async () => {
  const res = await baseFetch("/api/geo");
  return res as GeoLocationType;
};
