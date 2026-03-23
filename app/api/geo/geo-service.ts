import { baseFetch } from "@/consts/base-fetch";
import { GeoLocationType, IpApiResponse } from "./geo-types";

class GeoService {
  /**
   * Определяет геолокацию по IP-адресу из входящего HTTP-запроса.
   * Учитывает заголовки прокси: X-Forwarded-For, X-Real-IP.
   */
  async locateRequest(headers: Headers): Promise<GeoLocationType> {
    const ip = await this.extractIp(headers);
    return this.locateIp(ip);
  }

  /**
   * Определяет геолокацию по произвольному IP-адресу.
   * Использует бесплатный ip-api.com (без ключа, лимит 45 req/min).
   */
  private async locateIp(ip: string): Promise<GeoLocationType> {
    // При локальном IP получаем реальный внешний IP через ipify
    const resolvedIp = this.isLocalIp(ip) ? await this.resolveExternalIp() : ip;

    const url = `http://ip-api.com/json/${resolvedIp}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,query`;

    const resp = (await baseFetch(url)) as IpApiResponse;

    return {
      ip: resp.query,
      countryCode: resp.countryCode,
      country: resp.country,
      region: resp.regionName,
      city: resp.city,
      lat: resp.lat,
      lon: resp.lon,
      timezone: resp.timezone,
    };
  }

  /**
   * Извлекает реальный IP из запроса с учётом заголовков прокси/балансировщика.
   */
  private async extractIp(headers: Headers): Promise<string> {
    const forwarded = headers.get("x-forwarded-for");

    if (forwarded) {
      // X-Forwarded-For может содержать цепочку: "client, proxy1, proxy2"
      const first = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(",")[0];
      return first.trim();
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    const ip = headers.get("cf-connecting-ip"); // Cloudflare
    return ip || "127.0.0.1";
  }

  /** Определяет внешний IP сервера через api.ipify.org */
  private async resolveExternalIp(): Promise<string> {
    try {
      const resp = await fetch("https://api.ipify.org?format=json");
      const data = (await resp.json()) as { ip: string };
      return data.ip;
    } catch {
      console.warn("Failed to resolve external IP, falling back to 127.0.0.1");
      return "127.0.0.1";
    }
  }

  private isLocalIp(ip: string): boolean {
    return (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.16.") ||
      ip === "localhost"
    );
  }
}

let geoService: GeoService | null = null;

export const getGeoService = (): GeoService => {
  if (!geoService) {
    geoService = new GeoService();
  }
  return geoService;
};
