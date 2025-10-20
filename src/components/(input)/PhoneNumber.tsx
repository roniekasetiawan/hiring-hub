"use client";

import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";

type Country = {
  code: string;
  name: string;
  dial: string;
  flag: string;
};

const MOCK_COUNTRIES: Country[] = [
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
  { code: "PS", name: "Palestine", dial: "+970", flag: "🇵🇸" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
  { code: "PR", name: "Puerto Rico", dial: "+1", flag: "🇵🇷" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
];

type Props = {
  label?: string;
  required?: boolean;
  value?: { country: Country; national: string } | null;
  onChange?: (v: { country: Country; national: string }) => void;
  placeholder?: string;
  className?: string;
};

export default function PhoneNumberInput({
  label = "Phone number",
  required,
  value,
  onChange,
  placeholder = "81XXXXXXXXX",
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const defaultCountry =
    MOCK_COUNTRIES.find((c) => c.code === "ID") ?? MOCK_COUNTRIES[0];
  const [country, setCountry] = React.useState<Country>(
    value?.country ?? defaultCountry,
  );
  const [national, setNational] = React.useState<string>(value?.national ?? "");

  React.useEffect(() => {
    onChange?.({ country, national });
  }, [country, national]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return MOCK_COUNTRIES;
    const q = query.toLowerCase();
    return MOCK_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [query]);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  React.useEffect(() => setActiveIndex(0), [query, open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[activeIndex];
      if (c) {
        setCountry(c);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={className} ref={containerRef} onKeyDown={handleKeyDown}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required ? " *" : ""}
      </label>

      <div className="flex focus-within:ring-1 focus-within:ring-green-800 items-center gap-2 rounded-lg border border-neutral-300  px-2 py-1 hover:border-neutral-400 ">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-xl leading-none">{country.flag}</span>
          <span className="text-neutral-500">▾</span>
        </button>

        <span className="h-6 w-px bg-neutral-300" />

        <span className="text-neutral-700 select-none">{country.dial}</span>

        <input
          type="tel"
          inputMode="numeric"
          placeholder="81XXXXXXXXXX"
          value={national}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d\s]/g, "");
            setNational(raw);
          }}
          className="flex-1 bg-transparent outline-none px-2 py-2
               text-neutral-900 placeholder:text-neutral-400"
        />
      </div>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-[420px] rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="p-3">
            <div className="flex items-center rounded-xl border border-neutral-200 px-3 py-2 focus-within:ring-2 focus-within:ring-amber-500">
              <SearchIcon sx={{ color: "black" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-2 text-black bg-transparent outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <ul className="max-h-72 overflow-auto py-1">
            {filtered.map((c, idx) => {
              const isActive = idx === activeIndex;
              const isSelected = c.code === country.code;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      setCountry(c);
                      setOpen(false);
                    }}
                    className={[
                      "w-full flex items-center justify-between px-4 py-2 text-left",
                      isActive ? "bg-neutral-100" : "",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl leading-none">{c.flag}</span>
                      <span className="text-sm text-neutral-900">{c.name}</span>
                    </span>
                    <span className="text-sm text-neutral-600">{c.dial}</span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-6 text-sm text-neutral-500">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
