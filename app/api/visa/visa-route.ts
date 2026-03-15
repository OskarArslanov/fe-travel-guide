import { NextResponse } from "next/server"; // Extends standard Response with helpers
import { visaService } from "./visa-helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = searchParams.get("countryCode")?.toLocaleUpperCase();

  if (!countryCode) {
    return NextResponse.json(
      { error: "countryCode query parameter is required" },
      { status: 400 },
    );
  }

  const result = await visaService.getVisaInfo(countryCode);

  return NextResponse.json(result, { status: 200 });
}
