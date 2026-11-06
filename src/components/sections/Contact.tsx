import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { content } from "@/data/content";
import { cn } from "@/lib/cn";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { Section } from "@/components/ui/Section";
import { CheckIcon, CopyIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

type CopyState = "idle" | "copied" | "failed";

const iconFade = "[grid-area:1/1] transition-opacity duration-150 motion-reduce:transition-none";
const linkRow =
  "inline-flex h-11 items-center gap-2 text-small font-medium text-muted transition-colors hover:text-foreground";

export function Contact() {
  const { profile, navigation } = content;
  const { cv } = profile.links;
  const { fadeUp } = useMotionPresets();
  const label = navigation.find((item) => item.id === "contact")?.label ?? "Contact";
  const [copy, setCopy] = useState<CopyState>("idle");
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyEmail() {
    clearTimeout(timer.current);
    // Reset first so a repeated result changes the live region again and is announced again.
    setCopy("idle");
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopy("copied");
      timer.current = window.setTimeout(() => setCopy("idle"), 2000);
    } catch {
      // No clipboard API (insecure context) or no permission: the address stays selectable.
      setCopy("failed");
    }
  }

  return (
    <Section id="contact" eyebrow={label} title={profile.contactHeading} className="pb-section">
      <m.div variants={fadeUp} {...revealOnScroll}>
        <p className="max-w-prose text-lead">{profile.contactMessage}</p>
        <div className="mt-8 flex items-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="min-w-0 font-mono text-lg font-medium break-all text-foreground underline decoration-border decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent md:text-2xl"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address"
            className="inline-grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
          >
            <CopyIcon size={18} className={cn(iconFade, copy === "copied" && "opacity-0")} />
            <CheckIcon size={18} className={cn(iconFade, copy !== "copied" && "opacity-0")} />
          </button>
        </div>
        <p role="status" className="mt-2 min-h-[1.05rem] text-caption text-muted">
          {copy === "copied" && <span className="sr-only">Email address copied</span>}
          {copy === "failed" && "Copy failed. Select the address above."}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-6">
          <li>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkRow}
            >
              <LinkedInIcon size={18} />
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkRow}
            >
              <GitHubIcon size={18} />
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={cv.href} download={cv.fileName} className={linkRow}>
              <DownloadIcon size={18} />
              Download CV
            </a>
          </li>
        </ul>
      </m.div>
    </Section>
  );
}
