import { useQueryParams } from "@/hooks/use-query-params";
import { useGeoStore } from "@/store/geo.store";
import { usePathStore } from "@/store/path.store";
import { useEffect } from "react";

export const useRootPassport = () => {
  const { geo, isLoading: geoLoading } = useGeoStore();
  const fetchPath = usePathStore().fetchPath;
  const { getQueryParams, setQueryParams } = useQueryParams();
  const { passport = geo?.countryCode, limit = "20" } = getQueryParams();

  const handleSetPassport = (passport: string) => {
    setQueryParams({ passport });
  };

  const handleSetLimit = (limit: string) => {
    setQueryParams({ limit });
  };

  useEffect(() => {
    if (!passport || !geo) return;
    fetchPath({
      passport,
      limit: parseInt(limit),
      lat: geo.lat,
      lon: geo.lon,
      currentCountryCode: geo.countryCode,
    });
  }, [passport, limit, geo]);

  return {
    geoLoading,
    handleSetPassport,
    handleSetLimit,
    passport,
    limit,
  };
};
