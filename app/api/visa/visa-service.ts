import { baseFetch } from "@/consts/base-fetch";
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

class VisaService {
  private cache: RawPassportIndex = {};
  private cacheUpdatedAt: number = 0;

  async getVisaInfo(passportCode: string): Promise<VisaInfoResponseType> {
    await this.ensureCacheFresh();

    const code = passportCode.toUpperCase();
    const passportData = this.cache[code];

    if (!passportData) {
      throw Error(`Passport code "${code}" not found`);
    }

    console.log(passportData);
    const entries: VisaEntry[] = Object.entries(passportData)
      .filter(([destination]) => destination !== code)
      .map(([destination, record]) => {
        const status = this.parseStatus(record.status);
        return {
          destination: destination.toUpperCase(),
          destinationName: this.getCountryName(destination),
          status,
          allowedDays: this.parseAllowedDays(status, record.days),
        };
      });

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
      const resp = await baseFetch(DATA_URL);
      this.cache = resp as RawPassportIndex;
      this.cacheUpdatedAt = Date.now();
    } catch (error: unknown) {
      console.error("Failed to refresh passport index cache", error);
      if (Object.keys(this.cache).length === 0) {
        throw error;
      }
    }
  }

  /**
   * Маппинг статуса въезда из сырой строки датасета.
   *
   * Значения в passport-index-data:
   *   "visa free"       — безвизовый въезд
   *   "visa on arrival" — виза по прилёту
   *   "eta" / "e-visa"  — электронное разрешение / е-виза
   *   "visa required"   — нужна обычная виза
   *   "no admission"    — въезд запрещён
   */
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
        console.warn(`[VisaService] Unknown status: "${raw}"`);
        return VisaStatus.VISA_REQUIRED;
    }
  }

  /**
   * Маппинг количества разрешённых дней пребывания.
   *
   * Правила:
   * - VISA_FREE / VISA_ON_ARRIVAL / E_VISA + days=N → N дней
   * - VISA_FREE + days=null → безлимитный/неизвестный срок, возвращаем null
   *   (например BY для RU — союзное государство, ограничений нет)
   * - VISA_REQUIRED + days=N → специальный режим (напр. HK для CN = 7 дней
   *   по HKID), сохраняем как есть — это реальное ограниченное разрешение
   * - VISA_REQUIRED + days=null → виза нужна, срок неизвестен до выдачи → null
   * - NO_ADMISSION → всегда null
   */
  private parseAllowedDays(
    status: VisaStatus,
    days: number | undefined,
  ): number | null {
    if (status === VisaStatus.NO_ADMISSION) return null;
    return days ?? null;
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

let visaService: VisaService | null = null;

export const getVisaService = (): VisaService => {
  if (!visaService) {
    visaService = new VisaService();
  }
  return visaService;
};
