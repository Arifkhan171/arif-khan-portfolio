import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/ui/icons";

type CopyState = "idle" | "copied" | "failed";

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
    <Section id="contact" eyebrow="Get in touch" title={label}>
      <m.div variants={fadeUp} {...revealOnScroll}>
        <Card className="grid gap-8 md:p-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-x-12">
          <div>
            <h3 className="text-h3">Let's work together</h3>
            <p className="mt-3 max-w-prose text-lead">{profile.contactMessage}</p>
            <ul className="mt-6 space-y-2 text-small text-muted">
              <li className="flex items-center gap-2">
                <MapPinIcon size={16} className="shrink-0" />
                {profile.location}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="mx-1 size-2 shrink-0 rounded-full bg-accent" />
                {profile.availability}
              </li>
            </ul>
          </div>
          <div>
            <p className="text-caption text-muted">Email</p>
            <p className="mt-1 font-mono text-body font-medium">{profile.email}</p>
            <div className="mt-4 grid gap-3 min-[360px]:grid-cols-2">
              <Button href={`mailto:${profile.email}`} className="min-[360px]:max-sm:col-span-2">
                <MailIcon size={16} />
                Email me
              </Button>
              <Button
                variant="secondary"
                onClick={copyEmail}
                className="min-[360px]:max-sm:col-span-2"
              >
                {copy === "copied" ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                {copy === "copied" ? "Copied" : "Copy email"}
              </Button>
              <Button variant="secondary" href={profile.links.linkedin}>
                <LinkedInIcon size={16} />
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
              <Button variant="secondary" href={profile.links.github}>
                <GitHubIcon size={16} />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
              <Button
                variant="secondary"
                href={cv.href}
                download={cv.fileName}
                className="min-[360px]:col-span-2"
              >
                <DownloadIcon size={16} />
                Download CV
              </Button>
            </div>
            <p role="status" className="mt-3 text-caption text-muted">
              {copy === "copied" && <span className="sr-only">Email address copied</span>}
              {copy === "failed" && "Copy failed. Select the address above."}
            </p>
          </div>
        </Card>
      </m.div>
    </Section>
  );
}
