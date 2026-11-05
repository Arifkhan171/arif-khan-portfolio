import { useEffect, useRef } from "react";
import { content } from "@/data/content";
import { notFoundMeta } from "@/lib/meta";
import { setPageMeta } from "@/lib/pageMeta";
import { getNavType } from "@/lib/router";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";

const text = {
  page: {
    what: "Page",
    title: "Page not found",
    body: "This page does not exist.",
    href: "/",
    link: "Back to home",
  },
  project: {
    what: "Project",
    title: "Project not found",
    body: "This project does not exist or has no case study page.",
    href: "/#projects",
    link: "Back to projects",
  },
} as const;

/** 404 view for an unknown path (`page`) or an unknown project id (`project`). */
export function NotFound({ variant }: { variant: keyof typeof text }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const t = text[variant];

  useEffect(() => {
    setPageMeta(notFoundMeta(content, t.what, location.pathname), true);
    if (getNavType() !== "load") headingRef.current?.focus({ preventScroll: true });
  }, [t.what]);

  return (
    <Container className="py-section">
      <h1 ref={headingRef} tabIndex={-1} className="text-h1 focus:outline-none">
        {t.title}
      </h1>
      <p className="mt-4 max-w-prose text-lead text-muted">{t.body}</p>
      <a
        href={t.href}
        className="mt-6 inline-flex h-11 items-center gap-1.5 text-small font-medium text-accent underline-offset-4 hover:underline"
      >
        <ArrowRightIcon size={16} className="rotate-180" />
        {t.link}
      </a>
    </Container>
  );
}
