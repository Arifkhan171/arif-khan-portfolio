import { lazy, Suspense, useEffect, useLayoutEffect } from "react";
import { content } from "@/data/content";
import { getNavType, parseRoute, savedScrollY, usePathname } from "@/lib/router";
import { loadCaseStudy } from "@/pages/loadCaseStudy";
import { Section } from "@/components/ui/Section";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

const CaseStudyPage = lazy(loadCaseStudy);

// Placeholder sections: Specs 08-09 replace them.
function HomePage() {
  const { navigation } = content;
  return (
    <>
      <Hero />
      {navigation.map((item) =>
        item.id === "projects" ? (
          <FeaturedProjects key={item.id} />
        ) : (
          <Section key={item.id} id={item.id} title={item.label} className="min-h-[60vh]">
            <p className="text-muted">This section is coming soon.</p>
          </Section>
        ),
      )}
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
