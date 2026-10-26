import { useEffect, useState } from "react";

/** Height of the sticky navbar in px (same as `--spacing-header`, 4rem). */
const HEADER_PX = 64;

/**
 * Id of the section currently in view: the last id (in the given order) whose section touches the top
 * ~40 % of the screen under the navbar. `null` when none does (for example at the very top of the page).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key === "" ? [] : key.split(",");
    const inBand = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting);
        setActive(list.findLast((id) => inBand.get(id)) ?? null);
      },
      { rootMargin: `-${HEADER_PX}px 0px -60% 0px`, threshold: 0 },
    );
    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
