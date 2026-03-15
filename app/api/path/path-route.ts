import { NextResponse } from "next/server"; // Extends standard Response with helpers
import { pathService } from "./path-helpers";
import { geoService } from "../geo/geo-helpers";
import { parseParams } from "@/consts/utils";

export async function GET(request: Request) {
  const parsed = parseParams(request.url);
  const geo = await geoService.locateRequest(request);

  if (!parsed.passport) {
    return NextResponse.json(
      { error: "passport query parameter or geo location is required" },
      { status: 400 },
    );
  }
  const result = await pathService.suggest({
    lat: parsed.lat ? Number(parsed.lat) : geo.lat,
    lon: parsed.lon ? Number(parsed.lon) : geo.lon,
    passport: parsed.passport,
    currenctCountryCode: geo.countryCode,
    limit: parsed.limit ? Number(parsed.limit) : 20,
  });

  return NextResponse.json(result, { status: 200 });
}
