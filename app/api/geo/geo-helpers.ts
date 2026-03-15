import { GeoLocation, IpApiResponse } from "./geo-types";

export class GeoService {
  /**
   * Определяет геолокацию по IP-адресу из входящего HTTP-запроса.
   * Учитывает заголовки прокси: X-Forwarded-For, X-Real-IP.
   */
  async locateRequest(req: Request): Promise<GeoLocation> {
    const ip = this.extractIp(req);
    return this.locateIp(ip);
  }

  /**
   * Определяет геолокацию по произвольному IP-адресу.
   * Использует бесплатный ip-api.com (без ключа, лимит 45 req/min).
   */
  async locateIp(ip: string): Promise<GeoLocation> {
    // При локальном IP получаем реальный внешний IP через ipify
    const resolvedIp = this.isLocalIp(ip) ? await this.resolveExternalIp() : ip;

    const url = `http://ip-api.com/json/${resolvedIp}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,query`;

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`ip-api.com responded with HTTP ${resp.status}`);
    }

    const data = (await resp.json()) as IpApiResponse;

    if (data.status === "fail") {
      throw new Error(`ip-api.com failed for IP "${resolvedIp}": ${data.message}`);
    }

    return {
      ip: data.query,
      countryCode: data.countryCode,
      country: data.country,
      region: data.regionName,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
    };
  }

  /**
   * Извлекает реальный IP из запроса с учётом заголовков прокси/балансировщика.
   */
  extractIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      // X-Forwarded-For может содержать цепочку: "client, proxy1, proxy2"
      const first = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(",")[0];
      return first.trim();
    }

    const realIp = req.headers.get("x-real-ip");
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    const ip = req.headers.get("cf-connecting-ip"); // Cloudflare
    return ip || "127.0.0.1";
  }

  /** Определяет внешний IP сервера через api.ipify.org */
  private async resolveExternalIp(): Promise<string> {
    try {
      const resp = await fetch("https://api.ipify.org?format=json");
      const data = await resp.json() as { ip: string };
      console.log(`Resolved external IP: ${data.ip}`);
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

export const geoService = new GeoService();
