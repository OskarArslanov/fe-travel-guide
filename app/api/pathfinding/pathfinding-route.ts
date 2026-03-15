import { NextResponse } from "next/server"; // Extends standard Response with helpers
import { PathfindingRequest, TravelMode } from "./pathfinding-types";
import { routingService } from "./pathfinding-helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const countryCode = searchParams.get("countryCode")?.toLocaleUpperCase();

  if (!countryCode) {
    return NextResponse.json(
      { error: "countryCode query parameter is required" },
      { status: 400 },
    );
  }

  console.log(searchParams);
  const parsedRequest: PathfindingRequest = {
    from: {
      lat: Number(searchParams.get("fromLat")),
      lon: Number(searchParams.get("fromLon")),
    },
    to: {
      lat: Number(searchParams.get("toLat")),
      lon: Number(searchParams.get("toLon")),
    },
    waypoints: searchParams.get("waypoints")
      ? JSON.parse(searchParams.get("waypoints")!)
      : [],
    mode: searchParams.get("mode")
      ? (searchParams.get("mode") as TravelMode)
      : TravelMode.CAR,
  };
  const result = await routingService.buildRoute(parsedRequest);

  return NextResponse.json(result, { status: 200 });
}
