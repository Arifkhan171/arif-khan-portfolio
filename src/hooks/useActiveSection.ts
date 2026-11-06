import { useEffect, useState } from "react";

/** Height of the sticky navbar in px (same as `--spacing-header`, 4rem). */
const HEADER_PX = 64;

/**
 * Id of the section currently in view: the last id (in the given order) whose section touches the top
 * ~40 % of the screen under the navbar, or the last id when the page is scrolled to the very bottom.
 * `null` when none does (for example at the very top of the page).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key === "" ? [] : key.split(",");
    const inBand = new Map<string, boolean>();
    const update = () => {
      // At the very bottom the last section may be too short to reach the band: it is active anyway.
      const { scrollHeight } = document.documentElement;
      const atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= scrollHeight - 2;
      setActive((atEnd ? list.at(-1) : list.findLast((id) => inBand.get(id))) ?? null);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        // "Reached": in the band, or already scrolled above it. A section between two nav sections
        // (More projects) then keeps the one above it active.
        for (const entry of entries) {
          const bandTop = entry.rootBounds?.top ?? HEADER_PX;
          inBand.set(
            entry.target.id,
            entry.isIntersecting || entry.boundingClientRect.top < bandTop,
          );
        }
        update();
      },
      { rootMargin: `-${HEADER_PX}px 0px -60% 0px`, threshold: 0 },
    );
    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [key]);

  return active;
}
