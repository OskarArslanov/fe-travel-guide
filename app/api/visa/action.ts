"use server";

import { getVisaService } from "./visa-service";
import { VisaInfoResponseType } from "./visa-types";

export const fetchVisaInfoAction = async (
  passportCode: string,
): Promise<VisaInfoResponseType> => {
  const visaService = await getVisaService();
  const visaInfo = await visaService.getVisaInfo(passportCode);
  return visaInfo;
};
