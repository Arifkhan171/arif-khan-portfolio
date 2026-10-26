import { content } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ArrowUpIcon, DownloadIcon } from "@/components/ui/icons";

const textLink = "inline-flex h-11 items-center gap-2 transition-colors hover:text-foreground";

export function Footer() {
  const { profile } = content;
  const { cv } = profile.links;

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-6 py-10 text-small text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">{profile.name}</p>
          <p>{profile.availability}</p>
        </div>

        <SocialLinks className="-mx-3 md:mx-0" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <a href={cv.href} download={cv.fileName} className={textLink}>
            <DownloadIcon size={16} />
            Download CV
          </a>
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <a href="#top" className={textLink}>
            <ArrowUpIcon size={16} />
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}
