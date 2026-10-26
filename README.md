# Arif Khan — Portfolio

Personal portfolio of Arif Khan, Agentic AI / LLM Engineer.

## Requirements

- Node.js 24 LTS (`24.x`)
- npm

## Commands

```bash
npm install        # install dependencies
npm run dev        # start the local dev server
npm run build      # type-check, then production build into dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint (zero warnings allowed)
npm run format     # Prettier
npm run typecheck  # TypeScript check, no output
npm run validate:content  # check content.ts (runs first in build)
```

## Tech stack (installed versions)

| Tool         | Version |
| ------------ | ------- |
| Node.js      | 24.19.0 |
| Vite         | 8.3.5   |
| React        | 19.3.1  |
| TypeScript   | 6.0.3   |
| Tailwind CSS | 4.3.3   |
| Motion       | 14.6.0  |
| ESLint       | 10.13.0 |
| Prettier     | 3.9.10  |

Notes:

- **Animation:** the library is `motion` (the current name of Framer Motion). Import from `motion/react`.
- **Tailwind v4** is set up with the `@tailwindcss/vite` plugin. There is no `tailwind.config.js`.
  Dark mode uses the `dark` class on `<html>`, set with `@custom-variant` in `src/styles/index.css`.
- **Alias:** `@/` points to `src/` (TypeScript and Vite).

## Folder structure

```
scripts/           validate-content.ts (checks the content file)
public/            static files (favicon, images/projects, cv)
src/
  components/
    layout/        SkipLink, Navbar, MobileMenu, Footer, SiteLayout
    sections/      hero, projects, experience, contact ...
    ui/            Container, Section, Button, Badge, Card, ThemeToggle, icons
  data/            content.ts, the single content file
  hooks/           custom hooks
  lib/             helpers and animation presets
  types/           content.ts, the shapes of all content
  styles/index.css Tailwind import and base styles
  App.tsx, main.tsx
input/             source material (CV, LinkedIn export). Never part of the build.
.claude/           specs, plans and project status
```

## Editing content

All personal text lives in **one file**: `src/data/content.ts`. The shapes are in `src/types/content.ts`. Do not write personal text inside components.

Add a project:

1. Copy an existing project object in `projects` in `src/data/content.ts`. Give it a new lowercase `id` (for example `my-new-project`).
2. Choose its `tier` and an `order` (unique inside the tier).
3. Put images in `public/images/projects/<id>/` as `.webp` (max 1600 px wide, max 250 KB) and list them in `images`. The first image is the cover.
4. Run `npm run validate:content` and `npm run typecheck`.

Tiers:

- `featured`: the main case studies. They need a period, problem, role, images, metrics and a video.
- `other`: smaller complete projects shown as cards. They need a role and a problem.
- `learning`: practice repositories shown as a short list. Only title, summary, tech and repo are needed.

Notes:

- Dates are `"YYYY-MM"`. `end` can be `"present"`. Leave `period` out if the real dates are unknown.
- A private repo is `{ visibility: "private", note: "..." }` and cannot have a URL. A public repo is `{ visibility: "public", url: "https://github.com/..." }`.
- `npm run build` runs `validate:content` first and stops if the content has a mistake.

Navigation:

- Edit `navigation` in `src/data/content.ts`. The order is the order in the navbar.
- `id` is a lowercase slug, unique, and not `main` or `top`. The section on the page must use the same id (`<Section id="...">`). Until Specs 05–09 are done, a placeholder section appears for each item automatically.
- Run `npm run validate:content`.

CV:

- The download file is `public/cv/Arif-Khan-CV.pdf`. To update the CV, replace that file with a new PDF of the same name.
- If the file name changes, update `profile.links.cv` (`href` and `fileName`). The validator checks that the file exists.

## Design system

Tokens live in `src/styles/index.css`: `:root` = light values, `.dark` = dark values, `@theme` = type scale, layout, radius.

| Color class         | Use                                    |
| ------------------- | -------------------------------------- |
| `background`        | Page background                        |
| `surface`           | Cards, panels                          |
| `surface-muted`     | Subtle fills (badges, hover)           |
| `border`            | Dividers and card borders              |
| `foreground`        | Main text                              |
| `muted`             | Secondary text                         |
| `accent`            | Links, primary buttons, highlights     |
| `accent-foreground` | Text on `accent`                       |
| `accent-soft`       | Light accent background (metric chips) |
| `ring`              | Keyboard focus outline                 |

- **Use tokens, never raw colors.** Tailwind's default palette is switched off (`bg-zinc-900` does not exist). Never use `dark:` for colors; tokens switch by themselves.
- Type classes: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-caption`. Metric numbers: `font-mono tabular-nums`.
- Layout classes: `max-w-content`, `max-w-prose`, `px-gutter`, `py-section`. Shadows: `shadow-soft`, `shadow-raised`.
- Base components are in `src/components/ui/`: `Container`, `Section`, `Button`, `Badge`, `Card`, `ThemeToggle`. Icons are inline SVG in `icons.tsx` (`currentColor`, `size` prop, `aria-hidden`); there is no icon library.
- Layout: `SiteLayout` (skip link, navbar, `<main id="main">`, footer). The navbar height is the token `h-header` / `--spacing-header`.
- Theme: `useTheme()` from `src/hooks/useTheme.ts`. The storage key `portfolio-theme` and the `theme-color` values are repeated in the inline script in `index.html`; keep them in sync with `src/lib/theme.ts`.
- Animation presets in `src/lib/animations.ts`: `fadeIn`, `fadeUp`, `stagger` + `staggerItem`, `revealOnScroll`, `hoverLift`, `dropDown`. **Get `fadeUp`, `staggerItem`, `hoverLift` and `dropDown` from `useMotionPresets()`, never import them directly**: with reduced motion they become opacity-only. Use **`m.*`, not `motion.*`** (the app runs inside `LazyMotion` with `strict`; ESLint also blocks the `motion` import).

## Deployment

Hosted on Vercel. Config is in `vercel.json` (single-page-app rewrite). The real deployment happens in Spec 10.
