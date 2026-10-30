# Troy Pasiwen: Portfolio

Personal portfolio for Troy Pasiwen, Software Developer | Web, Mobile & AI.

Live site: https://troytenapasiwen.github.io
GitHub: https://github.com/troytenapasiwen

## Stack

Next.js (App Router, static export), TypeScript, Tailwind CSS. No animation library: the folder, page turns and writing effects are CSS driven by a few custom properties that one small engine updates. Deployed to GitHub Pages with GitHub Actions.

## How the dossier works

The portfolio is one physical folder. It is always at a resting state (closed, page 1 ... page 15, closed again), and moving between two neighbouring states is one fixed sequence that plays in real time:

1. **turning**: the physical motion (folder turns, lid opens, or a leaf turns about the spine). The pages it uncovers are dark and blank.
2. **settling**: everything is at rest, flat and crisp (about 160 ms).
3. **revealing**: the left page is drawn top to bottom, then (after a short gap) the right page.
4. **idle**: navigation is possible again.

Wheel, touch swipes, the arrow keys and the Previous / Next buttons all call the same `request()` in `Dossier.tsx`, so they can never disagree. Input is ignored while a leaf is in the air; input during settling or revealing completes the page on show and starts the next turn. Going back resets the page it returns to, so it is drawn again in the same order. The window does not scroll in the folder views; the page is turned instead.

- `components/dossier/timeline.ts`: the 15 pages (`PAGES`) and the ordered physical motions (rotate, open, each leaf, close). Reorder or add pages here and in `app/page.tsx`.
- `components/dossier/geometry.ts`: which presentation to use, and the folder's size for the viewport.
- `components/dossier/Dossier.tsx`: the engine. Durations (`TURN_MS`, `MOTION_MS`), the leaf's easing curve (`turnEase`), and the settle / gap timings are constants at the top.
- `components/dossier/Folder.tsx`: the cover and lid (name and role only; no section labels).
- `components/dossier/Page.tsx`: one page = a left and a right half, each a physical sheet with header, body and footer in normal flow.
- `components/dossier/Write.tsx`, `sequence.ts`: how blocks are drawn once their sheet is revealed (`dl` / `du` in milliseconds). Nothing here runs until the engine marks the sheet `data-rv="running"`.
- `components/dossier/evidence.tsx`: screenshots, notes, the website and phone showcases, company marks.
- `components/dossier/pages/`: one file per scene.
- `components/plain/`: the plain reading edition (see below).
- `components/ui/Backdrop.tsx`: the desk behind everything (grid, loose sheets, contact-sheet strip, grain). It never takes part in layout or input, and does not move on phones, with reduced motion, or in the plain edition.
- `components/ui/TechChip.tsx` and `techMarks.ts`: technology logos, vendored locally (see the licence note in `techMarks.ts`). A technology with no official mark is shown as text only.
- `components/ui/WorkIcons.tsx`: pictograms for work that has no screenshot.
- `app/globals.css`: colour tokens at the top, then every style.

**Type and colour.** Archivo Black (display), DM Sans (body), Newsreader (serif, for statements and the plain edition), IBM Plex Mono (technical), loaded in `app/layout.tsx`. Palette tokens are at the top of `app/globals.css`: black `--folder`, ivory `--paper`, the warm `--desk`, vermilion `--vermilion` (blocks and rules only, never small text on ivory) and the deeper `--accent` for orange text on paper.

Three presentations, chosen before first paint (`<html data-dm>`):

- **spread** (desktop): two pages visible at once, like an open book. A leaf's front is a right half and its back is the next left half, so one turn reveals a new spread.
- **single** (phones, portrait tablets): one page at a time; every half-page is its own sheet that physically swings away about the spine.
- **static** (reduced motion, the "Plain view" button, a window too short to hold a page, or no JavaScript): the plain edition, an editorial single page with normal scrolling and no animation, built from the same data.

Pages never overlap their own header or footer: the body shrinks its type slightly (never below a floor) if a half-page is too tall, and only then becomes scrollable, so nothing is ever hidden.

## Updating content

All content lives in `data/`:

- `site.ts`: name, headline, positioning statement, portrait, links
- `experience.ts`: internship systems, company logos, and their screenshots and notes
- `projects.ts`: personal and academic projects (each also gets a page at `/projects/<slug>`), with screenshots, notes and links
- `skills.ts`, `education.ts`, `media.ts` (shared image and note types)

Images live in `public/images/` and are referenced as `/images/<exact file name>`; keep the capitalisation, because some hosts are case sensitive.

## Commands

```bash
npm run dev     # local development
npm run build   # static export to ./out
```

Internship systems are described at a high level. Specific implementation details of company systems are not publicly disclosed due to confidentiality.
