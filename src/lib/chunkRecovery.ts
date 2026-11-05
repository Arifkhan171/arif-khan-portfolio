const KEY = "portfolio-chunk-reload";
const GUARD_MS = 60_000;

/** Dynamic import that reloads the page once if loading fails (e.g. an old file name after a redeploy). */
export function withReload<T>(load: () => Promise<T>): () => Promise<T> {
  return () =>
    load().catch((error: unknown) => {
      try {
        const last = Number(sessionStorage.getItem(KEY)) || 0;
        // Reloaded less than a minute ago: show the error screen instead of looping.
        if (Date.now() - last < GUARD_MS) throw error;
        sessionStorage.setItem(KEY, String(Date.now()));
      } catch {
        throw error; // no storage means no loop guard, so no reload
      }
      location.reload();
      return new Promise<T>(() => {}); // the page is reloading
    });
}

/** Shown as a static page when the animation code cannot load: every block becomes visible. */
export function motionFailed(): void {
  document.documentElement.dataset.motion = "off";
}
