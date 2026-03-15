export enum VisaStatus {
  VISA_FREE = "visa_free",
  VISA_ON_ARRIVAL = "visa_on_arrival",
  E_VISA = "e_visa",
  VISA_REQUIRED = "visa_required",
  NO_ADMISSION = "no_admission",
}

/**
 * Порядок сортировки: чем меньше число — тем лучше условие въезда.
 */
export const VISA_STATUS_RANK: Record<VisaStatus, number> = {
  [VisaStatus.VISA_FREE]: 0,
  [VisaStatus.VISA_ON_ARRIVAL]: 1,
  [VisaStatus.E_VISA]: 2,
  [VisaStatus.VISA_REQUIRED]: 3,
  [VisaStatus.NO_ADMISSION]: 4,
};

export interface VisaEntry {
  /** ISO 3166-1 alpha-2 код страны назначения */
  destination: string;
  /** Название страны назначения */
  destinationName: string;
  /** Визовый статус */
  status: VisaStatus;
  /** Количество дней безвизового пребывания (если применимо) */
  allowedDays?: number | null;
  /** Дополнительные примечания */
  notes?: string;
}

/**
 * Формат JSON из github.com/imorte/passport-index-data:
 * { "ru": { "de": { "status": "visa free", "days": 90 }, ... }, ... }
 */
export interface RawVisaRecord {
  status: string;
  days?: number;
}

export type RawPassportIndex = Record<string, Record<string, RawVisaRecord>>;

export type VisaEntryType = {
  destination: string;
  destinationName: string;
  status: VisaStatus;
  allowedDays?: number | null;
  notes?: string;
};

export type VisaInfoResponseType = {
  passport: string;
  entries: VisaEntryType[];
  total: number;
};
