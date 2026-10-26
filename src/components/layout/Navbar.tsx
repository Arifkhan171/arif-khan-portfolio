import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { content } from "@/data/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileMenu, MobileOverlay } from "./MobileMenu";

const DESKTOP_QUERY = "(min-width: 768px)";

export function Navbar({ scrolled }: { scrolled: boolean }) {
  const { profile, navigation } = content;
  const { cv } = profile.links;
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(navigation.map((item) => item.id));

  // Close before the browser runs the anchor scroll, so the page is unlocked when it starts.
  const closeNow = useCallback(() => flushSync(() => setOpen(false)), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && !headerRef.current?.contains(next)) setOpen(false);
    };
    const media = window.matchMedia(DESKTOP_QUERY);
    const onMedia = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    const header = headerRef.current;
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    header?.addEventListener("focusout", onFocusOut);
    media.addEventListener("change", onMedia);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      header?.removeEventListener("focusout", onFocusOut);
      media.removeEventListener("change", onMedia);
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 h-header border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled || open
            ? "border-border bg-background/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Main" className="h-full">
          <Container className="flex h-full items-center justify-between gap-4">
            <a
              href="#top"
              onClick={closeNow}
              className="inline-flex h-11 items-center rounded-md text-small font-semibold"
            >
              {profile.name}
            </a>

            <div className="flex items-center gap-2">
              <ul className="mr-2 hidden items-center gap-1 md:flex">
                {navigation.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "inline-flex h-9 items-center rounded-md px-3 text-small text-muted transition-colors hover:bg-surface-muted hover:text-foreground",
                          isActive &&
                            "text-accent underline decoration-2 underline-offset-8 hover:text-accent",
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <ThemeToggle />

              <Button size="sm" href={cv.href} download={cv.fileName} className="max-md:hidden">
                <DownloadIcon size={16} />
                Download CV
              </Button>

              <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted md:hidden"
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </Container>

          <MobileMenu open={open} panelRef={panelRef} active={active} onNavigate={closeNow} />
        </nav>
      </header>
      <MobileOverlay open={open} />
    </>
  );
}
