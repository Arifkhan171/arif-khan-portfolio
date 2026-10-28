import { useEffect, useRef } from "react";
import { content } from "@/data/content";
import { getNavType } from "@/lib/router";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";

export function NotFound() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = `Project not found — ${content.profile.name}`;
    if (getNavType() !== "load") headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <Container className="py-section">
      <h1 ref={headingRef} tabIndex={-1} className="text-h1 focus:outline-none">
        Project not found
      </h1>
      <p className="mt-4 max-w-prose text-lead text-muted">
        This project does not exist or has no case study page.
      </p>
      <a
        href="/#projects"
        className="mt-6 inline-flex h-11 items-center gap-1.5 text-small font-medium text-accent underline-offset-4 hover:underline"
      >
        <ArrowRightIcon size={16} className="rotate-180" />
        Back to projects
      </a>
    </Container>
  );
}
