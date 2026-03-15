export enum TravelMode {
  CAR = "car",
  BIKE = "bike",
  FOOT = "foot",
}

export interface Coordinate {
  lat: number;
  lon: number;
}

export interface RouteStep {
  /** Название улицы */
  name: string;
  /** Тип манёвра: turn, depart, arrive, roundabout и т.д. */
  maneuver: string;
  /** Направление манёвра: left, right, straight и т.д. */
  modifier?: string;
  /** Расстояние шага в метрах */
  distanceM: number;
  /** Длительность шага в секундах */
  durationSec: number;
  /** Координаты точки манёвра [lon, lat] */
  location: [number, number];
}

export interface RouteLeg {
  /** Расстояние отрезка в метрах */
  distanceM: number;
  /** Длительность отрезка в секундах */
  durationSec: number;
  /** Пошаговые инструкции */
  steps: RouteStep[];
}

export interface RouteResult {
  /** Режим передвижения */
  mode: TravelMode;
  /** Общее расстояние в метрах */
  distanceM: number;
  /** Общее расстояние в километрах */
  distanceKm: number;
  /** Общая длительность в секундах */
  durationSec: number;
  /** Общая длительность в минутах */
  durationMin: number;
  /** Отрезки маршрута между точками */
  legs: RouteLeg[];
  /** GeoJSON LineString геометрия маршрута */
  geometry: GeoJsonLineString;
}

export interface GeoJsonLineString {
  type: "LineString";
  coordinates: [number, number][];
}

// ---------- Raw OSRM response types ----------

export interface OsrmRouteResponse {
  code: string;
  message?: string;
  routes: OsrmRoute[];
  waypoints: OsrmWaypoint[];
}

export interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: GeoJsonLineString;
  legs: OsrmLeg[];
}

export interface OsrmLeg {
  distance: number;
  duration: number;
  steps: OsrmStep[];
}

export interface OsrmStep {
  name: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
  };
}

export interface OsrmWaypoint {
  name: string;
  location: [number, number];
  distance: number;
}

export type CoordinateType = {
  lat: number;
  lon: number;
};

export type PathfindingRequest = {
  from: CoordinateType;
  to: CoordinateType;
  waypoints?: CoordinateType[];
  mode?: TravelMode;
};

export type RouteStepType = {
  name: string;
  maneuver: string;
  modifier?: string;
  distanceM: number;
  durationSec: number;
  location: [number, number];
};

export type RouteLegType = {
  distanceM: number;
  durationSec: number;
  steps: RouteStepType[];
};

export type RouteResultType = {
  mode: TravelMode;
  distanceM: number;
  distanceKm: number;
  durationSec: number;
  durationMin: number;
  legs: RouteLegType[];
  geometry: object;
};
