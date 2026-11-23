import { content } from "@/data/content";
import { getFeaturedProjects } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { ProjectRow } from "@/components/sections/ProjectRow";

export function FeaturedProjects() {
  const projects = getFeaturedProjects(content.projects);
  const label = content.navigation.find((item) => item.id === "projects")?.label ?? "Projects";

  return (
    <Section id="projects" eyebrow="Featured work" title={label}>
      <div className="grid gap-y-16 lg:gap-y-24">
        {projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
