"use client";

import React, { HTMLAttributes } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { id as idLocale } from "date-fns/locale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Props = {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  required?: boolean;
};

export default function DobPickerTight({ value, onChange, required }: Props) {
  const [open, setOpen] = React.useState(false);
  const initial = value ?? new Date(2001, 0, 1);
  const [month, setMonth] = React.useState<Date>(initial);

  const min = new Date(1900, 0, 1);
  const max = new Date();

  const prevMonth = () =>
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = () =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  const prevYear = () =>
    setMonth(new Date(month.getFullYear() - 1, month.getMonth(), 1));
  const nextYear = () =>
    setMonth(new Date(month.getFullYear() + 1, month.getMonth(), 1));

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">
        Date of birth{required ? " *" : ""}
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full relative flex items-center gap-2 rounded-xl border border-neutral-300  px-3 py-3 pr-11 text-left hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <CalendarMonthIcon sx={{ color: "black" }} />
        <span className={value ? "text-neutral-900" : "text-neutral-400"}>
          {value
            ? format(value, "d MMMM yyyy", { locale: idLocale })
            : "Select your date of birth"}
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <KeyboardArrowDownIcon sx={{ color: "black" }} />
        </span>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-[380px] rounded-2xl border border-neutral-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <div className="flex items-center gap-1">
              <HeaderBtn aria="Previous year" onClick={prevYear}>
                «
              </HeaderBtn>
              <HeaderBtn aria="Previous month" onClick={prevMonth}>
                ‹
              </HeaderBtn>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-sm font-semibold tracking-wide text-black">
                {format(month, "MMM")}
              </span>
              <span className="text-sm font-semibold text-black">
                {format(month, "yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <HeaderBtn aria="Next month" onClick={nextMonth}>
                ›
              </HeaderBtn>
              <HeaderBtn aria="Next year" onClick={nextYear}>
                »
              </HeaderBtn>
            </div>
          </div>

          <DayPicker
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={value ?? undefined}
            onSelect={(d) => {
              if (!d) return;
              onChange?.(d);
              setOpen(false);
            }}
            disabled={{ before: min, after: max }}
            weekStartsOn={0}
            showOutsideDays
            components={{
              CaptionLabel: (props: HTMLAttributes<HTMLSpanElement>) => (
                <span />
              ),
            }}
            hideNavigation
            className="pb-4 !text-neutral-800"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          />
        </div>
      )}
    </div>
  );
}

function HeaderBtn({
  children,
  onClick,
  aria,
}: {
  children: React.ReactNode;
  onClick: () => void;
  aria: string;
}) {
  return (
    <button
      type="button"
      aria-label={aria}
      onClick={onClick}
      className="h-8 w-8 rounded-full text-[16px] text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 focus:outline-none"
    >
      {children}
    </button>
  );
}
