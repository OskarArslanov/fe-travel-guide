export interface GeoLocation {
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
  /** Широта */
  lat: number;
  /** Долгота */
  lon: number;
  /** Часовой пояс (например: "Europe/Moscow") */
  timezone: string;
}

/** Ответ от ip-api.com */
export interface IpApiResponse {
  status: "success" | "fail";
  message?: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  query: string;
}
