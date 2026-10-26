/**
 * Joins class names, skipping falsy values.
 * `className` props are for layout additions (margin, width, grid placement),
 * not for overriding a variant's colors. Use a variant for that.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
