import { useEffect } from "react";
import { content } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";

// Placeholder sections: Specs 08-09 replace them.
export default function App() {
  const { navigation } = content;

  // The page is rendered by React, so the browser cannot scroll to a #hash on load (the target
  // does not exist yet). Do it once after the first render, without smooth scrolling.
  useEffect(() => {
    let id = window.location.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // A malformed hash (e.g. "#%E0") must not crash the page; use it as is.
    }
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <SiteLayout>
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
    </SiteLayout>
  );
}
