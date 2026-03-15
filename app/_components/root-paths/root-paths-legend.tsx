import { VisaStatus } from "@/app/api/visa/visa-types";

export const visaBadge: Record<
  VisaStatus,
  { label: string; className: string }
> = {
  [VisaStatus.VISA_FREE]: {
    label: "Visa Free",
    className: "bg-emerald-100 text-emerald-700",
  },
  [VisaStatus.VISA_ON_ARRIVAL]: {
    label: "On Arrival",
    className: "bg-sky-100 text-sky-700",
  },
  [VisaStatus.E_VISA]: {
    label: "e-Visa",
    className: "bg-violet-100 text-violet-700",
  },
  [VisaStatus.VISA_REQUIRED]: {
    label: "Visa Required",
    className: "bg-amber-100 text-amber-700",
  },
  [VisaStatus.NO_ADMISSION]: {
    label: "No Entry",
    className: "bg-red-100 text-red-700",
  },
};

export const RootPathsLegend = () => {
  return (
    <div className="mt-4 p-4 bg-white border border-zinc-200 rounded-xl">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
        Visa Status Legend
      </h3>
      <ul className="flex flex-col gap-1.5">
        {Object.values(visaBadge).map(({ label, className }) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
