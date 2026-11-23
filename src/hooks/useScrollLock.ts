import { useEffect } from "react";

/**
 * Stops the page behind from scrolling while `locked` is true. The scrollbar gutter stays reserved,
 * so the page does not shift sideways when the scrollbar would disappear.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "stable";
    return () => {
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
    };
  }, [locked]);
}
