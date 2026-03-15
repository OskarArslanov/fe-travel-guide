import { RootPathsLegend } from "./root-paths-legend";
import { RootPathsList } from "./root-paths-list/root-paths-list";
import { RootPathsPanel } from "./root-paths-panel/root-paths-panel";
import { RootPathsTitle } from "./root-paths-title";

export const RootPaths = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <section>
        <RootPathsTitle />
        <RootPathsList />
      </section>

      <aside className="lg:sticky lg:top-24 self-start">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide">
            Directions
          </h2>
        </div>
        <RootPathsPanel />
        <RootPathsLegend />
      </aside>
    </div>
  );
};
