import { NextResponse } from "next/server"; // Extends standard Response with helpers
import { pathService } from "./path-helpers";
import { geoService } from "../geo/geo-helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = {
    passport: searchParams.get("passport") || "",
    lat: searchParams.get("lat") || undefined,
    lon: searchParams.get("lon") || undefined,
    limit: searchParams.get("limit") || undefined,
  };

  let lat = query.lat ? Number(query.lat) : undefined;
  let lon = query.lon ? Number(query.lon) : undefined;

  // Если координаты не переданы — определяем по IP
  if (lat === undefined || lon === undefined) {
    const geo = await geoService.locateRequest(request);
    lat = geo.lat;
    lon = geo.lon;
  }
  const result = await pathService.suggest(
    query.passport,
    lat,
    lon,
    query.limit ? Number(query.limit) : 20,
  );

  return NextResponse.json(result, { status: 200 });
}
