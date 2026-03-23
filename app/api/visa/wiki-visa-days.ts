import "server-only";

/**
 * Сервис для автоматического получения количества дней пребывания
 * из Wikipedia: "Visa requirements for X citizens".
 *
 * Wikipedia API возвращает Wikitext, из которого парсятся строки таблицы
 * вида: | 30 days || ... или | colspan=... | 90 days
 *
 * Результат кэшируется на 24 часа per passport.
 */

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** ISO-2 → название страны на английском для построения заголовка Wikipedia */
const COUNTRY_NAMES_EN: Record<string, string> = {
  AD: "Andorran",
  AE: "Emirati",
  AF: "Afghan",
  AG: "Antiguan and Barbudan",
  AL: "Albanian",
  AM: "Armenian",
  AO: "Angolan",
  AR: "Argentine",
  AT: "Austrian",
  AU: "Australian",
  AZ: "Azerbaijani",
  BA: "Bosnian and Herzegovinian",
  BB: "Barbadian",
  BD: "Bangladeshi",
  BE: "Belgian",
  BF: "Burkinabé",
  BG: "Bulgarian",
  BH: "Bahraini",
  BI: "Burundian",
  BJ: "Beninese",
  BN: "Bruneian",
  BO: "Bolivian",
  BR: "Brazilian",
  BS: "Bahamian",
  BT: "Bhutanese",
  BW: "Botswanan",
  BY: "Belarusian",
  BZ: "Belizean",
  CA: "Canadian",
  CD: "DR Congolese",
  CF: "Central African",
  CG: "Republic of the Congo",
  CH: "Swiss",
  CI: "Ivorian",
  CL: "Chilean",
  CM: "Cameroonian",
  CN: "Chinese",
  CO: "Colombian",
  CR: "Costa Rican",
  CU: "Cuban",
  CV: "Cape Verdean",
  CY: "Cypriot",
  CZ: "Czech",
  DE: "German",
  DJ: "Djiboutian",
  DK: "Danish",
  DM: "Dominican",
  DO: "Dominican",
  DZ: "Algerian",
  EC: "Ecuadorian",
  EE: "Estonian",
  EG: "Egyptian",
  ER: "Eritrean",
  ES: "Spanish",
  ET: "Ethiopian",
  FI: "Finnish",
  FJ: "Fijian",
  FR: "French",
  GA: "Gabonese",
  GB: "British",
  GD: "Grenadian",
  GE: "Georgian",
  GH: "Ghanaian",
  GM: "Gambian",
  GN: "Guinean",
  GQ: "Equatorial Guinean",
  GR: "Greek",
  GT: "Guatemalan",
  GW: "Bissau-Guinean",
  GY: "Guyanese",
  HN: "Honduran",
  HR: "Croatian",
  HT: "Haitian",
  HU: "Hungarian",
  ID: "Indonesian",
  IE: "Irish",
  IL: "Israeli",
  IN: "Indian",
  IQ: "Iraqi",
  IR: "Iranian",
  IS: "Icelandic",
  IT: "Italian",
  JM: "Jamaican",
  JO: "Jordanian",
  JP: "Japanese",
  KE: "Kenyan",
  KG: "Kyrgyz",
  KH: "Cambodian",
  KI: "I-Kiribati",
  KM: "Comorian",
  KN: "Kittitian and Nevisian",
  KP: "North Korean",
  KR: "South Korean",
  KW: "Kuwaiti",
  KZ: "Kazakhstani",
  LA: "Lao",
  LB: "Lebanese",
  LC: "Saint Lucian",
  LI: "Liechtenstein",
  LK: "Sri Lankan",
  LR: "Liberian",
  LS: "Basotho",
  LT: "Lithuanian",
  LU: "Luxembourgish",
  LV: "Latvian",
  LY: "Libyan",
  MA: "Moroccan",
  MC: "Monégasque",
  MD: "Moldovan",
  ME: "Montenegrin",
  MG: "Malagasy",
  MH: "Marshallese",
  MK: "North Macedonian",
  ML: "Malian",
  MM: "Burmese",
  MN: "Mongolian",
  MR: "Mauritanian",
  MT: "Maltese",
  MU: "Mauritian",
  MV: "Maldivian",
  MW: "Malawian",
  MX: "Mexican",
  MY: "Malaysian",
  MZ: "Mozambican",
  NA: "Namibian",
  NE: "Nigerien",
  NG: "Nigerian",
  NI: "Nicaraguan",
  NL: "Dutch",
  NO: "Norwegian",
  NP: "Nepali",
  NR: "Nauruan",
  NZ: "New Zealand",
  OM: "Omani",
  PA: "Panamanian",
  PE: "Peruvian",
  PG: "Papua New Guinean",
  PH: "Filipino",
  PK: "Pakistani",
  PL: "Polish",
  PT: "Portuguese",
  PW: "Palauan",
  PY: "Paraguayan",
  QA: "Qatari",
  RO: "Romanian",
  RS: "Serbian",
  RU: "Russian",
  RW: "Rwandan",
  SA: "Saudi",
  SB: "Solomon Islander",
  SC: "Seychellois",
  SD: "Sudanese",
  SE: "Swedish",
  SG: "Singaporean",
  SI: "Slovenian",
  SK: "Slovak",
  SL: "Sierra Leonean",
  SM: "Sammarinese",
  SN: "Senegalese",
  SO: "Somali",
  SR: "Surinamese",
  SS: "South Sudanese",
  ST: "São Toméan",
  SV: "Salvadoran",
  SY: "Syrian",
  SZ: "Swazi",
  TD: "Chadian",
  TG: "Togolese",
  TH: "Thai",
  TJ: "Tajik",
  TL: "Timorese",
  TM: "Turkmen",
  TN: "Tunisian",
  TO: "Tongan",
  TR: "Turkish",
  TT: "Trinidadian and Tobagonian",
  TV: "Tuvaluan",
  TZ: "Tanzanian",
  UA: "Ukrainian",
  UG: "Ugandan",
  US: "American",
  UY: "Uruguayan",
  UZ: "Uzbekistani",
  VA: "Vatican",
  VC: "Vincentian",
  VE: "Venezuelan",
  VN: "Vietnamese",
  VU: "Vanuatuan",
  WS: "Samoan",
  YE: "Yemeni",
  ZA: "South African",
  ZM: "Zambian",
  ZW: "Zimbabwean",
};

type DaysCache = {
  /** ISO-2 destination → кол-во дней (null если не найдено) */
  days: Record<string, number | null>;
  updatedAt: number;
};

export class WikiVisaDaysService {
  /** passport ISO-2 → кэш дней */
  private cache = new Map<string, DaysCache>();

  /**
   * Возвращает количество дней пребывания для заданного паспорта и страны назначения.
   * При отсутствии в кэше — загружает страницу Wikipedia.
   */
  async getDays(
    passportCode: string,
    destinationCode: string,
  ): Promise<number | null> {
    const passport = passportCode.toUpperCase();
    const destination = destinationCode.toUpperCase();

    await this.ensureFresh(passport);
    return this.cache.get(passport)?.days[destination] ?? null;
  }

  /**
   * Возвращает все дни для паспорта (Map destination → days).
   */
  async getAllDays(
    passportCode: string,
  ): Promise<Record<string, number | null>> {
    const passport = passportCode.toUpperCase();
    await this.ensureFresh(passport);
    return this.cache.get(passport)?.days ?? {};
  }

  private async ensureFresh(passport: string): Promise<void> {
    const cached = this.cache.get(passport);
    if (cached && Date.now() - cached.updatedAt < CACHE_TTL_MS) return;
    await this.loadFromWikipedia(passport);
  }

  private async loadFromWikipedia(passport: string): Promise<void> {
    const adjective = COUNTRY_NAMES_EN[passport];
    if (!adjective) {
      this.cache.set(passport, { days: {}, updatedAt: Date.now() });
      return;
    }

    const title = `Visa_requirements_for_${adjective}_citizens`;

    try {
      const url = new URL(WIKI_API);
      url.searchParams.set("action", "query");
      url.searchParams.set("titles", title);
      url.searchParams.set("prop", "revisions");
      url.searchParams.set("rvprop", "content");
      url.searchParams.set("rvslots", "main");
      url.searchParams.set("format", "json");
      url.searchParams.set("formatversion", "2");

      const resp = await fetch(url.toString(), {
        headers: { "User-Agent": "TravelGuideApp/1.0 (educational project)" },
      });
      if (!resp.ok) throw new Error(`Wikipedia API HTTP ${resp.status}`);

      const json = await resp.json();

      const pages = json?.query?.pages;
      if (!pages?.length) throw new Error("No pages returned");

      const wikitext: string =
        pages[0]?.revisions?.[0]?.slots?.main?.content ?? "";
      if (!wikitext) throw new Error("Empty wikitext");

      const days = this.parseWikitext(wikitext);

      this.cache.set(passport, { days, updatedAt: Date.now() });
    } catch (err) {
      console.error(`[WikiVisaDays] Failed to load for ${passport}:`, err);
      // Сохраняем пустой кэш чтобы не долбить Wikipedia при каждом запросе
      this.cache.set(passport, { days: {}, updatedAt: Date.now() });
    }
  }

  /**
   * Парсит Wikitext таблицы визовых требований.
   *
   * Реальный формат Wikipedia (каждое поле — отдельная строка):
   * |-
   * | {{flag|Albania}}
   * | {{yes2|eVisa}}<ref>{{Timatic|nationality=RU|destination=AL}}</ref>
   * |data-sort-value="90"| 90 days
   * | Notes...
   *
   * Стратегия:
   * 1. Получаем ISO-2 из {{Timatic|...|destination=XX}} — самый надёжный источник.
   * 2. Количество дней: сначала data-sort-value="N" (уже в днях, задаётся редакторами),
   *    затем "NNN days", затем "N months" × 30, затем "N year(s)" × 365.
   * 3. data-sort-value > 10000 — спецзначения (безлимитно, гражданство и т.п.) → null.
   */
  private parseWikitext(wikitext: string): Record<string, number | null> {
    const result: Record<string, number | null> = {};

    // Ищем только основную таблицу визовых требований
    const tableStart = wikitext.search(/==\s*Visa requirements\s*==/);
    const tableWikitext =
      tableStart >= 0 ? wikitext.slice(tableStart) : wikitext;

    // Разбиваем на строки-строки таблицы по разделителю |-
    const rows = tableWikitext.split(/\n\s*\|\-/);

    for (const row of rows) {
      // ISO-2 код из шаблона Timatic: {{Timatic|nationality=XX|destination=YY}}
      const timaticMatch = row.match(/\|destination=([A-Z]{2})\b/);
      if (!timaticMatch) continue;
      const iso = timaticMatch[1];

      // 1. data-sort-value="N" — Wikipedia редакторы уже проставляют дни
      const sortMatch = row.match(/data-sort-value="(\d+)"/);
      if (sortMatch) {
        const val = parseInt(sortMatch[1], 10);
        // 10001+ — специальные значения (unlimited, citizen, etc.)
        result[iso] = val < 10000 ? val : null;
        continue;
      }

      // 2. "NNN days" / "NNN day"
      const daysMatch = row.match(/(\d+)\s+days?/i);
      if (daysMatch) {
        result[iso] = parseInt(daysMatch[1], 10);
        continue;
      }

      // 3. "N months" → × 30
      const monthsMatch = row.match(/(\d+)\s+months?/i);
      if (monthsMatch) {
        result[iso] = parseInt(monthsMatch[1], 10) * 30;
        continue;
      }

      // 4. "N year(s)" → × 365
      const yearMatch = row.match(/(\d+)\s+years?/i);
      if (yearMatch) {
        result[iso] = parseInt(yearMatch[1], 10) * 365;
        continue;
      }

      result[iso] = null;
    }

    return result;
  }
}

let wikiVisaDaysService: WikiVisaDaysService | null = null;

export const getWikiVisaDaysService = (): WikiVisaDaysService => {
  if (!wikiVisaDaysService) {
    wikiVisaDaysService = new WikiVisaDaysService();
  }
  return wikiVisaDaysService;
};
