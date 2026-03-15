import { useGeoStore } from "@/store/geo.store";
import { useEffect } from "react";

export const RootHeader = () => {
  const { geo, fetchGeo } = useGeoStore();

  useEffect(() => {
    fetchGeo();
  }, []);

  return (
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
  );
};
