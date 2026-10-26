import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Temporary design preview. Checks the design system by eye; Spec 05 replaces it.
export default function App() {
  const { profile, projects } = content;
  const { fadeUp, staggerItem } = useMotionPresets();
  const project = projects.find((p) => p.tier === "featured");

  return (
    <main>
      <Container className="pt-6">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </Container>

      <Container className="py-section">
        <m.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="text-display">{profile.name}</h1>
          <p className="mt-3 text-h3 text-muted">{profile.title}</p>
          <p className="mt-6 max-w-prose text-body">{profile.tagline}</p>
        </m.div>

        <m.dl
          className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4"
          variants={stagger}
          {...revealOnScroll}
        >
          {profile.stats.map((stat) => (
            <m.div key={stat.label} variants={staggerItem}>
              <dt className="font-mono text-h2 tabular-nums">{stat.value}</dt>
              <dd className="mt-1 text-small text-muted">{stat.label}</dd>
            </m.div>
          ))}
        </m.dl>
      </Container>

      <Section id="preview-buttons" eyebrow="Design preview" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" href={profile.links.github}>
            External link
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Primary small</Button>
          <Button size="sm" variant="secondary">
            Secondary small
          </Button>
          <Button size="sm" variant="ghost">
            Ghost small
          </Button>
        </div>
      </Section>

      {project && (
        <Section id="preview-card" title="Card">
          <Card interactive as="article" className="max-w-xl">
            <h3 className="text-h3">{project.title}</h3>
            <p className="mt-2 text-small text-muted">{project.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.slice(0, 5).map((name) => (
                <Badge key={name}>{name}</Badge>
              ))}
            </div>
            {project.metrics[0] && (
              <p className="mt-4 inline-flex items-baseline gap-2 rounded-sm bg-accent-soft px-2.5 py-1 font-mono text-caption tabular-nums text-accent">
                {project.metrics[0].value}
                <span className="font-sans">{project.metrics[0].label}</span>
              </p>
            )}
          </Card>
          <p className="mt-10 text-caption text-muted">Caption text sample</p>
          <p className="text-small text-muted">Small text sample</p>
          <p className="font-mono text-caption tracking-[0.08em] text-accent uppercase">
            Eyebrow sample
          </p>
        </Section>
      )}
    </main>
  );
}
