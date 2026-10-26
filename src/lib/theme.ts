// Theme store: the one place that reads, applies and saves the theme.
// The inline script in index.html does the first paint; keep its key and colors in sync with this file.
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme"; // keep in sync with index.html
const THEME_COLOR: Record<Theme, string> = { light: "#f9fafb", dark: "#0b0c10" }; // = `background` token
const TRANSITION_MS = 200;

const listeners = new Set<() => void>();
let transitionTimer: number | undefined;

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Current theme, read from the `dark` class on <html> (already set before first paint). */
export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme, animate: boolean) {
  if (theme === getTheme()) return;
  const root = document.documentElement;
  if (animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-transition");
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(
      () => root.classList.remove("theme-transition"),
      TRANSITION_MS,
    );
  }
  root.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  listeners.forEach((listener) => listener());
}

/** Apply a theme chosen by the visitor and remember it. */
export function setTheme(theme: Theme, options: { animate?: boolean } = {}) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice just is not remembered.
  }
  applyTheme(theme, options.animate ?? true);
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    // Only follow the system while the visitor has not chosen a theme.
    if (getStoredTheme() === null) applyTheme(getSystemTheme(), true);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) applyTheme(getStoredTheme() ?? getSystemTheme(), true);
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}
