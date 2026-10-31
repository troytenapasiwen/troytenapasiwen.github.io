import { navItems } from "@/data/site";

/**
 * The physical sequence of the dossier, as an ordered list of motions on one abstract axis `u`.
 *
 *   rotateIn    the landscape folder turns in space until it is portrait
 *   open        the portrait folder opens, right cover swinging to the left
 *   turns[]     one entry per turning leaf, hinged on the spine
 *   close       the lid swings back over the pages: the reverse of `open`
 *   rotateOut   the folder turns back to landscape: the reverse of `rotateIn`
 *
 * `u` is not scroll distance and not time. Dossier.tsx moves it in real time from one resting state to the next
 * (so every motion has a fixed, tuned duration), and every physical value (rotation, lid angle, leaf angle) is a
 * pure function of it. Playing a motion backwards is the same function at a smaller `u`.
 *
 * Two layouts share the model, and both begin as a closed LANDSCAPE folder that turns upright before it opens:
 *   spread  desktop: two pages are visible at once (like a book). A leaf has a front (right page) and a back (the
 *           next left page), so one turn reveals a whole new spread.
 *   single  phones / portrait tablets: one page is visible; every half-page is its own sheet. The folder is the same
 *           physical object as on the desktop, only smaller (geometry.ts), so it too is first seen lying in landscape
 *           and turns a quarter turn on the first step.
 *
 * Both the server (page numbering) and the client (the engine) import this file, so they never disagree.
 */

export type PageDef = { id: string; act: string; /** short name shown in the page controls */ label: string };

/** The physical pages. Each page is a spread: a left half and a right half (see Page.tsx). */
export const PAGES: PageDef[] = [
  { id: "intro", act: "about", label: "Introduction" },
  { id: "exp-divider", act: "experience", label: "Experience" },
  { id: "exp-intro-iwsc", act: "experience", label: "Software Developer Intern" },
  { id: "exp-iwsc", act: "experience", label: "Inter-World" },
  { id: "exp-inventory", act: "experience", label: "Inventory system" },
  { id: "exp-crewing", act: "experience", label: "Crewing system" },
  { id: "exp-forms", act: "experience", label: "Forms portal" },
  { id: "exp-intro-seaker", act: "experience", label: "IT & Digital Marketing Intern" },
  { id: "exp-seaker", act: "experience", label: "SEAker" },
  { id: "exp-marino", act: "experience", label: "Marino World" },
  { id: "exp-recruitment", act: "experience", label: "Recruitment & content" },
  { id: "proj-divider", act: "projects", label: "Projects" },
  { id: "proj-analyzer", act: "projects", label: "AI Resume Analyzer" },
  { id: "proj-analyzer-how", act: "projects", label: "Analyzer, how it works" },
  { id: "proj-reina", act: "projects", label: "REINA Pabili" },
  { id: "proj-reina-screens", act: "projects", label: "REINA, screens" },
  { id: "education", act: "education", label: "Education" },
  { id: "skills", act: "skills", label: "Skills" },
  { id: "contact", act: "contact", label: "Contact" },
];

/** Surfaces (half-pages): 2 per page. surface 2n is the left half of page n, 2n+1 the right half. */
export const SURFACES = PAGES.length * 2;

export type Layout = "spread" | "single";
export type Span = { a: number; b: number };
export type MotionKind = "rotate" | "open" | "turn" | "close";
export type Motion = Span & { kind: MotionKind };

export type Timeline = {
  layout: Layout;
  leaves: number;
  rotateIn: Span;
  open: Span;
  turns: Span[];
  close: Span;
  rotateOut: Span;
  /** every motion, in order */
  motions: Motion[];
  /** `u` at which the folder is back to its closed landscape state */
  end: number;
  /**
   * Every resting state, in order: 0 = closed at the start, then one per page (spread) or per half-page sheet
   * (single), then the closed folder again at the end. Navigation only ever moves between neighbours.
   */
  states: number[];
};

export function buildTimeline(layout: Layout): Timeline {
  const leaves = (layout === "spread" ? PAGES.length : SURFACES) - 1;
  // Both layouts turn the folder a quarter turn before it opens (and back again after it closes).
  const rot = 1;
  const rotateIn = { a: 0, b: rot };
  const open = { a: rotateIn.b, b: rotateIn.b + 1 };
  const turns: Span[] = [];
  let cursor = open.b;
  for (let k = 0; k < leaves; k++) {
    turns.push({ a: cursor, b: cursor + 1 });
    cursor += 1;
  }
  const close = { a: cursor, b: cursor + 1 };
  const rotateOut = { a: close.b, b: close.b + rot };

  const motions: Motion[] = [];
  if (rot) motions.push({ ...rotateIn, kind: "rotate" });
  motions.push({ ...open, kind: "open" });
  turns.forEach((t) => motions.push({ ...t, kind: "turn" }));
  motions.push({ ...close, kind: "close" });
  if (rot) motions.push({ ...rotateOut, kind: "rotate" });

  const rests = [open.b, ...turns.map((t) => t.b)];
  return { layout, leaves, rotateIn, open, turns, close, rotateOut, motions, end: rotateOut.b, states: [0, ...rests, rotateOut.b] };
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

/** Index into `states` that shows the first page of an act, at rest. */
export function actStateIndex(id: string, layout: Layout): number {
  const act = actById(id);
  if (!act) return 0;
  return layout === "spread" ? act.first + 1 : act.first * 2 + 1;
}
