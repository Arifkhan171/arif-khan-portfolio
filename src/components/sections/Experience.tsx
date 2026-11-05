import { content } from "@/data/content";
import { keepArrowsTogether } from "@/lib/format";
import { Section } from "@/components/ui/Section";
import { EntryCard } from "@/components/sections/EntryCard";
import { Timeline } from "@/components/sections/Timeline";

export function Experience() {
  const { experience, education, timeline, navigation } = content;
  const label = navigation.find((item) => item.id === "experience")?.label ?? "Experience";

  return (
    <Section id="experience" eyebrow="Work & education" title={label}>
      <div className="grid gap-6">
        {experience.map((job) => (
          <EntryCard
            key={`${job.organization}-${job.period.start}`}
            wide
            kicker="Work"
            title={job.role}
            meta={[job.organization, job.location, job.employmentType]}
            period={job.period}
            tagsLabel="Tech used"
            tags={job.tech}
          >
            <ul className="mt-5 max-w-prose list-disc space-y-2.5 pl-5 text-small marker:text-muted">
              {job.highlights.map((text) => (
                <li key={text}>{keepArrowsTogether(text)}</li>
              ))}
            </ul>
          </EntryCard>
        ))}
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((school) => (
            <EntryCard
              key={`${school.institution}-${school.period.start}`}
              kicker="Education"
              title={school.degree}
              meta={[school.institution]}
              period={school.period}
              note={school.grade}
              tagsLabel="Coursework"
              tags={school.coursework}
            />
          ))}
          {timeline.length > 0 && <Timeline items={timeline} title="Timeline" />}
        </div>
      </div>
    </Section>
  );
}
