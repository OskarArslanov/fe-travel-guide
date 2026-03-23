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

export type PathFilterRequest = {
  /** Поле сортировки. По умолчанию: "score" */
  sortBy?: "visa" | "distance" | "score";
  /** Фильтр по визовому статусу. По умолчанию: "all" */
  type?: VisaStatus | "all";
  /** Минимум дней пребывания */
  minDays?: number;
  /** Включать страны без данных о днях. По умолчанию: true */
  includeNoDays?: boolean;
  /** Направление сортировки. По умолчанию: "desc" */
  sort?: "asc" | "desc";
};

export type PathRequest = {
  passport: string;
  lat: number;
  lon: number;
  limit?: number;
  currentCountryCode: string;
} & PathFilterRequest;

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
