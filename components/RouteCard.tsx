"use client";

import { PathType } from "@/app/api/path/path-types";
import { VisaStatus } from "@/app/api/visa/visa-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface RouteCardProps {
  item: PathType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const VISA_BADGE: Record<
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

function getFlagEmoji(code: string): string {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function RouteCard({
  item,
  index,
  isSelected,
  onSelect,
}: RouteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.countryCode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const badge = VISA_BADGE[item.visaStatus];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? "border-blue-400 bg-blue-50 shadow-md"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      } ${isDragging ? "shadow-lg z-50" : ""}`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 p-1 rounded text-zinc-300 hover:text-zinc-500 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 5a1 1 0 00-1 1v1a1 1 0 002 0V8a1 1 0 00-1-1zm0 5a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm6-10a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 5a1 1 0 00-1 1v1a1 1 0 002 0V8a1 1 0 00-1-1zm0 5a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" />
        </svg>
      </button>

      {/* Index */}
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
        {index + 1}
      </span>

      {/* Flag */}
      <span className="text-2xl flex-shrink-0">{getFlagEmoji(item.countryCode)}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-zinc-800 truncate">
            {item.countryName}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-400">
          <span>✈ {item.distanceFromPrevKm.toLocaleString()} km</span>
          {item.allowedDays && <span>🗓 {item.allowedDays}d stay</span>}
          <span className="font-mono">score {item.score}</span>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <span className="flex-shrink-0 text-blue-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
}
