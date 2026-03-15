"use client";

import { useState, useEffect, useCallback } from "react";
import { PathResponse, PathType } from "./api/path/path-types";
import { GeoLocation } from "./api/geo/geo-types";
import {
  PassportSelector,
  passportWithEmoji,
} from "../features/passport-selector";
import { IdValue } from "../consts/props";
import { Selector } from "@/components/selector";
import PathfindingPanel from "@/components/PathfindingPanel";
import RouteList from "@/components/RouteList";

const limitOptions: IdValue[] = [
  { id: "5", value: 5 },
  { id: "10", value: 10 },
  { id: "15", value: 15 },
  { id: "20", value: 20 },
  { id: "30", value: 30 },
];

export default function Home() {
  const [passport, setPassport] = useState<IdValue>(passportWithEmoji[0]);
  const [geo, setGeo] = useState<GeoLocation>();
  const [geoLoading, setGeoLoading] = useState(true);

  const [routeItems, setRouteItems] = useState<PathType[]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string>();
  const [routeMeta, setRouteMeta] = useState<{
    passport: string;
    total: number;
  }>();

  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [limit, setLimit] = useState<IdValue>(limitOptions[2]);

  // Fetch user geo on mount
  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((data: GeoLocation) => setGeo(data))
      .catch(() => setGeo(undefined))
      .finally(() => setGeoLoading(false));
  }, []);

  // Fetch route suggestions
  const fetchRoute = useCallback(async () => {
    if (!passport) return;
    setRouteLoading(true);
    setRouteError(undefined);
    setSelectedIndex(undefined);
    try {
      const params = new URLSearchParams({
        passport: passport.id,
        limit: limit.id,
      });
      if (geo) {
        params.set("lat", String(geo.lat));
        params.set("lon", String(geo.lon));
      }
      const res = await fetch(`/api/path?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data: PathResponse = await res.json();
      setRouteItems(data.suggestions);
      setRouteMeta({ passport: data.passport, total: data.total });
    } catch (e: unknown) {
      setRouteError(e instanceof Error ? e.message : "Unknown error");
      setRouteItems([]);
    } finally {
      setRouteLoading(false);
    }
  }, [passport, geo, limit]);

  // Auto-fetch when passport changes (after geo is resolved)
  useEffect(() => {
    if (!geoLoading) {
      fetchRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passport, geoLoading]);

  function handleReorder(newItems: PathType[]) {
    setRouteItems(newItems);
    setSelectedIndex(undefined);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">✈️</span>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 leading-tight">
              Travel Route Planner
            </h1>
            <p className="text-xs text-zinc-500">
              Discover visa-friendly destinations sorted by accessibility
            </p>
          </div>
          {geo && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5">
              <span>📍</span>
              <span>
                {geo.city}, {geo.country}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Passport selector & controls */}
        <section className="mb-8">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">
              Your Passport
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <PassportSelector
                value={passport}
                onChange={(code) => setPassport(code)}
                disabled={routeLoading}
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-600 whitespace-nowrap">
                  Destinations:
                </label>
                <Selector
                  options={limitOptions}
                  onChange={setLimit}
                  value={limit}
                  disabled={routeLoading}
                  placeholder="Select limit…"
                />

                <button
                  onClick={fetchRoute}
                  disabled={routeLoading || geoLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {routeLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Loading…
                    </>
                  ) : (
                    "Build Route"
                  )}
                </button>
              </div>
            </div>

            {geoLoading && (
              <p className="mt-3 text-xs text-zinc-400 flex items-center gap-1.5">
                <svg
                  className="animate-spin w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Detecting your location…
              </p>
            )}
          </div>
        </section>

        {/* Route error */}
        {routeError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            ⚠ Failed to build route: {routeError}
          </div>
        )}

        {/* Main content grid */}
        {routeItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Route list */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                  Suggested Route
                </h2>
                <div className="flex items-center gap-3">
                  {routeMeta && (
                    <span className="text-xs text-zinc-400">
                      {routeMeta.total} destinations · passport{" "}
                      <span className="font-mono font-semibold text-zinc-600">
                        {routeMeta.passport}
                      </span>
                    </span>
                  )}
                  <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded-lg">
                    Drag to reorder
                  </span>
                </div>
              </div>

              {routeLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-white border border-zinc-100 rounded-xl animate-pulse"
                      style={{ opacity: 1 - i * 0.08 }}
                    />
                  ))}
                </div>
              ) : (
                <RouteList
                  items={routeItems}
                  selectedIndex={selectedIndex}
                  onSelect={(idx) =>
                    setSelectedIndex((prev) => (prev === idx ? undefined : idx))
                  }
                  onReorder={handleReorder}
                />
              )}
            </section>

            {/* Pathfinding panel */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
                  Directions
                </h2>
              </div>
              <PathfindingPanel
                items={routeItems}
                selectedIndex={selectedIndex}
                userLat={geo?.lat}
                userLon={geo?.lon}
              />

              {/* Legend */}
              <div className="mt-4 p-4 bg-white border border-zinc-200 rounded-xl">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  Visa Status Legend
                </h3>
                <div className="flex flex-col gap-1.5">
                  {[
                    {
                      label: "Visa Free",
                      className: "bg-emerald-100 text-emerald-700",
                    },
                    {
                      label: "On Arrival",
                      className: "bg-sky-100 text-sky-700",
                    },
                    {
                      label: "e-Visa",
                      className: "bg-violet-100 text-violet-700",
                    },
                    {
                      label: "Visa Required",
                      className: "bg-amber-100 text-amber-700",
                    },
                    { label: "No Entry", className: "bg-red-100 text-red-700" },
                  ].map(({ label, className }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Empty state */}
        {!routeLoading && routeItems.length === 0 && !routeError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🗺</span>
            <h2 className="text-xl font-semibold text-zinc-700 mb-2">
              Ready to explore?
            </h2>
            <p className="text-zinc-400 max-w-sm">
              Select your passport and click &ldquo;Build Route&rdquo; to get
              personalized travel suggestions based on visa accessibility.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
