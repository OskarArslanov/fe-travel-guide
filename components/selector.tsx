"use client";

import { IdValue } from "@/consts/props";
import { cn } from "@/consts/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useState, useRef, FC, useMemo, ReactNode } from "react";

interface Props {
  value?: IdValue;
  options?: IdValue[];
  placeholder: string;
  onChange: (value: IdValue) => void;
  disabled?: boolean;
  wrapperClassName?: string;
  triggerClassName?: string;
  element?: (option: IdValue) => ReactNode;
}

export const Selector: FC<Props> = (props) => {
  const {
    value,
    onChange,
    disabled,
    placeholder,
    options,
    wrapperClassName,
    triggerClassName,
    element,
  } = props;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isString = typeof options?.[0]?.value === "string";

  const filtered = useMemo(() => {
    if (!options?.length) return [];
    if (!isString) return options;
    const optionsAsString = options.map((o) => ({
      ...o,
      value: String(o.value),
    }));
    return optionsAsString.filter((p) =>
      p.value.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, options, isString]);

  useClickOutside(ref, () => {
    setOpen(false);
    setQuery("");
  });

  const handleSelect = (option: IdValue) => {
    onChange(option);
    setOpen(false);
    setQuery("");
  };

  const displayValue = element ? element(value as IdValue) : value?.value;

  return (
    <div ref={ref} className={cn("relative max-w-sm", wrapperClassName)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
          triggerClassName,
        )}
      >
        {value ? (
          displayValue
        ) : (
          <span className="text-zinc-400">{placeholder}</span>
        )}
        <svg
          className={`ml-2 w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden">
          {isString && (
            <div className="p-2 border-b border-zinc-100">
              <input
                autoFocus
                type="text"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 rounded-lg outline-none placeholder-zinc-400"
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto divide-y divide-zinc-50">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(p)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors truncate ${
                    p.id === value?.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-zinc-800"
                  }`}
                >
                  {element ? element(p) : p.value}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-zinc-400 text-center">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
