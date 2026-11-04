import { lazy, Suspense, useEffect, useLayoutEffect, type ComponentType } from "react";
import { content } from "@/data/content";
import { getNavType, parseRoute, savedScrollY, usePathname } from "@/lib/router";
import { loadCaseStudy } from "@/pages/loadCaseStudy";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";

const CaseStudyPage = lazy(loadCaseStudy);

const sections: Partial<Record<string, ComponentType>> = {
  projects: FeaturedProjects,
  experience: Experience,
  skills: Skills,
  contact: Contact,
};

function HomePage() {
  const { navigation } = content;
  return (
    <>
      <Hero />
      {navigation.map((item) => {
        const Component = sections[item.id];
        return Component && <Component key={item.id} />;
      })}
    </>
  );
}

export default function App() {
  const pathname = usePathname();
  const route = parseRoute(pathname);

  // Runs after the new page is in the DOM and before it is painted. React renders the page, so the
  // browser cannot scroll to a #hash by itself. "instant" because the CSS default is smooth scrolling.
  useLayoutEffect(() => {
    if (getNavType() === "pop") {
      // Back/Forward: put the page where we left it. No saved value: the browser restores it.
      const y = savedScrollY();
      if (y !== undefined) window.scrollTo({ top: y, behavior: "instant" });
      return;
    }
    let id = window.location.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // A malformed hash (e.g. "#%E0") must not crash the page; use it as is.
    }
    const target = id ? document.getElementById(id) : null;
    if (target) target.scrollIntoView({ behavior: "instant" });
    else if (getNavType() === "push") window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    if (route.page === "home") document.title = content.site.title;
  }, [route.page]);

  return (
    <SiteLayout>
      {route.page === "project" ? (
        <Suspense fallback={<div className="min-h-screen" />}>
          <CaseStudyPage id={route.id} />
        </Suspense>
      ) : (
        <HomePage />
      )}
    </SiteLayout>
  );
}
