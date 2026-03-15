import {
  OsrmRouteResponse,
  PathfindingRequest,
  RouteLeg,
  RouteResult,
  RouteStep,
  TravelMode,
} from "./pathfinding-types";

/** Публичный OSRM-инстанс на OpenStreetMap данных */
const OSRM_BASE = "http://router.project-osrm.org";

export class PathfindingService {
  /**
   * Строит маршрут между точками.
   * @param from       - точка отправления
   * @param to         - точка назначения
   * @param waypoints  - промежуточные точки (опционально)
   * @param mode       - режим передвижения (car / bike / foot)
   */
  async buildRoute(request: PathfindingRequest): Promise<RouteResult> {
    const { from, to, waypoints = [], mode = TravelMode.CAR } = request;
    const allPoints = [from, ...waypoints, to];
    const coords = allPoints.map((p) => `${p.lon},${p.lat}`).join(";");

    const url =
      `${OSRM_BASE}/route/v1/${mode}/${coords}` +
      `?overview=full&geometries=geojson&steps=true`;

    console.log(`OSRM request: ${url}`);

    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(`OSRM responded with HTTP ${resp.status}`);
    }

    const data = (await resp.json()) as OsrmRouteResponse;

    if (data.code !== "Ok") {
      throw new Error(
        `OSRM routing failed: ${data.code}${data.message ? ` — ${data.message}` : ""}`,
      );
    }

    const route = data.routes[0];

    const legs: RouteLeg[] = route.legs.map((leg) => ({
      distanceM: leg.distance,
      durationSec: leg.duration,
      steps: leg.steps.map(
        (step): RouteStep => ({
          name: step.name,
          maneuver: step.maneuver.type,
          modifier: step.maneuver.modifier,
          distanceM: step.distance,
          durationSec: step.duration,
          location: step.maneuver.location,
        }),
      ),
    }));

    return {
      mode,
      distanceM: route.distance,
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
      durationSec: route.duration,
      durationMin: Math.round(route.duration / 60),
      legs,
      geometry: route.geometry,
    };
  }
}

export const routingService = new PathfindingService();