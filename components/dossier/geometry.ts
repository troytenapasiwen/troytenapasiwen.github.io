/**
 * Presentation choice and folder geometry.
 *
 * `computeGeometry` is deliberately self-contained (no outside references): layout.tsx also inlines its
 * source into the pre-paint script, so the folder has its final size on the very first frame and
 * nothing jumps when React hydrates.
 */

export type Mode = "static" | "spread" | "single";

export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
/** Two pages side by side: a wide, tall-enough, landscape-ish window. */
export const SPREAD_QUERY = "(min-width: 1024px) and (min-height: 620px) and (min-aspect-ratio: 5/4)";
/** Anything shorter than this cannot hold a readable physical page: fall back to the plain document. */
export const MIN_SINGLE_HEIGHT = 520;

export type Geometry = {
  pw: number; // portrait width of the closed folder (= one page + frame)
  ph: number; // portrait height
  ls: number; // extra scale while landscape (settles to 1 as the folder turns)
  dip: number; // pull-back at the 45 degree moment so the turning folder never leaves the screen
  dy: number; // vertical offset of the folder inside the stage (px)
};

export function computeGeometry(layout: "spread" | "single", vw: number, vh: number, safeTop: number, safeBottom: number): Geometry {
  const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
  const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);
  let pw: number;
  let ph: number;
  let dy: number;
  let ls: number;
  let dip: number;
  if (layout === "spread") {
    const top = 58 + safeTop; // room for the folder tab
    const bottom = 64 + safeBottom; // room for the page controls and the plain-view button
    const availH = vh - top - bottom;
    const availW = vw - 64; // two pages side by side once open
    pw = even(Math.min(availW / 2, availH * 0.78, 760));
    ph = even(Math.min(availH, pw / 0.78));
    dy = (top - bottom) / 2;
    ls = clamp(Math.min(1.4, (vw * 0.92) / ph, (vh - 156) / pw), 0.5, 1.4);
    // halfway through the quarter turn the bounding box is larger than in either orientation
    const diag = (pw + ph) * Math.SQRT1_2;
    const fits = Math.min((vh - 90) / diag, (vw * 0.92) / diag);
    dip = Math.max(0, (ls + 1) / 2 - fits);
  } else {
    // A phone (or portrait tablet) holds the SAME folder as the desktop, just smaller. It is first seen closed and lying
    // in landscape, and its first step turns it upright. So the geometry has to satisfy three poses, not one:
    //   landscape (closed)  the whole folder, tab included, inside the screen
    //   every angle between the folder never leaves the screen while it turns
    //   portrait (open)     one page, as wide as the screen allows
    const m = vw < 480 ? 14 : 28; // desk left on each side of the upright folder
    const top = 44 + safeTop; // room for the folder tab
    const bottom = 72 + safeBottom; // page controls
    const availH = vh - top - bottom;
    const availW = Math.min(vw - 2 * m, 640);
    // An upright folder is never narrower than 0.6 of its height: a taller one would be a strip, and lying down it
    // would be an unconvincing, flat slab. On a tall phone the desk shows above and below it instead.
    ph = even(Math.max(300, Math.min(availH, 1000, availW / 0.6)));
    pw = even(Math.min(availW, ph * 0.78));
    dy = (top - bottom) / 2;
    const tab = 46; // the orange tab (26px on screen, 46 in the folder's own units) stands out of its top edge: its right edge while it lies down
    ls = clamp(Math.min(1.15, (vw - 28) / (ph + tab), (vh - top - bottom) / pw), 0.3, 1.15);
    // Scale while turning is ls + (1 - ls) * a^4 minus a pull-back of arc * dip, where arc is 4a(1-a) and a is the
    // eased turn (globals.css uses the same formula). The folder stays small while it is still wide on the diagonal and
    // only grows once it is nearly upright. The pull-back is the smallest one for which the turning folder's bounding
    // box fits at every angle (sampled), not only at the 45 degree moment.
    dip = 0;
    for (let k = 1; k < 40; k++) {
      const a = k / 40;
      const arc = 4 * a * (1 - a);
      const th = (1 - a) * Math.PI * 0.5;
      const bw = pw * Math.cos(th) + ph * Math.sin(th) + tab * Math.sin(th); // width of the turned box (the tab counted once: it is on one side)
      const bh = pw * Math.sin(th) + ph * Math.cos(th);
      const room = Math.min((vw - 24) / bw, (vh - top - bottom + 2 * Math.min(top, bottom) - 24) / bh);
      dip = Math.max(dip, (ls + (1 - ls) * a * a * a * a - room) / arc);
    }
    dip = clamp(dip, 0, 0.9);
  }
  return { pw, ph, ls, dip, dy };
}
