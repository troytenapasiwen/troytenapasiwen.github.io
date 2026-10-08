import { navItems } from "@/data/site";

/**
 * The scroll timeline of the dossier, measured in "screens" (1 screen = one viewport height of scroll).
 *
 *   0 ........ FOLDER_SCREENS            the folder cover opens
 *   FIRST_START ... →                    pages are written one after another; neighbours overlap
 *                                        by OVERLAP screens so each page "turns" into the next
 *
 * Both the server (to size the scroll track and number the pages) and the client
 * (to turn scroll position into progress) import this file, so they never disagree.
 */

export type PageDef = {
  id: string;
  act: string; // matches a navItems id
  weight: number; // screens of scroll this page owns
};

export const PAGES: PageDef[] = [
  { id: "intro", act: "about", weight: 1.5 },
  { id: "exp-iwsc", act: "experience", weight: 1.25 },
  { id: "exp-inventory", act: "experience", weight: 1.2 },
  { id: "exp-crewing", act: "experience", weight: 1.2 },
  { id: "exp-forms", act: "experience", weight: 1.2 },
  { id: "exp-seaker", act: "experience", weight: 1.25 },
  { id: "exp-recruitment", act: "experience", weight: 1.25 },
  { id: "proj-analyzer", act: "projects", weight: 1.4 },
  { id: "proj-reina", act: "projects", weight: 1.15 },
  { id: "education", act: "education", weight: 0.95 },
  { id: "skills", act: "skills", weight: 1.15 },
  { id: "contact", act: "contact", weight: 1.0 },
];

export const FOLDER_SCREENS = 1.0; // folder is fully open after this much scroll
export const FIRST_START = 0.32; // intro page starts appearing while the cover is still swinging
export const OVERLAP = 0.25; // screens shared by two neighbouring pages
export const HOLD_AT = 0.74; // page progress used when jumping to a page (text is fully written by then)

export type PageTiming = PageDef & {
  index: number;
  a: number; // start (screens)
  w: number; // length (screens)
  ov: number; // overlap as a fraction of this page's length
  first: boolean; // first page of its act
  last: boolean; // last page overall
};

export const TIMELINE: PageTiming[] = (() => {
  let cursor = FIRST_START;
  return PAGES.map((p, i) => {
    const a = cursor;
    cursor = a + p.weight - OVERLAP;
    return {
      ...p,
      index: i,
      a,
      w: p.weight,
      ov: OVERLAP / p.weight,
      first: i === 0 || PAGES[i - 1].act !== p.act,
      last: i === PAGES.length - 1,
    };
  });
})();

const lastPage = TIMELINE[TIMELINE.length - 1];

/** Scroll distance (screens) between "folder closed" and "contact fully shown". */
export const SCROLL_SCREENS = lastPage.a + lastPage.w;

/** Height of the scroll track in screens: the scroll distance plus the pinned viewport itself. */
export const TOTAL = SCROLL_SCREENS + 1;

export const ACTS = navItems.map((item, i) => ({
  ...item,
  no: String(i + 1).padStart(2, "0"),
  first: TIMELINE.find((p) => p.act === item.id)!,
  pages: TIMELINE.filter((p) => p.act === item.id),
}));

export function actById(id: string) {
  return ACTS.find((a) => a.id === id);
}

/** Scroll position (in screens) that lands on the first page of an act, with its text fully written. */
export function actJumpTarget(id: string): number {
  const act = actById(id);
  if (!act) return 0;
  return act.first.a + act.first.w * HOLD_AT;
}
