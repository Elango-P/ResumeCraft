"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function parseValue(value: string) {
  const [year = "", month = ""] = (value || "").split("-");
  return { year, month };
}

function composeValue(year: string, month: string) {
  if (!year && !month) return "";
  if (year && month) return `${year}-${month}`;
  if (year) return `${year}-01`;
  return "";
}

export function MonthYearPicker({
  id,
  value,
  onChange,
  disabled,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { year, month } = parseValue(value);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 55 }, (_, index) => String(currentYear + 5 - index));

  return (
    <div id={id} className={cn("grid grid-cols-2 gap-2", className)}>
      <Select
        value={month || undefined}
        onValueChange={(nextMonth) => onChange(composeValue(year, nextMonth))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" aria-label="Month">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={year || undefined}
        onValueChange={(nextYear) => onChange(composeValue(nextYear, month))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" aria-label="Year">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
