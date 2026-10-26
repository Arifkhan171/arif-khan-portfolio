import { content } from "@/data/content";
import { Container } from "@/components/ui/Container";
import {
  ArrowUpIcon,
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/icons";

const iconLink =
  "inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground";
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

        <ul className="-mx-3 flex items-center gap-1 md:mx-0">
          <li>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="GitHub profile"
              className={iconLink}
            >
              <GitHubIcon />
            </a>
          </li>
          <li>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              title="LinkedIn profile"
              className={iconLink}
            >
              <LinkedInIcon />
            </a>
          </li>
          <li>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Send an email"
              title="Send an email"
              className={iconLink}
            >
              <MailIcon />
            </a>
          </li>
        </ul>

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
