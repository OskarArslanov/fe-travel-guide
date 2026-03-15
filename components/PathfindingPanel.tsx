"use client";

import { PathType } from "@/app/api/path/path-types";
import { TravelMode, RouteResult } from "@/app/api/pathfinding/pathfinding-types";
import { useState } from "react";

// Country centroids (subset needed for pathfinding requests)
const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  AD: [42.546245, 1.601554],
  AE: [23.424076, 53.847818],
  AF: [33.93911, 67.709953],
  AG: [17.060816, -61.796428],
  AL: [41.153332, 20.168331],
  AM: [40.069099, 45.038189],
  AO: [-11.202692, 17.873887],
  AR: [-38.416097, -63.616672],
  AT: [47.516231, 14.550072],
  AU: [-25.274398, 133.775136],
  AZ: [40.143105, 47.576927],
  BA: [43.915886, 17.679076],
  BB: [13.193887, -59.543198],
  BD: [23.684994, 90.356331],
  BE: [50.503887, 4.469936],
  BF: [12.364566, -1.561593],
  BG: [42.733883, 25.48583],
  BH: [25.930414, 50.637772],
  BI: [-3.373056, 29.918886],
  BJ: [9.30769, 2.315834],
  BN: [4.535277, 114.727669],
  BO: [-16.290154, -63.588653],
  BR: [-14.235004, -51.92528],
  BS: [25.03428, -77.39628],
  BT: [27.514162, 90.433601],
  BW: [-22.328474, 24.684866],
  BY: [53.709807, 27.953389],
  BZ: [17.189877, -88.49765],
  CA: [56.130366, -106.346771],
  CD: [-4.038333, 21.758664],
  CF: [6.611111, 20.939444],
  CG: [-0.228021, 15.827659],
  CH: [46.818188, 8.227512],
  CI: [7.539989, -5.54708],
  CL: [-35.675147, -71.542969],
  CM: [3.848033, 11.502075],
  CN: [35.86166, 104.195397],
  CO: [4.570868, -74.297333],
  CR: [9.748917, -83.753428],
  CU: [21.521757, -77.781167],
  CV: [16.002082, -24.013197],
  CY: [35.126413, 33.429859],
  CZ: [49.817492, 15.472962],
  DE: [51.165691, 10.451526],
  DJ: [11.825138, 42.590275],
  DK: [56.26392, 9.501785],
  DM: [15.414999, -61.370976],
  DO: [18.735693, -70.162651],
  DZ: [28.033886, 1.659626],
  EC: [-1.831239, -78.183406],
  EE: [58.595272, 25.013607],
  EG: [26.820553, 30.802498],
  ER: [15.179384, 39.782334],
  ES: [40.463667, -3.74922],
  ET: [9.145, 40.489673],
  FI: [61.92411, 25.748151],
  FJ: [-16.578193, 179.414413],
  FR: [46.227638, 2.213749],
  GA: [-0.803689, 11.609444],
  GB: [55.378051, -3.435973],
  GD: [12.262776, -61.604171],
  GE: [42.315407, 43.356892],
  GH: [7.946527, -1.023194],
  GM: [13.443182, -15.310139],
  GN: [9.945587, -9.696645],
  GQ: [1.650801, 10.267895],
  GR: [39.074208, 21.824312],
  GT: [15.783471, -90.230759],
  GW: [11.803749, -15.180413],
  GY: [4.860416, -58.93018],
  HN: [15.199999, -86.241905],
  HR: [45.1, 15.2],
  HT: [18.971187, -72.285215],
  HU: [47.162494, 19.503304],
  ID: [-0.789275, 113.921327],
  IE: [53.41291, -8.24389],
  IL: [31.046051, 34.851612],
  IN: [20.593684, 78.96288],
  IQ: [33.223191, 43.679291],
  IR: [32.427908, 53.688046],
  IS: [64.963051, -19.020835],
  IT: [41.87194, 12.56738],
  JM: [18.109581, -77.297508],
  JO: [30.585164, 36.238414],
  JP: [36.204824, 138.252924],
  KE: [-0.023559, 37.906193],
  KG: [41.20438, 74.766098],
  KH: [12.565679, 104.990963],
  KI: [-3.370417, -168.734039],
  KM: [-11.875001, 43.872219],
  KN: [17.357822, -62.782998],
  KP: [40.339852, 127.510093],
  KR: [35.907757, 127.766922],
  KW: [29.31166, 47.481766],
  KZ: [48.019573, 66.923684],
  LA: [19.85627, 102.495496],
  LB: [33.854721, 35.862285],
  LC: [13.909444, -60.978893],
  LI: [47.166, 9.555373],
  LK: [7.873054, 80.771797],
  LR: [6.428055, -9.429499],
  LS: [-29.609988, 28.233608],
  LT: [55.169438, 23.881275],
  LU: [49.815273, 6.129583],
  LV: [56.879635, 24.603189],
  LY: [26.3351, 17.228331],
  MA: [31.791702, -7.09262],
  MC: [43.750298, 7.412841],
  MD: [47.411631, 28.369885],
  ME: [42.708678, 19.37439],
  MG: [-18.766947, 46.869107],
  MH: [7.131474, 171.184478],
  MK: [41.608635, 21.745275],
  ML: [17.570692, -3.996166],
  MM: [21.913965, 95.956223],
  MN: [46.862496, 103.846656],
  MR: [21.00789, -10.940835],
  MT: [35.937496, 14.375416],
  MU: [-20.348404, 57.552152],
  MV: [3.202778, 73.22068],
  MW: [-13.254308, 34.301525],
  MX: [23.634501, -102.552784],
  MY: [4.210484, 101.975766],
  MZ: [-18.665695, 35.529562],
  NA: [-22.95764, 18.49041],
  NE: [17.607789, 8.081666],
  NG: [9.081999, 8.675277],
  NI: [12.865416, -85.207229],
  NL: [52.132633, 5.291266],
  NO: [60.472024, 8.468946],
  NP: [28.394857, 84.124008],
  NR: [-0.522778, 166.931503],
  NZ: [-40.900557, 174.885971],
  OM: [21.512583, 55.923255],
  PA: [8.537981, -80.782127],
  PE: [-9.189967, -75.015152],
  PG: [-6.314993, 143.95555],
  PH: [12.879721, 121.774017],
  PK: [30.375321, 69.345116],
  PL: [51.919438, 19.145136],
  PT: [39.399872, -8.224454],
  PW: [7.51498, 134.58252],
  PY: [-23.442503, -58.443832],
  QA: [25.354826, 51.183884],
  RO: [45.943161, 24.96676],
  RS: [44.016521, 21.005859],
  RU: [61.52401, 105.318756],
  RW: [-1.940278, 29.873888],
  SA: [23.885942, 45.079162],
  SB: [-9.64571, 160.156194],
  SC: [-4.679574, 55.491977],
  SD: [12.862807, 30.217636],
  SE: [60.128161, 18.643501],
  SG: [1.352083, 103.819836],
  SI: [46.151241, 14.995463],
  SK: [48.669026, 19.699024],
  SL: [8.460555, -11.779889],
  SM: [43.94236, 12.457777],
  SN: [14.497401, -14.452362],
  SO: [5.152149, 46.199616],
  SR: [3.919305, -56.027783],
  SS: [4.85, 31.6],
  ST: [0.18636, 6.613081],
  SV: [13.794185, -88.89653],
  SY: [34.802075, 38.996815],
  SZ: [-26.522503, 31.465866],
  TD: [15.454166, 18.732207],
  TG: [8.619543, 0.824782],
  TH: [15.870032, 100.992541],
  TJ: [38.861034, 71.276093],
  TL: [-8.874217, 125.727539],
  TM: [38.969719, 59.556278],
  TN: [33.886917, 9.537499],
  TO: [-21.178986, -175.198242],
  TR: [38.963745, 35.243322],
  TT: [10.691803, -61.222503],
  TV: [-7.109535, 177.64933],
  TZ: [-6.369028, 34.888822],
  UA: [48.379433, 31.16558],
  UG: [1.373333, 32.290275],
  US: [37.09024, -95.712891],
  UY: [-32.522779, -55.765835],
  UZ: [41.377491, 64.585262],
  VA: [41.902916, 12.453389],
  VC: [12.984305, -61.287228],
  VE: [6.42375, -66.58973],
  VN: [14.058324, 108.277199],
  VU: [-15.376706, 166.959158],
  WS: [-13.759029, -172.104629],
  YE: [15.552727, 48.516388],
  ZA: [-30.559482, 22.937506],
  ZM: [-13.133897, 27.849332],
  ZW: [-19.015438, 29.154857],
};

interface PathfindingPanelProps {
  items: PathType[];
  selectedIndex?: number;
  userLat?: number;
  userLon?: number;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getFlagEmoji(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const MODE_LABELS: Record<TravelMode, { label: string; icon: string }> = {
  [TravelMode.CAR]: { label: "Car", icon: "🚗" },
  [TravelMode.BIKE]: { label: "Bike", icon: "🚴" },
  [TravelMode.FOOT]: { label: "Walk", icon: "🚶" },
};

export default function PathfindingPanel({
  items,
  selectedIndex,
  userLat,
  userLon,
}: PathfindingPanelProps) {
  const [mode, setMode] = useState<TravelMode>(TravelMode.CAR);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fromItem =
    selectedIndex && selectedIndex > 0 ? items[selectedIndex - 1] : null;
  const toItem = selectedIndex ? items[selectedIndex] : null;

  // Determine from coordinates: if index 0→1, from is previous country; if first in list, from is user location
  const fromCoords: [number, number] | undefined = (() => {
    if (!selectedIndex) return undefined;
    if (selectedIndex === 0) {
      return userLat && userLon ? [userLat, userLon] : undefined;
    }
    const prev = items[selectedIndex - 1];
    const c = COUNTRY_CENTROIDS[prev.countryCode];
    return c ?? undefined;
  })();

  const toCoords: [number, number] | undefined = toItem
    ? (COUNTRY_CENTROIDS[toItem.countryCode] ?? undefined)
    : undefined;

  const canBuildRoute =
    fromCoords !== undefined &&
    toCoords !== undefined &&
    selectedIndex !== undefined;

  async function fetchRoute() {
    if (!canBuildRoute || !fromCoords || !toCoords || !toItem) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({
        countryCode: toItem.countryCode,
        fromLat: String(fromCoords[0]),
        fromLon: String(fromCoords[1]),
        toLat: String(toCoords[0]),
        toLon: String(toCoords[1]),
        mode,
      });
      const res = await fetch(`/api/pathfinding?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data: RouteResult = await res.json();
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-zinc-800">
          🗺 How to get there
        </span>
      </div>

      {selectedIndex === null ? (
        <p className="text-sm text-zinc-400">
          Select a destination in the route list to find directions.
        </p>
      ) : !canBuildRoute ? (
        <p className="text-sm text-zinc-400">
          {userLat === null
            ? "Location unavailable. Cannot find route from your position."
            : "Cannot determine coordinates for this leg."}
        </p>
      ) : (
        <>
          {/* From → To */}
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="font-medium">
              {fromItem ? (
                <>
                  {getFlagEmoji(fromItem.countryCode)} {fromItem.countryName}
                </>
              ) : (
                "📍 Your location"
              )}
            </span>
            <span className="text-zinc-300">→</span>
            <span className="font-medium">
              {toItem && (
                <>
                  {getFlagEmoji(toItem.countryCode)} {toItem.countryName}
                </>
              )}
            </span>
          </div>

          {/* Mode picker */}
          <div className="flex gap-2">
            {(
              Object.entries(MODE_LABELS) as [
                TravelMode,
                { label: string; icon: string },
              ][]
            ).map(([m, { label, icon }]) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setResult(null);
                  setError(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  mode === m
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Build route button */}
          <button
            onClick={fetchRoute}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Building route…" : "Find route"}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ⚠ {error}
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-3">
              {/* Summary */}
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-700">
                    {result.distanceKm.toLocaleString()} km
                  </div>
                  <div className="text-xs text-blue-500">distance</div>
                </div>
                <div className="w-px h-8 bg-blue-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-700">
                    {formatDuration(result.durationMin)}
                  </div>
                  <div className="text-xs text-blue-500">duration</div>
                </div>
                <div className="w-px h-8 bg-blue-200" />
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-700">
                    {result.legs.length}
                  </div>
                  <div className="text-xs text-blue-500">
                    leg{result.legs.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Steps */}
              {result.legs[0]?.steps && result.legs[0].steps.length > 0 && (
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                    Route steps
                  </div>
                  {result.legs[0].steps.slice(0, 20).map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-zinc-600 py-0.5"
                    >
                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 font-mono">
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate">
                        {step.maneuver}
                        {step.modifier ? ` ${step.modifier}` : ""}
                        {step.name ? ` · ${step.name}` : ""}
                      </span>
                      <span className="flex-shrink-0 text-zinc-400">
                        {Math.round(step.distanceM)}m
                      </span>
                    </div>
                  ))}
                  {result.legs[0].steps.length > 20 && (
                    <p className="text-xs text-zinc-400 text-center pt-1">
                      +{result.legs[0].steps.length - 20} more steps
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
