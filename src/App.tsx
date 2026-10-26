import { content } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/sections/Hero";

// Placeholder sections: Specs 06-09 replace them.
export default function App() {
  const { navigation } = content;

  return (
    <SiteLayout>
      <Hero />
      {navigation.map((item) => (
        <Section key={item.id} id={item.id} title={item.label} className="min-h-[60vh]">
          <p className="text-muted">This section is coming soon.</p>
        </Section>
      ))}
    </SiteLayout>
  );
}
