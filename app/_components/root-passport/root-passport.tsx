import { Selector } from "@/components/selector";
import {
  PassportSelector,
  passportWithEmoji,
} from "@/features/passport-selector";
import { useRootPassport } from "./use-root-passport";
import { IdValue } from "@/consts/props";

const limitOptions: IdValue[] = [
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
  } = useRootPassport();

  return (
    <section className="mb-8">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">
          Your Passport
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <PassportSelector
            value={passportWithEmoji.find((p) => p.id === passport)}
            onChange={(code) => handleSetPassport(code.id)}
            disabled={geoLoading}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-600 whitespace-nowrap">
              Destinations:
            </label>
            <Selector
              options={limitOptions}
              onChange={(limit) => handleSetLimit(limit.id)}
              value={limitOptions.find((o) => o.id === limit)}
              disabled={geoLoading}
              placeholder="Select limit…"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
