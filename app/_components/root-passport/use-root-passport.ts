import { VisaStatus } from "@/app/api/visa/visa-types";
import { useQueryParams } from "@/hooks/use-query-params";
import { useGeoStore } from "@/store/geo.store";
import { usePathStore } from "@/store/path.store";
import { useEffect } from "react";

export const useRootPassport = () => {
  const { geo, isLoading: geoLoading } = useGeoStore();
  const fetchPath = usePathStore().fetchPath;
  const { getQueryParams, setQueryParams } = useQueryParams();
  const {
    passport = geo?.countryCode,
    limit = "20",
    sortBy = "score",
    type = "all",
    minDays,
    includeNoDays = "true",
    sort = "asc",
  } = getQueryParams();

  const handleSetPassport = (passport: string) => {
    setQueryParams({ passport });
  };

  const handleSetLimit = (limit: string) => {
    setQueryParams({ limit });
  };

  const handleSetSortBy = (value: string) => {
    setQueryParams({ sortBy: value });
  };

  const handleSetType = (value: string) => {
    setQueryParams({ type: value });
  };

  const handleSetMinDays = (value: string | undefined) => {
    setQueryParams({ minDays: value });
  };

  const handleSetIncludeNoDays = (value: boolean) => {
    setQueryParams({ includeNoDays: String(value) });
  };

  const handleSetSort = (value: string) => {
    setQueryParams({ sort: value });
  };

  useEffect(() => {
    if (!passport || !geo) return;
    fetchPath({
      passport,
      limit: parseInt(limit),
      lat: geo.lat,
      lon: geo.lon,
      currentCountryCode: geo.countryCode,
      sortBy: sortBy as "visa" | "distance" | "score",
      type: type as VisaStatus | "all",
      minDays: minDays ? parseInt(minDays) : undefined,
      includeNoDays: includeNoDays === "true",
      sort: sort as "asc" | "desc",
    });
  }, [passport, limit, sortBy, type, minDays, includeNoDays, sort, geo]);

  return {
    geoLoading,
    passport,
    limit,
    sortBy,
    type,
    minDays,
    includeNoDays: includeNoDays === "true",
    sort,
    handleSetPassport,
    handleSetLimit,
    handleSetSortBy,
    handleSetType,
    handleSetMinDays,
    handleSetIncludeNoDays,
    handleSetSort,
  };
};
