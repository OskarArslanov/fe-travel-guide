import { CostOfLiving } from "./cost-types";

/**
 * Static cost-of-living data per country (ISO 3166-1 alpha-2).
 * Values are approximate 2024 estimates in USD.
 * monthlyBudget = single person excluding rent
 * rent = 1BR city center / month
 * colIndex = Cost of Living Index (NYC ≈ 100)
 * lppIndex = Local Purchasing Power Index (NYC ≈ 100)
 */
export const COST_OF_LIVING_DATA: Record<string, CostOfLiving> = {
  // — Western Europe —
  CH: { monthlyBudget: 2200, rent: 2100, colIndex: 122, lppIndex: 122 },
  NO: { monthlyBudget: 1900, rent: 1700, colIndex: 106, lppIndex: 98 },
  IS: { monthlyBudget: 1700, rent: 1600, colIndex: 100, lppIndex: 87 },
  DK: { monthlyBudget: 1600, rent: 1500, colIndex: 95, lppIndex: 104 },
  SE: { monthlyBudget: 1400, rent: 1300, colIndex: 88, lppIndex: 97 },
  FI: { monthlyBudget: 1300, rent: 1200, colIndex: 83, lppIndex: 90 },
  LU: { monthlyBudget: 1500, rent: 1700, colIndex: 87, lppIndex: 126 },
  IE: { monthlyBudget: 1400, rent: 2000, colIndex: 83, lppIndex: 112 },
  NL: { monthlyBudget: 1300, rent: 1600, colIndex: 80, lppIndex: 107 },
  AT: { monthlyBudget: 1200, rent: 1200, colIndex: 76, lppIndex: 100 },
  BE: { monthlyBudget: 1200, rent: 1100, colIndex: 75, lppIndex: 99 },
  DE: { monthlyBudget: 1100, rent: 1100, colIndex: 72, lppIndex: 112 },
  FR: { monthlyBudget: 1200, rent: 1300, colIndex: 74, lppIndex: 98 },
  GB: { monthlyBudget: 1300, rent: 1800, colIndex: 81, lppIndex: 103 },
  IT: { monthlyBudget: 1100, rent: 900, colIndex: 68, lppIndex: 82 },
  ES: { monthlyBudget: 900, rent: 900, colIndex: 60, lppIndex: 84 },
  PT: { monthlyBudget: 900, rent: 900, colIndex: 56, lppIndex: 70 },
  GR: { monthlyBudget: 800, rent: 600, colIndex: 53, lppIndex: 63 },
  MT: { monthlyBudget: 950, rent: 1000, colIndex: 60, lppIndex: 72 },
  CY: { monthlyBudget: 950, rent: 850, colIndex: 62, lppIndex: 75 },

  // — Central / Eastern Europe —
  CZ: { monthlyBudget: 750, rent: 750, colIndex: 48, lppIndex: 74 },
  SK: { monthlyBudget: 700, rent: 700, colIndex: 46, lppIndex: 66 },
  PL: { monthlyBudget: 650, rent: 650, colIndex: 43, lppIndex: 63 },
  HU: { monthlyBudget: 650, rent: 650, colIndex: 44, lppIndex: 56 },
  SI: { monthlyBudget: 850, rent: 800, colIndex: 57, lppIndex: 71 },
  HR: { monthlyBudget: 800, rent: 750, colIndex: 53, lppIndex: 63 },
  RO: { monthlyBudget: 550, rent: 500, colIndex: 37, lppIndex: 52 },
  BG: { monthlyBudget: 500, rent: 450, colIndex: 34, lppIndex: 48 },
  RS: { monthlyBudget: 500, rent: 500, colIndex: 34, lppIndex: 46 },
  BA: { monthlyBudget: 450, rent: 400, colIndex: 31, lppIndex: 41 },
  AL: { monthlyBudget: 400, rent: 350, colIndex: 28, lppIndex: 38 },
  MK: { monthlyBudget: 400, rent: 350, colIndex: 27, lppIndex: 36 },
  ME: { monthlyBudget: 500, rent: 500, colIndex: 35, lppIndex: 44 },
  XK: { monthlyBudget: 380, rent: 330, colIndex: 26, lppIndex: 34 },
  LT: { monthlyBudget: 700, rent: 650, colIndex: 47, lppIndex: 61 },
  LV: { monthlyBudget: 700, rent: 650, colIndex: 47, lppIndex: 58 },
  EE: { monthlyBudget: 800, rent: 750, colIndex: 54, lppIndex: 66 },
  MD: { monthlyBudget: 350, rent: 300, colIndex: 25, lppIndex: 30 },
  UA: { monthlyBudget: 400, rent: 300, colIndex: 29, lppIndex: 32 },
  BY: { monthlyBudget: 450, rent: 350, colIndex: 31, lppIndex: 34 },
  RU: { monthlyBudget: 550, rent: 450, colIndex: 38, lppIndex: 44 },

  // — North America —
  US: { monthlyBudget: 1500, rent: 1700, colIndex: 100, lppIndex: 100 },
  CA: { monthlyBudget: 1400, rent: 1600, colIndex: 72, lppIndex: 108 },
  MX: { monthlyBudget: 600, rent: 500, colIndex: 38, lppIndex: 52 },

  // — Central America & Caribbean —
  CR: { monthlyBudget: 650, rent: 600, colIndex: 45, lppIndex: 56 },
  PA: { monthlyBudget: 700, rent: 700, colIndex: 47, lppIndex: 60 },
  GT: { monthlyBudget: 450, rent: 400, colIndex: 33, lppIndex: 42 },
  CU: { monthlyBudget: 350, rent: 200, colIndex: 28, lppIndex: 22 },
  DO: { monthlyBudget: 550, rent: 450, colIndex: 38, lppIndex: 48 },
  JM: { monthlyBudget: 600, rent: 550, colIndex: 42, lppIndex: 40 },

  // — South America —
  BR: { monthlyBudget: 550, rent: 450, colIndex: 38, lppIndex: 52 },
  AR: { monthlyBudget: 400, rent: 300, colIndex: 27, lppIndex: 36 },
  CL: { monthlyBudget: 650, rent: 600, colIndex: 44, lppIndex: 60 },
  CO: { monthlyBudget: 500, rent: 450, colIndex: 35, lppIndex: 48 },
  PE: { monthlyBudget: 500, rent: 450, colIndex: 34, lppIndex: 46 },
  EC: { monthlyBudget: 500, rent: 400, colIndex: 34, lppIndex: 42 },
  UY: { monthlyBudget: 700, rent: 650, colIndex: 47, lppIndex: 56 },
  PY: { monthlyBudget: 400, rent: 350, colIndex: 28, lppIndex: 40 },
  BO: { monthlyBudget: 350, rent: 250, colIndex: 26, lppIndex: 36 },
  VE: { monthlyBudget: 300, rent: 200, colIndex: 22, lppIndex: 18 },

  // — East Asia —
  JP: { monthlyBudget: 1100, rent: 900, colIndex: 73, lppIndex: 79 },
  KR: { monthlyBudget: 1000, rent: 950, colIndex: 68, lppIndex: 88 },
  CN: { monthlyBudget: 750, rent: 750, colIndex: 52, lppIndex: 110 },
  TW: { monthlyBudget: 850, rent: 700, colIndex: 57, lppIndex: 96 },
  HK: { monthlyBudget: 1400, rent: 2500, colIndex: 85, lppIndex: 88 },
  MO: { monthlyBudget: 1200, rent: 1800, colIndex: 80, lppIndex: 84 },
  MN: { monthlyBudget: 400, rent: 350, colIndex: 30, lppIndex: 42 },

  // — Southeast Asia —
  SG: { monthlyBudget: 1500, rent: 2200, colIndex: 91, lppIndex: 94 },
  TH: { monthlyBudget: 600, rent: 500, colIndex: 42, lppIndex: 52 },
  VN: { monthlyBudget: 450, rent: 350, colIndex: 32, lppIndex: 42 },
  MY: { monthlyBudget: 600, rent: 550, colIndex: 41, lppIndex: 64 },
  ID: { monthlyBudget: 450, rent: 400, colIndex: 33, lppIndex: 52 },
  PH: { monthlyBudget: 450, rent: 400, colIndex: 33, lppIndex: 46 },
  KH: { monthlyBudget: 400, rent: 350, colIndex: 28, lppIndex: 36 },
  MM: { monthlyBudget: 350, rent: 250, colIndex: 26, lppIndex: 28 },
  LA: { monthlyBudget: 380, rent: 280, colIndex: 27, lppIndex: 30 },

  // — South Asia —
  IN: { monthlyBudget: 350, rent: 250, colIndex: 25, lppIndex: 60 },
  PK: { monthlyBudget: 280, rent: 200, colIndex: 22, lppIndex: 36 },
  BD: { monthlyBudget: 280, rent: 200, colIndex: 22, lppIndex: 34 },
  LK: { monthlyBudget: 380, rent: 280, colIndex: 27, lppIndex: 38 },
  NP: { monthlyBudget: 300, rent: 200, colIndex: 22, lppIndex: 28 },

  // — Central Asia —
  KZ: { monthlyBudget: 450, rent: 400, colIndex: 33, lppIndex: 52 },
  UZ: { monthlyBudget: 300, rent: 200, colIndex: 22, lppIndex: 28 },
  KG: { monthlyBudget: 280, rent: 200, colIndex: 21, lppIndex: 26 },
  TJ: { monthlyBudget: 250, rent: 150, colIndex: 19, lppIndex: 22 },
  TM: { monthlyBudget: 300, rent: 200, colIndex: 22, lppIndex: 24 },

  // — Middle East —
  AE: { monthlyBudget: 1400, rent: 1800, colIndex: 81, lppIndex: 88 },
  QA: { monthlyBudget: 1300, rent: 1600, colIndex: 76, lppIndex: 96 },
  KW: { monthlyBudget: 1200, rent: 1400, colIndex: 74, lppIndex: 92 },
  BH: { monthlyBudget: 1100, rent: 1200, colIndex: 68, lppIndex: 86 },
  OM: { monthlyBudget: 1000, rent: 1000, colIndex: 64, lppIndex: 82 },
  SA: { monthlyBudget: 1000, rent: 1100, colIndex: 62, lppIndex: 90 },
  IL: { monthlyBudget: 1400, rent: 1600, colIndex: 85, lppIndex: 80 },
  JO: { monthlyBudget: 700, rent: 600, colIndex: 48, lppIndex: 52 },
  LB: { monthlyBudget: 600, rent: 500, colIndex: 44, lppIndex: 38 },
  TR: { monthlyBudget: 500, rent: 400, colIndex: 36, lppIndex: 54 },
  IR: { monthlyBudget: 350, rent: 250, colIndex: 26, lppIndex: 32 },
  IQ: { monthlyBudget: 400, rent: 350, colIndex: 30, lppIndex: 38 },
  GE: { monthlyBudget: 550, rent: 500, colIndex: 38, lppIndex: 48 },
  AM: { monthlyBudget: 500, rent: 450, colIndex: 36, lppIndex: 44 },
  AZ: { monthlyBudget: 500, rent: 450, colIndex: 36, lppIndex: 48 },

  // — Africa —
  ZA: { monthlyBudget: 500, rent: 450, colIndex: 37, lppIndex: 60 },
  EG: { monthlyBudget: 300, rent: 200, colIndex: 23, lppIndex: 34 },
  MA: { monthlyBudget: 400, rent: 300, colIndex: 30, lppIndex: 40 },
  TN: { monthlyBudget: 350, rent: 250, colIndex: 27, lppIndex: 34 },
  DZ: { monthlyBudget: 350, rent: 250, colIndex: 27, lppIndex: 32 },
  NG: { monthlyBudget: 300, rent: 300, colIndex: 26, lppIndex: 40 },
  KE: { monthlyBudget: 350, rent: 300, colIndex: 28, lppIndex: 36 },
  ET: { monthlyBudget: 250, rent: 200, colIndex: 20, lppIndex: 26 },
  GH: { monthlyBudget: 350, rent: 300, colIndex: 28, lppIndex: 34 },
  TZ: { monthlyBudget: 300, rent: 250, colIndex: 24, lppIndex: 28 },
  UG: { monthlyBudget: 300, rent: 220, colIndex: 23, lppIndex: 26 },
  CI: { monthlyBudget: 350, rent: 300, colIndex: 27, lppIndex: 32 },
  CM: { monthlyBudget: 300, rent: 250, colIndex: 24, lppIndex: 28 },
  SN: { monthlyBudget: 350, rent: 300, colIndex: 27, lppIndex: 30 },
  MZ: { monthlyBudget: 250, rent: 200, colIndex: 20, lppIndex: 24 },
  ZM: { monthlyBudget: 300, rent: 250, colIndex: 24, lppIndex: 28 },
  ZW: { monthlyBudget: 350, rent: 300, colIndex: 28, lppIndex: 24 },
  RW: { monthlyBudget: 300, rent: 250, colIndex: 24, lppIndex: 28 },
  MU: { monthlyBudget: 550, rent: 500, colIndex: 39, lppIndex: 48 },
  NA: { monthlyBudget: 400, rent: 350, colIndex: 31, lppIndex: 42 },
  BW: { monthlyBudget: 400, rent: 350, colIndex: 31, lppIndex: 44 },

  // — Oceania —
  AU: { monthlyBudget: 1400, rent: 1500, colIndex: 84, lppIndex: 108 },
  NZ: { monthlyBudget: 1200, rent: 1300, colIndex: 80, lppIndex: 96 },
  FJ: { monthlyBudget: 500, rent: 400, colIndex: 38, lppIndex: 44 },
};

export function getCostOfLiving(countryCode: string): CostOfLiving | null {
  return COST_OF_LIVING_DATA[countryCode.toUpperCase()] ?? null;
}
