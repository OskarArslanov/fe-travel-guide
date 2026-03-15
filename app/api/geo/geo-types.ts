import { CoordinateType } from "../pathfinding/pathfinding-types";

export type GeoLocationType = {
  /** IP-адрес пользователя */
  ip: string;
  /** ISO 3166-1 alpha-2 код страны (например: "RU", "DE") */
  countryCode: string;
  /** Название страны */
  country: string;
  /** Регион / область */
  region: string;
  /** Город */
  city: string;
  /** Часовой пояс (например: "Europe/Moscow") */
  timezone: string;
} & CoordinateType;

/** Ответ от ip-api.com */
export type IpApiResponse = {
  status: "success" | "fail";
  message?: string;
  regionName: string;
  query: string;
} & Omit<GeoLocationType, "ip">;
