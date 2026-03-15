import { NextResponse } from "next/server";
import { geoService } from "./geo-helpers";

export async function GET(request: Request) {
  const geo = await geoService.locateRequest(request);
  return NextResponse.json(geo, { status: 200 });
}
