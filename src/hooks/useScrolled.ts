import { useEffect, useState, type RefObject } from "react";

/** True once the page is scrolled past the sentinel element (an 8 px strip at the top of the page). */
export function useScrolled(sentinel: RefObject<Element | null>): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setScrolled(!entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [sentinel]);

  return scrolled;
}
