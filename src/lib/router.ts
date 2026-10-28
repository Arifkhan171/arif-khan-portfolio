import { useSyncExternalStore } from "react";

export type Route = { page: "home" } | { page: "project"; id: string };
/** How the current page was reached: first load, a link click, or Back/Forward. */
export type NavType = "load" | "push" | "pop";
type EntryState = { scrollY?: number; from?: string } | null;

let navType: NavType = "load";
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

export const getNavType = (): NavType => navType;
export const savedScrollY = () => (history.state as EntryState)?.scrollY;
export const cameFrom = () => (history.state as EntryState)?.from;

/** "/projects/neuroai" is a project; "/projects" and "/projects/" are a project with id "" (not found). */
export function parseRoute(path: string): Route {
  const match = /^\/projects(?:\/([^/]*))?\/?$/.exec(path);
  if (!match) return { page: "home" };
  let id = match[1] ?? "";
  try {
    id = decodeURIComponent(id);
  } catch {
    // A malformed id simply shows "Project not found".
  }
  return { page: "project", id };
}

function navigate(href: string): void {
  // Remember where this page was scrolled, so Back can return there.
  history.replaceState({ ...(history.state as object), scrollY: window.scrollY }, "");
  history.pushState({ from: location.pathname }, "", href);
  navType = "push";
  notify();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => location.pathname);
}

/** Call once. Handles Back/Forward and every same-site link to another page. */
export function startRouter(preload: () => void): void {
  window.addEventListener("popstate", () => {
    navType = "pop";
    notify();
  });
  const appLink = (event: Event) => {
    const link = (event.target as Element).closest?.("a");
    if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download"))
      return;
    const url = new URL(link.href);
    const isApp = url.pathname === "/" || parseRoute(url.pathname).page === "project";
    return url.origin === location.origin && isApp ? url : undefined;
  };
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = appLink(event);
    // Same page (only the #hash differs): let the browser scroll.
    if (!url || url.pathname === location.pathname) return;
    event.preventDefault();
    navigate(url.pathname + url.hash);
  });
  const warm = (event: Event) => {
    if (appLink(event)?.pathname.startsWith("/projects")) preload();
  };
  document.addEventListener("pointerover", warm);
  document.addEventListener("focusin", warm);
}
