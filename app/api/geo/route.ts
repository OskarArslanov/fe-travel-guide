import { NextResponse } from "next/server";
import { GeoService } from "./geo-helpers";

const geoService = new GeoService();

export async function GET(request: Request) {
  const geo = await geoService.locateRequest(request);
  return NextResponse.json(geo, { status: 200 });
}
