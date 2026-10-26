import { content } from "@/data/content";
import { cn } from "@/lib/cn";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";

const iconLink =
  "inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground";

/** GitHub, LinkedIn and email icon links. Used in the hero and the footer. */
export function SocialLinks({ className }: { className?: string }) {
  const { profile } = content;

  return (
    <ul className={cn("flex items-center gap-1", className)}>
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
  );
}
