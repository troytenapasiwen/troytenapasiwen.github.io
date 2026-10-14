# Troy Pasiwen: Portfolio

Personal portfolio for Troy Pasiwen, Software Developer | Web, Mobile & AI.

Live site: https://troytenapasiwen.github.io
GitHub: https://github.com/troytenapasiwen

## Stack

Next.js (App Router, static export), TypeScript, Tailwind CSS. No animation library: the folder, page turns and writing effects are CSS driven by a few custom properties that one small scroll loop updates. Deployed to GitHub Pages with GitHub Actions.

## How the dossier works

The portfolio is one physical folder. Scrolling is the only clock: the folder turns, opens, its pages are turned by scroll, then it closes and turns back. Everything is a pure function of the scroll position, so scrolling up simply plays it backwards.

- `components/dossier/timeline.ts`: the 12 pages, and the scroll range of every stage (rotate, open, each page turn, the Contact reading rest, close, rotate back). Reorder or add pages here.
- `components/dossier/geometry.ts`: which presentation to use, and the folder's size for the viewport.
- `components/dossier/Dossier.tsx`: the scroll engine. It turns scroll position into CSS custom properties (`--ra`, `--op`, and `--t` / `--p` on each sheet) and nothing else.
- `components/dossier/Folder.tsx`: the cover and lid.
- `components/dossier/Page.tsx`: one page = a left and a right half, each a physical sheet with header, body and footer in normal flow.
- `components/dossier/Write.tsx` and `sequence.ts`: the calm block-by-block reveal and its timing.
- `components/dossier/pages/`: one file per scene (introduction, experience, projects, education, skills, contact).
- `app/globals.css`: colour tokens at the top, then every dossier style.

Three presentations share the same markup, chosen before first paint (`<html data-dm>`):

- **spread** (desktop): two pages visible at once, like an open book. A leaf's front is a right half and its back is the next left half, so one turn reveals a new spread.
- **single** (phones, portrait tablets): one page at a time; every half-page is its own sheet that physically swings away about the spine.
- **static** (reduced motion, the "Plain view" button, or a window too short to hold a page): a normal scrolling document.

Pages never overlap their own header or footer: the body shrinks its type slightly (never below a floor) if a half-page is too tall, and only then becomes scrollable, so nothing is ever hidden.

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
