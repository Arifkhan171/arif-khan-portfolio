/** First focusable element on the page. Invisible until focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={() => document.getElementById("main")?.focus({ preventScroll: true })}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-small focus:text-foreground focus:shadow-raised"
    >
      Skip to content
    </a>
  );
}
