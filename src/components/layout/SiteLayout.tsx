import { useRef, type ReactNode } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { SkipLink } from "./SkipLink";

/** Page frame: skip link, navbar, `<main id="main">`, footer. */
export function SiteLayout({ children }: { children: ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrolled = useScrolled(sentinelRef);

  return (
    <div className="relative">
      {/* 8 px strip at the very top: when it leaves the screen, the navbar gets its background. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
      />
      <SkipLink />
      <Navbar scrolled={scrolled} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
