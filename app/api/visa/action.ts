"use server";

import { getVisaService } from "./visa-service";
import { VisaInfoResponseType } from "./visa-types";

export const fetchVisaInfoAction = async (
  passportCode: string,
): Promise<VisaInfoResponseType> => {
  return getVisaService().getVisaInfo(passportCode);
};
