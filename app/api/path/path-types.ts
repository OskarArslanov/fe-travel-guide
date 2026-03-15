import { VisaStatus } from "../visa/visa-types";

export type PathType = {
  countryCode: string;
  countryName: string;
  visaStatus: VisaStatus;
  allowedDays: number | null;
  distanceKm: number;
  distanceFromPrevKm: number;
  score: number;
};

export type PathRequest = {
  passport: string;
  lat?: number;
  lon?: number;
  limit?: number;
};

export type PathResponse = {
  passport: string;
  lat: number;
  lon: number;
  suggestions: PathType[];
  total: number;
};
