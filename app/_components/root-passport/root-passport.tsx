import { Selector } from "@/components/selector";
import { PASSPORT_LIST, PassportSelector } from "@/features/passport-selector";
import { useRootPassport } from "./use-root-passport";
import { IdValue } from "@/consts/props";
import { VisaStatus } from "@/app/api/visa/visa-types";

const SORT_BY_OPTIONS: IdValue[] = [
  { id: "score", value: "Score" },
  { id: "visa", value: "Visa" },
  { id: "distance", value: "Distance" },
] as const;

const TYPE_OPTIONS: IdValue[] = [
  { id: "all", value: "All" },
  { id: VisaStatus.VISA_FREE, value: "Visa Free" },
  { id: VisaStatus.VISA_ON_ARRIVAL, value: "On Arrival" },
  { id: VisaStatus.E_VISA, value: "e-Visa" },
  { id: VisaStatus.VISA_REQUIRED, value: "Visa Required" },
] as const;

const LIMIT_OPTIONS: IdValue[] = [
  { id: "5", value: 5 },
  { id: "10", value: 10 },
  { id: "15", value: 15 },
  { id: "20", value: 20 },
  { id: "30", value: 30 },
];

export const RootPassport = () => {
  const {
    geoLoading,
    handleSetLimit,
    handleSetPassport,
    passport,
    limit,
    handleSetIncludeNoDays,
    handleSetMinDays,
    handleSetSort,
    handleSetSortBy,
    handleSetType,
    includeNoDays,
    minDays,
    sort,
    sortBy,
    type,
  } = useRootPassport();

  return (
    <section className="mb-8">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">
          Find your best travel options
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="flex flex-col gap-3">
            <label className="text-sm text-zinc-600 whitespace-nowrap">
              Passport:
            </label>
            <PassportSelector
              value={PASSPORT_LIST.find((p) => p.id === passport)}
              onChange={(code) => handleSetPassport(code.id)}
              disabled={geoLoading}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm text-zinc-600 whitespace-nowrap">
              Destinations:
            </label>
            <Selector
              options={LIMIT_OPTIONS}
              onChange={(limit) => handleSetLimit(limit.id)}
              value={LIMIT_OPTIONS.find((o) => o.id === limit)}
              disabled={geoLoading}
              placeholder="Select limit…"
            />
          </div>
          {/* Visa type */}

          <div className="flex flex-col gap-3">
            <label className="text-sm text-zinc-600 whitespace-nowrap">
              Visa policy:
            </label>
            <Selector
              options={TYPE_OPTIONS}
              onChange={(type) => handleSetType(type.id)}
              value={TYPE_OPTIONS.find((o) => o.id === type)}
              disabled={geoLoading}
              placeholder="Select type…"
              triggerClassName="min-w-[120px]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm text-zinc-600 whitespace-nowrap">
              Sort by:
            </label>
            <Selector
              options={SORT_BY_OPTIONS}
              onChange={(sortBy) => handleSetSortBy(sortBy.id)}
              value={SORT_BY_OPTIONS.find((o) => o.id === sortBy)}
              disabled={geoLoading}
              placeholder="Select sort by…"
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort direction */}
            <button
              onClick={() => handleSetSort(sort === "desc" ? "asc" : "desc")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
              title={sort === "desc" ? "Descending" : "Ascending"}
            >
              {sort === "desc" ? "↓" : "↑"} {sort === "desc" ? "Desc" : "Asc"}
            </button>

            {/* Min days */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">Min days</span>
              <input
                type="number"
                min={0}
                value={minDays ?? ""}
                onChange={(e) => handleSetMinDays(e.target.value || undefined)}
                placeholder="any"
                className="w-16 px-2 py-1 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-600 focus:outline-none focus:border-zinc-400"
              />
            </div>

            {/* Include no-days */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNoDays}
                onChange={(e) => handleSetIncludeNoDays(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-zinc-700"
              />
              <span className="text-xs text-zinc-400">incl. unknown days</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};
