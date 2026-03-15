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

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const waypoints = searchParams.get("waypoints");
  const mode = searchParams.get("mode") as TravelMode | null;
  
  const parsedRequest: PathfindingRequest = {
    from: from ? JSON.parse(from) : undefined,
    to: to ? JSON.parse(to) : undefined,
    waypoints: waypoints ? JSON.parse(waypoints) : [],
    mode: mode ? mode : TravelMode.CAR,
  };
  const result = await routingService.buildPath(parsedRequest);

  return NextResponse.json(result, { status: 200 });
}
