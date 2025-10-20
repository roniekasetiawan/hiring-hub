"use client";

import * as React from "react";
import { PROVINCES } from "@/configs/province";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Province = (typeof PROVINCES)[number];

type Props = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: Province | null;
  onChange?: (p: Province | null) => void;
  className?: string;
};

export default function ProvinceAutocomplete({
  label = "Domicile",
  required,
  placeholder = "Choose your domicile",
  value,
  onChange,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  const [selected, setSelected] = React.useState<Province | null>(
    value ?? null,
  );
  React.useEffect(() => {
    if (value) setSelected(value);
  }, [value]);
  React.useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  const listRef = React.useRef<HTMLUListElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROVINCES;
    return PROVINCES.filter(
      (p) =>
        p.label.toLowerCase().includes(q) || p.value.toLowerCase().includes(q),
    );
  }, [query]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = filtered[active];
      if (pick) {
        setSelected(pick);
        setOpen(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={className} ref={rootRef} onKeyDown={onKeyDown}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required ? " *" : ""}
      </label>

      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          className={[
            "w-full rounded-xl border px-4 py-3 pr-12",
            "text-neutral-900 placeholder:text-black",
            "border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-800",
          ].join(" ")}
        />
        <button
          type="button"
          aria-label="Toggle"
          onClick={() => setOpen((o) => !o)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-neutral-500 hover:bg-neutral-100"
        >
          <KeyboardArrowDownIcon sx={{ color: "black" }} />
        </button>

        {open && (
          <div className="border-gray-500 absolute z-50 mt-2 w-full rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <ul
              ref={listRef}
              className="max-h-72 overflow-auto py-2"
              role="listbox"
            >
              {filtered.map((p, idx) => {
                const isSel = selected?.value === p.value;
                const isActive = idx === active;
                return (
                  <li key={p.value}>
                    <button
                      type="button"
                      data-index={idx}
                      role="option"
                      aria-selected={isSel}
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => {
                        setSelected(p);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={[
                        "w-full text-left px-4 py-2 rounded-lg",
                        "flex items-center justify-between",
                        isActive ? "bg-neutral-100" : "",
                      ].join(" ")}
                    >
                      <span className="text-[15px] text-black">{p.label}</span>
                      {isSel && (
                        <span className="text-sm text-teal-600">✓</span>
                      )}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-sm text-neutral-500">
                  No results
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
