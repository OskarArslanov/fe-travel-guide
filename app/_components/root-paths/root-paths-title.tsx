import { usePathStore } from "@/store/path.store";

export const RootPathsTitle = () => {
  const path = usePathStore().path;

  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
        Suggested Route
      </h2>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-400">
          {path?.total || 0} destinations · passport{" "}
          <span className="font-mono font-semibold text-zinc-600">
            {path?.passport || "N/A"}
          </span>
        </span>
        <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded-lg">
          Drag to reorder
        </span>
      </div>
    </div>
  );
};
