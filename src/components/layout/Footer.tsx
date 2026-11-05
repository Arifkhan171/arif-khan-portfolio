import { content } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { InlineSep } from "@/components/ui/InlineSep";
import { ArrowUpIcon } from "@/components/ui/icons";

export function Footer() {
  const { profile } = content;

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col items-center py-3 text-center text-small text-muted md:flex-row md:justify-center md:gap-3">
        <p>
          © {new Date().getFullYear()} {profile.name}
          <InlineSep />
          Built with React + Vite
        </p>
        <span aria-hidden="true" className="max-md:hidden">
          ·
        </span>
        <a
          href="#top"
          className="inline-flex h-11 items-center gap-1.5 transition-colors hover:text-foreground"
        >
          Back to top
          <ArrowUpIcon size={16} />
        </a>
      </Container>
    </footer>
  );
}
