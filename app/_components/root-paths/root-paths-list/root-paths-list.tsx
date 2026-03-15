"use client";

import { usePathStore } from "@/store/path.store";
import { RootPathsCard } from "./root-paths-card";

export const RootPathsList = () => {
  const { path, isLoading } = usePathStore();
  const suggestions = path?.suggestions || [];

  if (isLoading) return <RootPathsListSkeleton />;

  return (
    <div className="flex flex-col gap-2">
      {suggestions.map((item, idx) => (
        <RootPathsCard key={item.countryCode} item={item} index={idx} />
      ))}
    </div>
  );
};

const RootPathsListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-white border border-zinc-100 rounded-xl animate-pulse"
          style={{ opacity: 1 - i * 0.08 }}
        />
      ))}
    </div>
  );
};
