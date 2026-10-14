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
  if (layout === "spread") {
    const top = 58 + safeTop; // room for the folder tab
    const bottom = 52 + safeBottom; // room for the plain-view button
    const availH = vh - top - bottom;
    const availW = vw - 64; // two pages side by side once open
    pw = even(Math.min(availW / 2, availH * 0.78, 760));
    ph = even(Math.min(availH, pw / 0.78));
    dy = (top - bottom) / 2;
  } else {
    const m = vw < 480 ? 14 : 28;
    const top = 40 + safeTop;
    const bottom = 52 + safeBottom;
    const availH = vh - top - bottom;
    ph = even(Math.max(300, Math.min(availH, 1000)));
    pw = even(Math.min(vw - 2 * m, 640, ph * 0.78));
    dy = (top - bottom) / 2;
  }
  const ls = spreadOrSingleLs(layout, pw, ph, vw, vh);
  // halfway through the quarter turn the bounding box is larger than in either orientation
  const diag = (pw + ph) * Math.SQRT1_2;
  const fits = Math.min((vh - 90) / diag, (vw * 0.92) / diag);
  const dip = Math.max(0, (ls + 1) / 2 - fits);
  return { pw, ph, ls, dip, dy };

  function spreadOrSingleLs(l: string, w: number, h: number, vw2: number, vh2: number) {
    const max = l === "spread" ? 1.4 : 1.3;
    return clamp(Math.min(max, (vw2 * 0.92) / h, (vh2 - 100) / w), 0.5, max);
  }
}
