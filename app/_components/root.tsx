"use client";

import { RootHeader } from "./root-header";
import { RootInit } from "./root-init";
import { RootPassport } from "./root-passport/root-passport";
import { RootPaths } from "./root-paths/root-paths";
import { useGeoStore } from "@/store/geo.store";
import { usePathStore } from "@/store/path.store";

export const Root = () => {
  const geoLoading = useGeoStore().isLoading;
  const { path, error } = usePathStore();


  return (
    <div className="min-h-screen bg-zinc-50">
      <RootHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <RootPassport />
        <RootPaths />
        {!geoLoading && path?.suggestions.length === 0 && !error && (
          <RootInit />
        )}
      </main>
    </div>
  );
};
