"use server";

import { getVisaService } from "./visa-service";
import { VisaInfoResponseType } from "./visa-types";

export const fetchVisaInfoAction = async (
  passportCode: string,
): Promise<VisaInfoResponseType> => {
  const visaInfo = await getVisaService().getVisaInfo(passportCode);
  return visaInfo;
};
