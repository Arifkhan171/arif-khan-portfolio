import { useEffect } from "react";
import { content } from "@/data/content";
import { setPageMeta } from "@/lib/pageMeta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Friendly error page (render error or a chunk that cannot load). No animation, so it is always visible. */
export function ErrorScreen() {
  useEffect(() => {
    setPageMeta(
      {
        title: `Something went wrong — ${content.profile.name}`,
        description: content.site.description,
        path: location.pathname,
      },
      true,
    );
  }, []);

  return (
    <Container className="py-section">
      <h1 className="text-h1">Something went wrong</h1>
      <p className="mt-4 max-w-prose text-lead text-muted">
        This page could not be loaded. Reloading usually fixes it.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1">
        <Button onClick={() => location.reload()}>Reload</Button>
        <a
          href="/"
          className="inline-flex h-11 items-center gap-1.5 text-small font-medium text-accent underline-offset-4 hover:underline"
        >
          <ArrowRightIcon size={16} className="rotate-180" />
          Back to home
        </a>
      </div>
    </Container>
  );
}
