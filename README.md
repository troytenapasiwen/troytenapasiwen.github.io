# Troy Pasiwen: Portfolio

Personal portfolio for Troy Pasiwen, Software Developer | Web, Mobile & AI.

Live site: https://troytenapasiwen.github.io
GitHub: https://github.com/troytenapasiwen

## Stack

Next.js (App Router, static export), TypeScript, Tailwind CSS. No animation library: the folder, page turns and writing effects are CSS driven by a few custom properties that one small scroll loop updates. Deployed to GitHub Pages with GitHub Actions.

## How the dossier works

- `components/dossier/timeline.ts`: the order and scroll length of every page. Add or reorder pages here.
- `components/dossier/Dossier.tsx`: the scroll engine (folder opening, page progress, navigation).
- `components/dossier/Folder.tsx`: the cover.
- `components/dossier/Write.tsx` and `sequence.ts`: the "being written" effect and its timing.
- `components/dossier/pages/`: one file per scene (introduction, experience, projects, education, skills, contact).
- `app/globals.css`: colour tokens at the top, then every dossier style.

Three presentations share the same markup, chosen before first paint: **cinematic** (large screens), **flow** (phones and tablets), and **static** (reduced motion, or the "Plain view" button).

## Updating content

All content lives in `data/`:

- `site.ts`: name, headline, intro, About, links
- `experience.ts`: internship systems
- `projects.ts`: personal and academic projects (each also gets a page at `/projects/<slug>`)
- `skills.ts`, `education.ts`

## Commands

```bash
npm run dev     # local development
npm run build   # static export to ./out
```

Internship systems are described at a high level. Specific implementation details of company systems are not publicly disclosed due to confidentiality.
