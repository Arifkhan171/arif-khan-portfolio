import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  /** Anchor id for navbar links. */
  id: string;
  eyebrow?: string;
  title?: string;
  className?: string;
  children?: ReactNode;
};

/** Page section with the standard vertical spacing and an optional eyebrow + title. */
export function Section({ id, eyebrow, title, className, children }: SectionProps) {
  const titleId = title ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={titleId} className={cn("py-section", className)}>
      <Container>
        {(eyebrow || title) && (
          <header className="mb-10">
            {eyebrow && (
              <p className="font-mono text-caption tracking-[0.08em] text-accent uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 id={titleId} className={cn("text-h2", eyebrow && "mt-2")}>
                {title}
              </h2>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
