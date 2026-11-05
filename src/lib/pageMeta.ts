import { content } from "@/data/content";
import { absoluteUrl, type PageMeta } from "@/lib/meta";

function headTag(selector: string, create: () => HTMLElement): HTMLElement {
  let tag = document.head.querySelector<HTMLElement>(selector);
  if (!tag) {
    tag = create();
    document.head.append(tag);
  }
  return tag;
}

/** Client-side update of title, description, canonical and robots (crawlers that run no JS get the static copies). */
export function setPageMeta(meta: PageMeta, noindex = false): void {
  document.title = meta.title;
  headTag('meta[name="description"]', () => {
    const tag = document.createElement("meta");
    tag.name = "description";
    return tag;
  }).setAttribute("content", meta.description);

  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (noindex) canonical?.remove();
  else {
    headTag('link[rel="canonical"]', () => {
      const tag = document.createElement("link");
      tag.rel = "canonical";
      return tag;
    }).setAttribute("href", absoluteUrl(content, meta.path));
  }

  const robots = document.head.querySelector('meta[name="robots"]');
  if (noindex) {
    headTag('meta[name="robots"]', () => {
      const tag = document.createElement("meta");
      tag.name = "robots";
      return tag;
    }).setAttribute("content", "noindex");
  } else robots?.remove();
}
