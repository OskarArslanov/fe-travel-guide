"use client";

import {
  TravelMode,
  CoordinateType,
} from "@/app/api/pathfinding/pathfinding-types";
import { useMemo, useState } from "react";
import { countryCentroids } from "./root-paths-panel-helpers";
import { useQueryParams } from "@/hooks/use-query-params";
import { usePathfindingStore } from "@/store/pathfinding.store";
import { useGeoStore } from "@/store/geo.store";
import { usePathStore } from "@/store/path.store";
import { getFlagEmoji } from "@/consts/utils";

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const MODE_LABELS: Record<TravelMode, { label: string; icon: string }> = {
  [TravelMode.CAR]: { label: "Car", icon: "🚗" },
  [TravelMode.BIKE]: { label: "Bike", icon: "🚴" },
  [TravelMode.FOOT]: { label: "Walk", icon: "🚶" },
};

export const RootPathsPanel = () => {
  const geo = useGeoStore().geo;
  const lat = geo?.lat ?? null;
  const lon = geo?.lon ?? null;
  const sourceCountry = geo?.countryCode ?? null;

  const targetCountry = useQueryParams().getQueryParams().targetCountry;

  const { findPath, isLoading, path: result } = usePathfindingStore();
  const [mode, setMode] = useState<TravelMode>(TravelMode.CAR);

  // Find COL data for selected destination
  const path = usePathStore().path;
  const selectedPathItem = path?.suggestions.find(
    (s) => s.countryCode === targetCountry,
  );

  const { from, to, canBuildRoute } = useMemo(() => {
    const from: CoordinateType | undefined =
      lat && lon ? { lat, lon } : undefined;
    const to = targetCountry ? countryCentroids[targetCountry] : undefined;

    const canBuildRoute =
      from !== undefined &&
      to !== undefined &&
      from.lat !== to.lat &&
      from.lon !== to.lon;
    return { from, to, canBuildRoute };
  }, [targetCountry, lat, lon]);

  async function fetchRoute() {
    if (!canBuildRoute || !from || !to) return;
    await findPath({ from, to, mode, waypoints: [] });
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-zinc-800">
          🗺 How to get there
        </span>
      </div>

      {!targetCountry && (
        <p className="text-sm text-zinc-400">
          Select a destination in the route list to find directions.
        </p>
      )}

      {targetCountry && !canBuildRoute && (
        <p className="text-sm text-zinc-400">
          {lat === null || lon === null
            ? "Location unavailable. Cannot find route from your position."
            : "Cannot determine coordinates for this leg."}
        </p>
      )}

      {targetCountry && canBuildRoute && (
        <>
          {/* From → To */}
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="font-medium">
              {sourceCountry ? (
                <>
                  {getFlagEmoji(sourceCountry)} {sourceCountry}
                </>
              ) : (
                "📍 Your location"
              )}
            </span>
            <span className="text-zinc-300">→</span>
            <span className="font-medium">
              {to && (
                <>
                  {getFlagEmoji(targetCountry)} {targetCountry}
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
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Building route…" : "Find route"}
          </button>

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

      {/* Cost of Living section */}
      {selectedPathItem?.costOfLiving && (
        <>
          <div className="h-px bg-zinc-100" />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-700">
              💸 Cost of Living
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col p-2.5 bg-zinc-50 rounded-lg">
                <span className="text-xs text-zinc-400">Monthly budget</span>
                <span className="text-base font-bold text-zinc-800">
                  ${selectedPathItem.costOfLiving.monthlyBudget.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-400">excl. rent</span>
              </div>
              <div className="flex flex-col p-2.5 bg-zinc-50 rounded-lg">
                <span className="text-xs text-zinc-400">Rent (1BR)</span>
                <span className="text-base font-bold text-zinc-800">
                  ${selectedPathItem.costOfLiving.rent.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-400">city center/mo</span>
              </div>
              <div className="flex flex-col p-2.5 bg-zinc-50 rounded-lg">
                <span className="text-xs text-zinc-400">COL Index</span>
                <span className="text-base font-bold text-zinc-800">
                  {selectedPathItem.costOfLiving.colIndex}
                </span>
                <span className="text-xs text-zinc-400">NYC = 100</span>
              </div>
              <div className="flex flex-col p-2.5 bg-zinc-50 rounded-lg">
                <span className="text-xs text-zinc-400">Local Purch. Power</span>
                <span className="text-base font-bold text-zinc-800">
                  {selectedPathItem.costOfLiving.lppIndex}
                </span>
                <span className="text-xs text-zinc-400">NYC = 100</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              * Approximate 2024 estimates in USD
            </p>
          </div>
        </>
      )}
    </div>
  );
};
