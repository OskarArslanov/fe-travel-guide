"use client";

import { usePathStore } from "@/store/path.store";

export const RootPathsTitle = () => {
  const path = usePathStore().path;

  return (
    <div className="flex items-center justify-between mb-3 ">
      <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
        Suggested Route
      </h2>
      <span className="text-xs text-zinc-400">
        {path?.total || 0} destinations · passport{" "}
        <span className="font-mono font-semibold text-zinc-600">
          {path?.passport || "N/A"}
        </span>
      </span>
    </div>
  );
};
