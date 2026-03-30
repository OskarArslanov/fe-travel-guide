export type CostOfLiving = {
  /** Monthly budget for a single person (USD) */
  monthlyBudget: number;
  /** Monthly rent (1 bedroom city center) in USD */
  rent: number;
  /** Cost of Living Index (NYC = 100) */
  colIndex: number;
  /** Local Purchasing Power Index */
  lppIndex: number;
};
