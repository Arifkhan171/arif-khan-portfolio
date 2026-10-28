import { content } from "@/data/content";
import { getFeaturedProjects } from "@/lib/projects";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { NotFound } from "@/components/case-study/NotFound";

const featured = getFeaturedProjects(content.projects);

/** Lazy-loaded page for `/projects/<id>`. */
export default function CaseStudyPage({ id }: { id: string }) {
  const index = featured.findIndex((project) => project.id === id);
  const project = featured[index];
  if (!project) return <NotFound />;
  const next = featured.length > 1 ? featured[(index + 1) % featured.length] : undefined;
  return <CaseStudy key={project.id} project={project} next={next} />;
}
