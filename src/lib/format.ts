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

/** "Arif Khan" -> "AK": first letter of the first two words, upper case. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** "multi-agent" never splits at the hyphen: hyphens become non-breaking hyphens (U+2011). Content stays unchanged. */
export function keepHyphensTogether(text: string): string {
  return text.replaceAll("-", "\u2011");
}

/** "0.75 → 0.85" never splits: the spaces around the arrow become non-breaking. Content stays unchanged. */
export function keepArrowsTogether(text: string): string {
  return text.replaceAll(" → ", "\u00A0→\u00A0");
}
