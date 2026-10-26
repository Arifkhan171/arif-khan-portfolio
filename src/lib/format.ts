import type { Period, YearMonth } from "../types/content.ts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "2025-02" -> "Feb 2025", "present" -> "Present". */
export function formatYearMonth(value: YearMonth | "present"): string {
  if (value === "present") return "Present";
  const [year, month] = value.split("-");
  const name = MONTHS[Number(month) - 1];
  if (name === undefined) throw new Error(`Invalid month in date: ${value}`);
  return `${name} ${year}`;
}

/** { start: "2025-02", end: "present" } -> "Feb 2025 – Present" (en dash). */
export function formatPeriod(period: Period): string {
  return `${formatYearMonth(period.start)} – ${formatYearMonth(period.end)}`;
}
