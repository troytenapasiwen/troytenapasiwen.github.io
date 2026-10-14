import { navItems } from "@/data/site";

/**
 * The scroll timeline of the dossier, measured in "screens" (1 screen = one small-viewport height of scroll).
 * Scroll position is the only clock: every physical state is derived from it, so the whole sequence
 * runs backwards when the visitor scrolls up.
 *
 *   rotateIn    the landscape folder turns in space until it is portrait
 *   open        the portrait folder opens, right cover swinging to the left
 *   turns[]     one entry per turning leaf: scroll drives the rotation of a sheet of paper
 *   (read)      the last page rests here so Contact can be read before anything else happens
 *   close       the lid swings back over the pages: the reverse of `open`
 *   rotateOut   the folder turns back to landscape: the reverse of `rotateIn`
 *
 * Two layouts share the model:
 *   spread  desktop: two pages are visible at once (like a book). A leaf has a front (right page)
 *           and a back (the next left page), so one turn reveals a whole new spread.
 *   single  phones / portrait tablets: one page is visible; every half-page is its own sheet.
 *
 * Both the server (page numbering, scroll track size) and the client (scroll -> progress) import
 * this file, so they never disagree.
 */

export type PageDef = { id: string; act: string };

/** The 12 physical pages. Each page is a spread: a left half and a right half (see Page.tsx). */
export const PAGES: PageDef[] = [
  { id: "intro", act: "about" },
  { id: "exp-iwsc", act: "experience" },
  { id: "exp-inventory", act: "experience" },
  { id: "exp-crewing", act: "experience" },
  { id: "exp-forms", act: "experience" },
  { id: "exp-seaker", act: "experience" },
  { id: "exp-recruitment", act: "experience" },
  { id: "proj-analyzer", act: "projects" },
  { id: "proj-reina", act: "projects" },
  { id: "education", act: "education" },
  { id: "skills", act: "skills" },
  { id: "contact", act: "contact" },
];

/** Surfaces (half-pages): 2 per page. surface 2n is the left half of page n, 2n+1 the right half. */
export const SURFACES = PAGES.length * 2;

export type Layout = "spread" | "single";
export type Span = { a: number; b: number };

export const ROTATE_SCREENS = 0.9; // landscape -> portrait (and back)
export const OPEN_SCREENS = 0.95; // lid opens (and closes)

const SHAPE = {
  // turn: scroll length of one page turn; hold: reading rest between turns; read: extra rest on Contact
  spread: { turn: 0.9, hold: 0.45, read: 1.6 },
  single: { turn: 0.7, hold: 0.3, read: 1.6 },
} as const;

export type Timeline = {
  layout: Layout;
  leaves: number;
  rotateIn: Span;
  open: Span;
  turns: Span[];
  close: Span;
  rotateOut: Span;
  /** scroll (screens) at which the folder is back to its closed landscape state */
  scroll: number;
  /** height of the scroll track in screens: the scroll distance plus the pinned viewport itself */
  total: number;
  /** scroll position at which each PAGE is at rest and fully readable */
  rest: number[];
};

export function buildTimeline(layout: Layout): Timeline {
  const { turn, hold, read } = SHAPE[layout];
  const leaves = (layout === "spread" ? PAGES.length : SURFACES) - 1;

  const rotateIn = { a: 0, b: ROTATE_SCREENS };
  const open = { a: rotateIn.b, b: rotateIn.b + OPEN_SCREENS };
  let cursor = open.b + hold;
  const turns: Span[] = [];
  for (let k = 0; k < leaves; k++) {
    turns.push({ a: cursor, b: cursor + turn });
    cursor += turn + (k === leaves - 1 ? read : hold);
  }
  const close = { a: cursor, b: cursor + OPEN_SCREENS };
  const rotateOut = { a: close.b, b: close.b + ROTATE_SCREENS };

  // a sheet (surface) is at rest: before the first turn, or after turn s-1
  const surfaceRest = (s: number) =>
    s === 0 ? open.b + hold / 2 : turns[s - 1].b + (s - 1 === leaves - 1 ? read * 0.4 : hold / 2);
  const rest = PAGES.map((_, p) => surfaceRest(layout === "spread" ? p : p * 2));

  return { layout, leaves, rotateIn, open, turns, close, rotateOut, scroll: rotateOut.b, total: rotateOut.b + 1, rest };
}

export const TIMELINES: Record<Layout, Timeline> = {
  spread: buildTimeline("spread"),
  single: buildTimeline("single"),
};

export const ACTS = navItems.map((item, i) => {
  const pages = PAGES.map((p, index) => ({ ...p, index })).filter((p) => p.act === item.id);
  return { ...item, no: String(i + 1).padStart(2, "0"), first: pages[0].index, pages };
});

export function actById(id: string) {
  return ACTS.find((a) => a.id === id);
}

/** Scroll position (screens) that lands on the first page of an act, at rest. */
export function actJumpTarget(id: string, layout: Layout): number {
  const act = actById(id);
  return act ? TIMELINES[layout].rest[act.first] : 0;
}
