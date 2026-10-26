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
public/            static files (favicon, images/projects, cv)
src/
  components/
    layout/        navbar, footer, page wrapper
    sections/      hero, projects, experience, contact ...
    ui/            small reusable pieces
  data/            the single content file (from Spec 02)
  hooks/           custom hooks
  lib/             helpers and animation presets
  types/           shared TypeScript types
  styles/index.css Tailwind import and base styles
  App.tsx, main.tsx
input/             source material (CV, LinkedIn export). Never part of the build.
.claude/           specs, plans and project status
```

## Content

All site content will live in `src/data/` (from Spec 02). To add a project, edit only that file.

## Deployment

Hosted on Vercel. Config is in `vercel.json` (single-page-app rewrite). The real deployment happens in Spec 10.
