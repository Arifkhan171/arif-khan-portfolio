import { content } from "@/data/content";
import { getFeaturedProjects } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/sections/ProjectCard";

export function FeaturedProjects() {
  const [lead, ...rest] = getFeaturedProjects(content.projects);
  const label = content.navigation.find((item) => item.id === "projects")?.label ?? "Projects";

  return (
    <Section id="projects" eyebrow="Featured work" title={label}>
      <div className="grid gap-6">
        {lead && <ProjectCard project={lead} variant="lead" />}
        {rest.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
