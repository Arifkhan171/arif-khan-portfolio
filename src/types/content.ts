// Shapes of all site content. The content itself lives in src/data/content.ts.
// Type-only file with no imports, so plain Node can load content.ts too.

type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";

/** Month and year as "YYYY-MM", e.g. "2025-02". */
export type YearMonth = `${number}-${Month}`;

/** A time span. `end` is "present" while it is still going on. */
export type Period = {
  readonly start: YearMonth;
  readonly end: YearMonth | "present";
};

/** A big number with its label, e.g. { value: "7,021", label: "documents indexed" }. */
export type Stat = {
  readonly value: string;
  readonly label: string;
};

export type SiteMeta = {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly language: string;
};

export type Profile = {
  readonly name: string;
  readonly title: string;
  readonly tagline: string;
  readonly summary: string;
  readonly location: string;
  readonly availability: string;
  /** Year the person started building AI/ML projects. */
  readonly buildingSince: number;
  readonly email: string;
  readonly links: {
    readonly github: string;
    readonly linkedin: string;
  };
  /** Headline numbers for the hero section. */
  readonly stats: readonly Stat[];
};

export type ProjectImage = {
  /** Path under public/, e.g. "/images/projects/neuroai/01-mri-viewer.webp". */
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
};

export type ProjectVideo = {
  readonly youtubeId: string;
  readonly title: string;
};

/** A private repo cannot have a URL (`url?: never` makes that a type error). */
export type ProjectRepo =
  | { readonly visibility: "public"; readonly url: string }
  | { readonly visibility: "private"; readonly note: string; readonly url?: never };

/**
 * featured = the main case studies, other = smaller complete projects,
 * learning = practice repositories.
 */
export type ProjectTier = "featured" | "other" | "learning";

export type Project = {
  /** Lowercase URL slug, unique. Also the image folder name. */
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly tier: ProjectTier;
  /** Sort order inside the tier. */
  readonly order: number;
  /** 1-2 sentences for cards. */
  readonly summary: string;
  /** Why the project exists. Required for featured and other. */
  readonly problem?: string;
  /** The person's role. Required for featured and other. */
  readonly role?: string;
  /** Required for featured. Leave out when the real dates are unknown. */
  readonly period?: Period;
  readonly metrics: readonly Stat[];
  readonly highlights: readonly string[];
  /** Ordered steps, for the diagram in the project detail view. */
  readonly architecture?: readonly string[];
  readonly tech: readonly string[];
  /** The first image is the cover. */
  readonly images: readonly ProjectImage[];
  readonly video?: ProjectVideo;
  readonly repo: ProjectRepo;
  readonly demoUrl?: string;
};

export type Experience = {
  readonly role: string;
  readonly organization: string;
  readonly location: string;
  readonly employmentType: string;
  readonly period: Period;
  readonly highlights: readonly string[];
  readonly tech: readonly string[];
};

export type Education = {
  readonly degree: string;
  readonly institution: string;
  readonly period: Period;
  readonly grade: string;
  readonly coursework: readonly string[];
};

export type TimelineItem = {
  readonly year: number;
  readonly title: string;
  readonly description: string;
};

export type SkillGroup = {
  readonly name: string;
  readonly items: readonly string[];
};

export type SiteContent = {
  readonly site: SiteMeta;
  readonly profile: Profile;
  readonly projects: readonly Project[];
  readonly experience: readonly Experience[];
  readonly education: readonly Education[];
  readonly timeline: readonly TimelineItem[];
  readonly skills: readonly SkillGroup[];
};
