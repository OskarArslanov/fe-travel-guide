import {
  RawPassportIndex,
  VisaInfoResponseType,
  VisaEntry,
  VISA_STATUS_RANK,
  VisaStatus,
} from "./visa-types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const DATA_URL =
  "https://raw.githubusercontent.com/imorte/passport-index-data/main/passport-index.json";

export class VisaService {
  private cache: RawPassportIndex = {};
  private cacheUpdatedAt: number = 0;

  async getVisaInfo(passportCode: string): Promise<VisaInfoResponseType> {
    await this.ensureCacheFresh();

    const code = passportCode.toUpperCase();
    const passportData = this.cache[code];

    if (!passportData) {
      throw Error(`Passport code "${code}" not found`);
    }

    const entries: VisaEntry[] = Object.entries(passportData)
      .filter(([destination]) => destination !== code)
      .map(([destination, record]) => ({
        destination: destination.toUpperCase(),
        destinationName: this.getCountryName(destination),
        status: this.parseStatus(record.status),
        allowedDays: record.days ?? null,
      }));

    entries.sort((a, b) => {
      const rankDiff = VISA_STATUS_RANK[a.status] - VISA_STATUS_RANK[b.status];
      if (rankDiff !== 0) return rankDiff;
      return (b.allowedDays ?? 0) - (a.allowedDays ?? 0);
    });

    return {
      passport: passportCode.toUpperCase(),
      entries,
      total: entries.length,
    };
  }

  private async ensureCacheFresh(): Promise<void> {
    if (Date.now() - this.cacheUpdatedAt > CACHE_TTL_MS) {
      await this.refreshCache();
    }
  }

  private async refreshCache(): Promise<void> {
    try {
      console.log("Fetching passport index data from GitHub...");
      const resp = await fetch(DATA_URL);
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }

      const data = await resp.json();
      this.cache = data as RawPassportIndex;
      this.cacheUpdatedAt = Date.now();
      console.log(
        `Passport index loaded: ${Object.keys(this.cache).length} passports`,
      );
    } catch (error: unknown) {
      console.error("Failed to refresh passport index cache", error);
      // Если кэш уже есть — продолжаем работать со старыми данными
      if (Object.keys(this.cache).length === 0) {
        throw error;
      }
    }
  }

  private parseStatus(raw: string): VisaStatus {
    switch (raw.trim().toLowerCase()) {
      case "visa free":
        return VisaStatus.VISA_FREE;
      case "visa on arrival":
        return VisaStatus.VISA_ON_ARRIVAL;
      case "eta":
        return VisaStatus.E_VISA;
      case "e-visa":
        return VisaStatus.E_VISA;
      case "visa required":
        return VisaStatus.VISA_REQUIRED;
      case "no admission":
        return VisaStatus.NO_ADMISSION;
      default:
        console.warn(`Unknown visa status: "${raw}"`);
        return VisaStatus.VISA_REQUIRED;
    }
  }

  private getCountryName(code: string): string {
    try {
      return (
        new Intl.DisplayNames(["en"], { type: "region" }).of(
          code.toUpperCase(),
        ) ?? code.toUpperCase()
      );
    } catch {
      return code.toUpperCase();
    }
  }
}

export const visaService = new VisaService();
