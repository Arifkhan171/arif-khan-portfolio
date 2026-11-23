import { useEffect, useState } from "react";

/** Height of the sticky navbar in px (same as `--spacing-header`, 4rem). */
const HEADER_PX = 64;

/**
 * Id of the section currently in view: the last id (in the given order) whose top has reached the top
 * ~40 % of the screen, or the last id when the page is scrolled to the very bottom. A section between
 * two nav sections (More projects) keeps the one above it active. `null` when none has (for example at
 * the very top of the page).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const list = key === "" ? [] : key.split(",");
    const update = () => {
      // At the very bottom the last section may be too short to reach the band: it is active anyway.
      const { scrollHeight } = document.documentElement;
      const atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= scrollHeight - 2;
      // Read the real positions: a fast jump can cross the band without any observer callback.
      const bandBottom = window.innerHeight * 0.4;
      const reached = (id: string) => {
        const el = document.getElementById(id);
        return el !== null && el.getBoundingClientRect().top < bandBottom;
      };
      setActive((atEnd ? list.at(-1) : list.findLast(reached)) ?? null);
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: `-${HEADER_PX}px 0px -60% 0px`,
      threshold: 0,
    });
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
