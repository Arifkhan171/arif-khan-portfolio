import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, m, useIsPresent } from "motion/react";
import { content } from "@/data/content";
import { useScrollLock } from "@/hooks/useScrollLock";
import { duration, easeOut, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DownloadIcon } from "@/components/ui/icons";

type MobileMenuProps = {
  open: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  active: string | null;
  onNavigate: () => void;
};

/** Panel under the navbar (below 768 px). Lives inside the header. */
export function MobileMenu({ open, panelRef, active, onNavigate }: MobileMenuProps) {
  useScrollLock(open);

  return (
    <div id="mobile-menu" className="md:hidden">
      <AnimatePresence>
        {open && <Panel panelRef={panelRef} active={active} onNavigate={onNavigate} />}
      </AnimatePresence>
    </div>
  );
}

function Panel({ panelRef, active, onNavigate }: Omit<MobileMenuProps, "open">) {
  const { navigation, profile } = content;
  const { cv } = profile.links;
  const { dropDown } = useMotionPresets();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  // While the panel fades out, its links cannot be tabbed to or tapped.
  const isPresent = useIsPresent();

  useEffect(() => {
    firstLinkRef.current?.focus();
  }, []);

  return (
    <m.div
      ref={panelRef}
      inert={!isPresent}
      className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--spacing-header))] overflow-y-auto overscroll-contain border-b border-border bg-background shadow-raised"
      variants={dropDown}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Container className="py-4">
        <ul>
          {navigation.map((item, index) => (
            <li key={item.id}>
              <a
                ref={index === 0 ? firstLinkRef : undefined}
                href={`/#${item.id}`}
                onClick={onNavigate}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "flex h-12 items-center rounded-md px-3 text-body text-foreground transition-colors hover:bg-surface-muted",
                  active === item.id && "text-accent",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Button href={cv.href} download={cv.fileName} className="mt-3 w-full">
          <DownloadIcon size={16} />
          Download CV
        </Button>
      </Container>
    </m.div>
  );
}

/**
 * Dimmed layer behind the panel. Rendered by the Navbar as a sibling of `<header>`: the header's
 * backdrop-filter would make it the containing block of a `fixed` child (only 64 px tall).
 */
export function MobileOverlay({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <m.div
          aria-hidden="true"
          className="fixed inset-x-0 top-header bottom-0 z-30 bg-background/60 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easeOut }}
        />
      )}
    </AnimatePresence>
  );
}
