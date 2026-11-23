import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import type { ProjectImage } from "@/types/content";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/cn";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { CloseIcon } from "@/components/ui/icons";

/** Room for Close above the image, the caption below and the dialog padding. */
const panArea = "max-h-[calc(100dvh-9rem)] md:max-h-[calc(100dvh-8rem)]";

/**
 * Framed screenshots in 2 columns (1 on phones); with an odd count the first one spans both columns.
 * Clicking one opens it full size in a native modal <dialog> (focus stays inside, Escape closes,
 * focus returns to the clicked screenshot).
 */
export function Screenshots({ images, load }: { images: readonly ProjectImage[]; load: boolean }) {
  const { fadeUp } = useMotionPresets();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<ProjectImage | null>(null);
  const odd = images.length % 2 === 1;
  useScrollLock(open !== null);

  // Open after React has rendered the image. Focus Close by hand: on phones the browser would pick the
  // scrollable image area first (React's autoFocus runs before showModal).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  return (
    <>
      <ul className="mt-5 grid gap-x-6 gap-y-10 md:grid-cols-2">
        {images.map((image, i) => (
          <m.li
            key={image.src}
            variants={fadeUp}
            {...revealOnScroll}
            className={cn(odd && i === 0 && "md:col-span-2")}
          >
            <figure>
              <button
                type="button"
                onClick={() => setOpen(image)}
                aria-label={`Open full size: ${image.alt}`}
                className="group block w-full cursor-zoom-in rounded-image text-left"
              >
                <BrowserFrame className="group-hover:border-border-hover">
                  <img
                    src={load ? image.src : undefined}
                    alt=""
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.02]"
                  />
                </BrowserFrame>
              </button>
              <figcaption className="mt-3 text-small text-muted">{image.caption}</figcaption>
            </figure>
          </m.li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={open?.alt}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          // A click on the dark backdrop (the dialog or its padding, not the image or caption) closes it.
          if (event.target instanceof HTMLElement && event.target.dataset.dismiss !== undefined) {
            dialogRef.current?.close();
          }
        }}
        data-dismiss=""
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 text-foreground backdrop:bg-background/95"
      >
        {open && (
          <>
            {/* Fixed to the window corner, so it is on screen however the image is panned or the phone is turned. */}
            <button
              ref={closeRef}
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="fixed top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
            >
              <CloseIcon size={20} />
              <span className="sr-only">Close</span>
            </button>
            <div data-dismiss="" className="grid min-h-full place-items-center px-4 pt-16 pb-4">
              <figure>
                {/* Phones: a readable 896 px wide image that pans in both directions. From 768 px it fits the window. */}
                <div
                  tabIndex={0}
                  role="region"
                  aria-label="Full-size screenshot (scrollable)"
                  className={cn(
                    panArea,
                    "max-w-[calc(100vw-2rem)] overflow-auto rounded-image border border-border bg-surface-muted",
                  )}
                >
                  <img
                    src={open.src}
                    alt={open.alt}
                    width={open.width}
                    height={open.height}
                    className="block h-auto w-4xl max-w-none md:max-h-[calc(100dvh-8rem-2px)] md:w-auto md:max-w-[calc(100vw-2rem-2px)]"
                  />
                </div>
                <figcaption className="mt-3 w-0 min-w-full text-small text-muted">
                  {open.caption}
                  <span className="mt-0.5 block text-caption md:hidden">
                    Swipe to see the full screen
                  </span>
                </figcaption>
              </figure>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
