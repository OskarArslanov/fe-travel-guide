import { VisaStatus } from "../visa/visa-types";

export type PathType = {
  countryCode: string;
  countryName: string;
  visaStatus: VisaStatus;
  allowedDays: number | null;
  /** Расстояние от origin (для suggest) или от предыдущей точки (для suggestChain) */
  distanceKm: number;
  score: number;
};

export type PathRequest = {
  passport: string;
  lat: number;
  lon: number;
  limit?: number;
  currenctCountryCode?: string;
};

export type PathResponse = {
  passport: string;
  lat: number;
  lon: number;
  suggestions: PathType[];
  total: number;
};

export type ChainResponse = {
  passport: string;
  lat: number;
  lon: number;
  chain: PathType[];
  total: number;
};
