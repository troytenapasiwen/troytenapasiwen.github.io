"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Dock, DossierControls, ScrollCue, ScrollHints, ViewSwitch } from "./controls";
import type { Dir } from "./controls";
import { MIN_SINGLE_HEIGHT, REDUCED_QUERY, SPREAD_QUERY, computeGeometry } from "./geometry";
import type { Mode } from "./geometry";
import { ACTS, PAGES, SURFACES, TIMELINES, actById, actStateIndex } from "./timeline";
import type { Motion, Span } from "./timeline";
import { useScrollCues } from "./ScrollCue";

/**
 * The engine: ONE state model, played in real time.
 *
 * The folder is always at one of a few resting states (closed, page 1 ... page N, closed again). Wheel, touch,
 * keyboard and the arrow buttons all ask for the same thing: "one step forward" or "one step back" (`request`).
 * A step is a fixed sequence, and nothing in it depends on how fast or how often the visitor scrolls:
 *
 *   1. turning     the physical motion plays (folder turns, lid opens, or a leaf turns about the spine), with the
 *                  pages it uncovers dark and blank. No text of the new page exists yet.
 *   2. settling    the motion has ended; everything is at rest, flat and crisp.
 *   3. revealing   the left page lights and is drawn, top to bottom. When it has finished ...
 *   4.             ... the right page does the same.
 *   5. idle        the visitor can navigate again.
 *
 * Input during `turning` and `settling` is ignored (a leaf in the air cannot be re-aimed, and nothing has been drawn
 * yet at rest). Input during revealing completes the reveal at once and starts the next turn, so the reveals of two pages can never overlap or run
 * against the wrong page. Going back resets the page it returns to, so it is drawn again in the same order.
 *
 * The visuals are still CSS. This file writes numbers (custom properties) and data attributes, and only when
 * they change. <html data-dm="..."> (set before first paint by the inline script in layout.tsx) selects:
 *
 *   spread  desktop: two pages visible at once, like an open book.
 *   single  phones / portrait tablets: one page visible, every half-page turns as its own sheet.
 *   static  reduced motion, the "Plain view" button, or a window too short for a page: the plain edition.
 */

const MIN_FIT = { spread: 0.72, single: 0.8 } as const;
const SETTLE_MS = 160; // the page sits still before anything is drawn on it
const GAP_MS = 180; // between the left page finishing and the right page starting
const TURN_MS = { spread: 1150, single: 950 } as const;
const MOTION_MS = { rotate: 950, open: 1250, close: 1250 } as const;
const HINT_REST_MS = 3500;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const ease = (x: number) => x * x * (3 - 2 * x);
const ramp = (u: number, s: Span) => (s.b === s.a ? 0 : clamp((u - s.a) / (s.b - s.a)));

/** A cubic-bezier easing as a function, so the leaf follows exactly the curve we tune here. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sx(t) - x;
      if (Math.abs(err) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return sy(clamp(t));
  };
}
/** Paper: it peels away slowly, swings through the middle, and comes to rest with a long, soft landing. No overshoot. */
const turnEase = bezier(0.5, 0.04, 0.16, 1);

function detectMode(): Mode {
  const reduced = window.matchMedia(REDUCED_QUERY).matches;
  let plain = false;
  try {
    plain = localStorage.getItem("dossier-view") === "plain";
  } catch {
    // Storage can be blocked; fall through to the automatic choice.
  }
  if (reduced || plain) return "static";
  if (window.matchMedia(SPREAD_QUERY).matches) return "spread";
  return window.innerHeight >= MIN_SINGLE_HEIGHT ? "single" : "static";
}

type Engine = { request: (dir: Dir) => void; jump: (state: number) => void };
type Ui = { idx: number; shown: number; last: number; busy: boolean };

/** Where the visitor is, kept across layout changes: the start, a page, or the end. */
type Pos = { kind: "start" } | { kind: "page"; page: number } | { kind: "end" };

export default function Dossier({ cover, plain: plainEdition, children }: { cover: ReactNode; plain: ReactNode; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const posRef = useRef<Pos>({ kind: "start" });
  const modeRef = useRef<Mode>("single");

  const [mode, setMode] = useState<Mode>("single");
  // `mode` above is only a placeholder for the server render. The engine must not be built from it: it starts once
  // the real presentation has been read (see the effect below), otherwise a desktop visitor first gets an engine
  // for the phone layout, which is shown and listens for input until React rebuilds it a moment later.
  const [ready, setReady] = useState(false);
  const bootHashRef = useRef(true); // a #section in the address bar is applied once, when the first engine starts
  const [reduced, setReduced] = useState(false);
  const [short, setShort] = useState(false);
  const [ui, setUi] = useState<Ui>({ idx: 0, shown: 0, last: TIMELINES.spread.states.length - 1, busy: false });

  // ---- choose the presentation, and keep it up to date -------------------------------------
  useLayoutEffect(() => {
    const apply = () => {
      const next = detectMode();
      modeRef.current = next;
      document.documentElement.setAttribute("data-dm", next);
      if (next === "static") bootHashRef.current = false;
      setMode(next);
      setReady(true);
      setReduced(window.matchMedia(REDUCED_QUERY).matches);
      setShort(window.innerHeight < MIN_SINGLE_HEIGHT && !window.matchMedia(SPREAD_QUERY).matches);
    };
    apply();
    const queries = [window.matchMedia(REDUCED_QUERY), window.matchMedia(SPREAD_QUERY)];
    queries.forEach((mq) => mq.addEventListener("change", apply));
    window.addEventListener("orientationchange", apply);
    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", apply));
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  const go = useCallback((dir: Dir) => engineRef.current?.request(dir), []);

  // scroll-down cues (see ScrollCue.tsx): they only switch attributes, the engine is untouched
  useScrollCues(rootRef, { mode: ready ? mode : "static", idx: ui.idx, last: ui.last, busy: ui.busy });

  // ---- jump to a section (links in the pages, the address bar, the plain edition's navigation) -----
  const jump = useCallback((id: string) => {
    const m = modeRef.current;
    if (m === "spread" || m === "single") {
      engineRef.current?.jump(id === "top" ? 0 : actStateIndex(id, m));
    } else if (id === "top") {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      document.getElementById(`plain-${id}`)?.scrollIntoView({ behavior: "auto", block: "start" });
    }
    try {
      history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
    } catch {
      // Ignore: the hash is only a convenience.
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = link.getAttribute("href")!.slice(1);
      if (id === "top" || actById(id)) {
        e.preventDefault();
        jump(id);
      }
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [jump]);

  // Following a #section link from elsewhere (browser back/forward, typed hashes), and arriving with a hash.
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (id && actById(id)) jump(id);
    };
    window.addEventListener("hashchange", onHash);
    const id = window.location.hash.slice(1);
    let frame = 0;
    let later = 0;
    if (id && actById(id)) {
      // The browser also tries to scroll to the hash on load; jump again once it has settled.
      frame = requestAnimationFrame(() => jump(id));
      later = window.setTimeout(() => jump(id), 250);
    }
    return () => {
      window.removeEventListener("hashchange", onHash);
      cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [jump]);

  // ---- the engine ---------------------------------------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready || mode === "static") return;
    const layout = mode;
    const tl = TIMELINES[layout];
    const states = tl.states;
    const END = states.length - 1;
    const last = PAGES.length - 1;
    const html = document.documentElement;
    html.setAttribute("data-engine", "on");

    // ---- tiny helpers: write a value only when it changed --------------------------------------
    const applied = new WeakMap<Element, Record<string, string>>();
    const setVar = (el: HTMLElement, name: string, value: string) => {
      let rec = applied.get(el);
      if (!rec) applied.set(el, (rec = {}));
      if (rec[name] === value) return;
      rec[name] = value;
      el.style.setProperty(name, value);
    };
    const setAttr = (el: Element, name: string, value: string) => {
      if (el.getAttribute(name) !== value) el.setAttribute(name, value);
    };

    const drivers = Array.from(root.querySelectorAll<HTMLElement>("[data-drive]"));
    const surfaces = Array.from(root.querySelectorAll<HTMLElement>("[data-surface]")).sort(
      (a, b) => Number(a.dataset.surface) - Number(b.dataset.surface),
    );
    const sheets = surfaces.map((el) => el.querySelector<HTMLElement>(".d-sheet")!);
    const shades = surfaces.map((el) => el.querySelector<HTMLElement>(".d-shade")!);
    const casts = surfaces.map((el) => el.querySelector<HTMLElement>(".d-cast")!);

    // ---- fit: a sheet never clips or overlaps its text --------------------------------------
    // Each half-page is measured in its real layout. If its body is taller than the room it has between
    // header and footer, the type scale (--fit) shrinks just enough, never below MIN_FIT. If it still
    // does not fit (tiny windows) the body becomes scrollable, so nothing is ever hidden.
    let fitTimer = 0;
    const runFit = () => {
      root.setAttribute("data-measuring", "");
      sheets.forEach((sheet) => {
        const body = sheet.querySelector<HTMLElement>(".d-body");
        if (!body) return;
        let f = 1;
        sheet.style.setProperty("--fit", "1");
        sheet.removeAttribute("data-overflow");
        for (let i = 0; i < 5; i++) {
          const over = body.scrollHeight - body.clientHeight;
          if (over <= 1) break;
          f = Math.max(MIN_FIT[layout], f * (body.clientHeight / body.scrollHeight) * 0.985);
          sheet.style.setProperty("--fit", f.toFixed(3));
          if (f <= MIN_FIT[layout]) break;
        }
        if (body.scrollHeight - body.clientHeight > 1) sheet.setAttribute("data-overflow", "");
      });
      root.removeAttribute("data-measuring");
    };
    const fitLater = () => {
      window.clearTimeout(fitTimer);
      fitTimer = window.setTimeout(runFit, 140);
    };

    // ---- measurements: cached, and only redone on resize / orientation change -----------------
    let lastKey = "";
    const measure = (force = false) => {
      const probe = probeRef.current;
      const vw = window.innerWidth;
      // 100svh: the viewport with the browser toolbars showing. It does not change while the address bar
      // slides away, so the folder never resizes mid-use.
      const vh = probe?.offsetHeight || window.innerHeight;
      const cs = probe ? getComputedStyle(probe) : null;
      const safeTop = cs ? parseFloat(cs.paddingTop) || 0 : 0;
      const safeBottom = cs ? parseFloat(cs.paddingBottom) || 0 : 0;
      const key = `${vw}x${vh}x${safeTop}x${safeBottom}`;
      if (!force && key === lastKey) return false;
      lastKey = key;
      const g = computeGeometry(layout, vw, vh, safeTop, safeBottom);
      root.style.setProperty("--pw", `${g.pw}px`);
      root.style.setProperty("--ph", `${g.ph}px`);
      root.style.setProperty("--ls", g.ls.toFixed(4));
      root.style.setProperty("--dip", g.dip.toFixed(4));
      root.style.setProperty("--dy", `${g.dy}px`);
      return true;
    };

    // ---- state ------------------------------------------------------------------------------
    type Phase = "idle" | "turning" | "settling" | "revealing";
    let phase: Phase = "idle";
    let idx = 0;
    let heading = 0;
    let u = 0;
    let raf = 0;
    let scrolled = false;
    let hintTimer = 0;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const clearTimers = () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };

    const posToIdx = (p: Pos) => (p.kind === "start" ? 0 : p.kind === "end" ? END : layout === "spread" ? p.page + 1 : p.page * 2 + 1);
    const idxToPos = (i: number): Pos =>
      i <= 0 ? { kind: "start" } : i >= END ? { kind: "end" } : { kind: "page", page: layout === "spread" ? i - 1 : (i - 1) >> 1 };

    /** The sheets that are uncovered (and so must be drawn) when the folder arrives at state `i`. */
    const arrivalSurfaces = (i: number): number[] => {
      if (i <= 0 || i >= END) return [];
      return layout === "spread" ? [2 * (i - 1), 2 * (i - 1) + 1] : [i - 1];
    };
    const setReveal = (s: number, v: "hidden" | "running" | "done") => setAttr(surfaces[s], "data-rv", v);

    // ---- physical state, as a pure function of u --------------------------------------------
    const update = () => {
      const ra = layout === "single" ? 1 : ramp(u, tl.rotateIn) - ramp(u, tl.rotateOut);
      const op = ramp(u, tl.open) - ramp(u, tl.close);
      const e = ease(op);
      const sRa = ra.toFixed(4);
      const sOp = op.toFixed(4);
      drivers.forEach((el) => {
        setVar(el, "--ra", sRa);
        setVar(el, "--op", sOp);
      });
      setAttr(root, "data-lidtop", e < 0.5 ? "1" : "0");
      setAttr(root, "data-settled", op >= 0.999 ? "1" : "0");
      setAttr(root, "data-end", u >= tl.end - 0.02 ? "1" : "0");

      // Each leaf's angle is the eased turn itself (the CSS uses it directly), so the curve above is what you see.
      const t = tl.turns.map((span) => turnEase(ramp(u, span)));
      const leaf = (k: number) => (k >= 0 && k < t.length ? t[k] : 0);
      const lift = (k: number) => 4 * leaf(k) * (1 - leaf(k)); // 0 -> 1 -> 0 while a leaf is in the air
      const closed = op <= 0.001;

      surfaces.forEach((el, s) => {
        const page = s >> 1;
        const left = (s & 1) === 0;
        let own: number; // this surface's own turn / landing progress
        let visible: boolean;
        let rest: boolean;
        let cast = 0; // shadow thrown on this sheet by the leaf moving over it
        let castT = 0; // how far that leaf has turned (0 -> 1): the shadow travels with it
        let lc = 0; // how far the lid has closed over a page that lies on it

        if (layout === "spread") {
          if (left) {
            own = page === 0 ? e : leaf(page - 1);
            visible = !closed && own > 0 && (leaf(page) < 1 || page === last);
            lc = page === 0 ? 0 : 1 - e;
            rest = own >= 1 && lc <= 0;
            cast = page < last ? lift(page) : 0;
            castT = page < last ? leaf(page) : 0;
          } else {
            own = leaf(page);
            const uncovered = page === 0 ? op : leaf(page - 1);
            visible = !closed && uncovered > 0 && (own < 1 || page === last);
            rest = own <= 0;
            cast = page > 0 ? lift(page - 1) : 0;
            castT = page > 0 ? leaf(page - 1) : 0;
          }
        } else {
          own = leaf(s);
          const uncovered = s === 0 ? op : leaf(s - 1);
          visible = !closed && uncovered > 0 && (own < 1 || s === SURFACES - 1);
          rest = own <= 0;
          cast = s > 0 ? lift(s - 1) : 0;
          castT = s > 0 ? leaf(s - 1) : 0;
        }

        setVar(el, "--t", own.toFixed(4));
        // the shade element carries its own numbers (they are not inherited): the sheet's own lift and the shadow of a passing leaf
        setVar(shades[s], "--sh", (4 * own * (1 - own)).toFixed(4));
        setVar(shades[s], "--t", own.toFixed(4)); // the highlight on a turning leaf travels with its turn
        // the shadow of a passing leaf is its own layer: how strong (--cs) and how far across the sheet it reaches (--ct)
        setVar(casts[s], "--cs", cast.toFixed(4));
        setVar(casts[s], "--ct", castT.toFixed(4));
        if (layout === "spread" && left) setVar(el, "--lc", lc.toFixed(4));
        setAttr(el, "data-active", visible ? "true" : "false");
        // only a sheet that is actually on show and in motion is "moving" (it alone gets a compositor layer)
        setAttr(el, "data-turn", visible && !rest ? "moving" : "rest");
      });
    };

    // ---- reveal: left page first, then the right, only once everything is at rest -------------
    const revealTime = (el: HTMLElement) => {
      let end = 0;
      el.querySelectorAll<HTMLElement>(".write").forEach((w) => {
        const dl = parseFloat(w.style.getPropertyValue("--dl")) || 0;
        const du = parseFloat(w.style.getPropertyValue("--du")) || 0;
        // staggered lists add their own small delay per item
        const extra = w.classList.contains("write-stagger") ? w.children.length * 70 + 240 : 0;
        end = Math.max(end, dl + du + extra);
      });
      return Math.min(3200, Math.max(900, end)); // never shorter than the page lighting up
    };

    // Show the side hints while browsing. After a page turn, bring them back after a pause.
    const syncHint = () => {
      window.clearTimeout(hintTimer);
      const browsing = phase !== "turning" && idx > 0 && idx < END;
      if (!browsing) {
        setAttr(root, "data-hint", "0");
        return;
      }
      if (!scrolled) {
        setAttr(root, "data-hint", "1");
        return;
      }
      setAttr(root, "data-hint", "0");
      hintTimer = window.setTimeout(() => setAttr(root, "data-hint", "1"), HINT_REST_MS);
    };

    const commit = () => {
      const pos = idxToPos(idx);
      posRef.current = pos;
      const busy = phase !== "idle";
      if (idx <= 0 || idx >= END) scrolled = false;
      const shown = phase === "turning" ? heading : idx;
      setAttr(root, "data-phase", phase);
      syncHint();
      setUi((c) => (
        c.idx === idx && c.shown === shown && c.busy === busy && c.last === END
          ? c
          : { idx, shown, last: END, busy }
      ));
    };

    const finishReveals = () => {
      clearTimers();
      arrivalSurfaces(idx).forEach((s) => setReveal(s, "done"));
      phase = "idle";
      commit();
    };

    const startReveals = (i: number) => {
      const list = arrivalSurfaces(i);
      phase = "revealing";
      commit();
      const run = (k: number) => {
        if (k >= list.length) {
          phase = "idle";
          commit();
          return;
        }
        const s = list[k];
        setReveal(s, "running");
        later(() => {
          setReveal(s, "done");
          later(() => run(k + 1), k + 1 < list.length ? GAP_MS : 0);
        }, revealTime(sheets[s]));
      };
      run(0);
    };

    // ---- motion: plays whole motions in real time, one after the other ----------------------------
    const duration = (m: Motion) => (m.kind === "turn" ? TURN_MS[layout] : MOTION_MS[m.kind]);

    const play = (list: Motion[], dir: 1 | -1, done: () => void) => {
      let k = 0;
      let t0 = 0;
      const stepMotion = (now: number) => {
        const m = list[k];
        if (!t0) t0 = now;
        const x = clamp((now - t0) / duration(m));
        u = m.a + (m.b - m.a) * (dir > 0 ? x : 1 - x);
        update();
        if (x < 1) {
          raf = requestAnimationFrame(stepMotion);
        } else if (++k < list.length) {
          t0 = 0;
          raf = requestAnimationFrame(stepMotion);
        } else {
          done();
        }
      };
      raf = requestAnimationFrame(stepMotion);
    };

    const begin = (dir: 1 | -1) => {
      const from = idx;
      const to = idx + dir;
      if (to < 0 || to > END) return;
      // The page about to be uncovered starts dark and blank, whatever state it was left in.
      arrivalSurfaces(to).forEach((s) => setReveal(s, "hidden"));
      const lo = Math.min(states[from], states[to]) - 1e-6;
      const hi = Math.max(states[from], states[to]) + 1e-6;
      let list = tl.motions.filter((m) => m.a >= lo && m.b <= hi && m.b > m.a);
      if (dir < 0) list = list.slice().reverse();
      if (!list.length) return;
      if (from > 0 && from < END) scrolled = true;
      heading = to;
      phase = "turning";
      commit();
      play(list, dir, () => {
        idx = to;
        u = states[to];
        update();
        phase = "settling";
        commit();
        later(() => startReveals(to), SETTLE_MS);
      });
    };

    // The image viewer marks <html data-viewer> while it is open: nothing behind it may turn a page.
    const viewerOpen = () => html.hasAttribute("data-viewer");

    // The folder looks closed at both ends. Going forward from the end starts a fresh opening.
    const rewind = () => {
      cancelAnimationFrame(raf);
      clearTimers();
      idx = 0;
      heading = 0;
      u = states[0];
      surfaces.forEach((_, s) => setReveal(s, "hidden"));
      phase = "idle";
      update();
      commit();
    };

    const request = (dir: Dir) => {
      const d = dir === "next" ? 1 : -1;
      if (viewerOpen()) return;
      if (phase === "turning" || phase === "settling") return;
      const reopen = idx >= END && d > 0;
      if (!reopen && (idx + d < 0 || idx + d > END)) return;
      if (phase !== "idle") finishReveals();
      if (reopen) rewind();
      begin(d);
    };

    const jumpTo = (target: number) => {
      cancelAnimationFrame(raf);
      clearTimers();
      idx = clamp(target, 0, END);
      heading = idx;
      u = states[idx];
      surfaces.forEach((_, s) => setReveal(s, "hidden"));
      arrivalSurfaces(idx).forEach((s) => setReveal(s, "done"));
      phase = "idle";
      update();
      commit();
    };

    engineRef.current = { request, jump: jumpTo };

    // ---- input: every route ends in `request` -----------------------------------------------
    const insideScroller = (target: EventTarget | null, dy: number) => {
      const body = (target as HTMLElement | null)?.closest?.(".d-sheet[data-overflow] .d-body") as HTMLElement | null;
      if (!body) return false;
      const max = body.scrollHeight - body.clientHeight;
      return dy > 0 ? body.scrollTop < max - 1 : body.scrollTop > 1;
    };

    // Wheels and trackpads send a stream of events for one gesture (with a long inertia tail). One gesture = one step.
    let acc = 0;
    let lastWheel = performance.now();
    let lastMag = 0;
    let spent = true;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch zoom
      if (viewerOpen()) return;
      if (insideScroller(e.target, e.deltaY)) return;
      const stamp = e.timeStamp;
      const now = stamp > 0 && Math.abs(performance.now() - stamp) < 60000
        ? stamp
        : performance.now();
      const mag = Math.abs(e.deltaY) + Math.abs(e.deltaX);
      if (now - lastWheel > 160 || mag > lastMag * 1.8 + 12) {
        acc = 0;
        spent = false;
      }
      lastWheel = now;
      lastMag = mag;
      if (phase === "turning") {
        spent = true;
        acc = 0;
        return;
      }
      if (spent) return;
      acc += Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(acc) < 24) return;
      const dir: Dir = acc > 0 ? "next" : "prev";
      acc = 0;
      // One gesture = at most one step, even if that step is refused because a leaf is in the air: the rest of the
      // gesture is used up and must not be counted again the moment the turn ends.
      spent = true;
      request(dir);
    };

    let tx = 0;
    let ty = 0;
    let touching = false;
    let touchSpent = false;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return void (touching = false);
      touching = true;
      touchSpent = false;
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touching || touchSpent || e.touches.length !== 1) return;
      if (viewerOpen()) return;
      const dx = e.touches[0].clientX - tx;
      const dy = e.touches[0].clientY - ty;
      const vertical = Math.abs(dy) > Math.abs(dx) * 1.1;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 44) return;
      if (vertical && insideScroller(e.target, -dy)) return;
      touchSpent = true;
      request((vertical ? dy < 0 : dx < 0) ? "next" : "prev");
    };
    const onTouchEnd = () => {
      touching = false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.defaultPrevented) return;
      if (viewerOpen()) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, select, [contenteditable]")) return;
      const onControl = Boolean(el.closest("a, button"));
      let dir: Dir | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") dir = "next";
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") dir = "prev";
      else if (e.key === " " && !onControl) dir = "next";
      if (!dir) return;
      if (onControl && (e.key === "ArrowDown" || e.key === "ArrowUp")) return;
      e.preventDefault();
      if (e.repeat) return; // holding a key is one step, not a stream of them
      request(dir);
    };

    // ---- start from wherever the visitor already was (a layout change keeps the page) --------------
    const onResize = () => {
      if (measure()) runFit();
    };
    let alive = true;
    measure(true);
    runFit();
    document.fonts?.ready.then(() => alive && runFit()); // never from an engine that has been torn down
    jumpTo(posToIdx(posRef.current));
    if (bootHashRef.current) {
      bootHashRef.current = false;
      const id = window.location.hash.slice(1);
      if (id && actById(id)) jumpTo(actStateIndex(id, layout));
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("resize", fitLater);

    // Gentle pointer tilt while the folder is still closed (desktop with a mouse only).
    const obj = objectRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let tiltRaf = 0;
    let gx = 0;
    let gy = 0;
    let cx = 0;
    let cy = 0;
    const tick = () => {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      if (obj) {
        obj.style.setProperty("--tx", cx.toFixed(3));
        obj.style.setProperty("--ty", cy.toFixed(3));
      }
      tiltRaf = Math.abs(gx - cx) + Math.abs(gy - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      gx = (e.clientX / window.innerWidth - 0.5) * 2;
      gy = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(tick);
    };
    if (layout === "spread" && fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      alive = false;
      engineRef.current = null;
      cancelAnimationFrame(raf);
      window.clearTimeout(hintTimer);
      cancelAnimationFrame(tiltRaf);
      clearTimers();
      window.clearTimeout(fitTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", fitLater);
      window.removeEventListener("pointermove", onMove);
      html.removeAttribute("data-engine");
      // Hand everything back to CSS: remove whatever the engine wrote.
      ["--pw", "--ph", "--ls", "--dip", "--dy"].forEach((n) => root.style.removeProperty(n));
      drivers.forEach((el) => ["--ra", "--op", "--tx", "--ty"].forEach((n) => el.style.removeProperty(n)));
      ["data-lidtop", "data-settled", "data-end", "data-measuring", "data-phase", "data-hint"].forEach((n) => root.removeAttribute(n));
      surfaces.forEach((el) => {
        ["--t", "--lc"].forEach((n) => el.style.removeProperty(n));
        el.setAttribute("data-active", "false");
        el.setAttribute("data-rv", "done");
        el.removeAttribute("data-turn");
      });
      sheets.forEach((sheet) => {
        sheet.style.removeProperty("--fit");
        sheet.removeAttribute("data-overflow");
      });
      shades.forEach((el) => ["--sh", "--t"].forEach((n) => el.style.removeProperty(n)));
      casts.forEach((el) => ["--cs", "--ct"].forEach((n) => el.style.removeProperty(n)));
    };
  }, [mode, ready]);

  const togglePlain = useCallback(() => {
    try {
      if (localStorage.getItem("dossier-view") === "plain") localStorage.removeItem("dossier-view");
      else localStorage.setItem("dossier-view", "plain");
    } catch {
      // Storage blocked: the choice just won't persist.
    }
    const next = detectMode();
    modeRef.current = next;
    document.documentElement.setAttribute("data-dm", next);
    setMode(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const plain = mode === "static";
  const layout = mode === "single" ? "single" : "spread";
  const open = ui.idx > 0;
  const ended = ui.idx >= ui.last && ui.last > 0;
  const page = !open ? -1 : ended ? PAGES.length - 1 : layout === "spread" ? ui.idx - 1 : (ui.idx - 1) >> 1;
  const act = page >= 0 ? ACTS.find((a) => a.id === PAGES[page].act) : null;
  const tab = act && !ended ? `${act.no} ${act.title} · ${String(page + 1).padStart(2, "0")}/${String(PAGES.length).padStart(2, "0")}` : "Portfolio";
  const state = !open ? "start" : ended ? "end" : "open";
  // The centered label follows the destination while the folder is moving.
  const headEnded = ui.shown >= ui.last && ui.last > 0;
  const headClosed = ui.shown <= 0 || headEnded;
  const headPage = headEnded ? PAGES.length : ui.shown <= 0 ? -1 : layout === "spread" ? ui.shown - 1 : (ui.shown - 1) >> 1;
  const headAct = headClosed ? null : ACTS.find((a) => a.id === PAGES[headPage].act);

  return (
    <DossierControls.Provider value={{ go, togglePlain, plain, canSwitch: !reduced && !short }}>
      <div className="d-root" ref={rootRef} data-state={state}>
        {/* Measures the small viewport (100svh) and the device safe areas; invisible. */}
        <div className="d-probe" ref={probeRef} aria-hidden="true" />
        {!reduced && !short && !plain && <ViewSwitch plain={plain} onClick={togglePlain} />}
        <main id="main" className="dossier">
          <div id="top" />
          {/* the folder (animated presentations) */}
          <div className="d-track" ref={trackRef}>
            <div className="d-stage">
              <div
                className="d-object"
                ref={objectRef}
                data-drive
                onClick={(e) => {
                  // A click anywhere on the closed folder opens it.
                  if (modeRef.current === "static" || ui.idx > 0) return;
                  if ((e.target as HTMLElement).closest("a, button")) return;
                  go("next");
                }}
              >
                <span className="d-shadow" data-drive aria-hidden="true" />
                <div className="d-cover-wrap">{cover}</div>
                <div className="d-frame" data-drive>
                  <span className="d-frame-shade" data-drive aria-hidden="true" />
                  <span className="d-frame-tab" data-drive aria-hidden="true">
                    {tab}
                  </span>
                  <div className="d-pages">{children}</div>
                </div>
              </div>
            </div>
          </div>
          {/* the plain reading edition (static presentation, and what is shown without JavaScript) */}
          <div className="plain-wrap">{plainEdition}</div>
        </main>
        {!plain && (
          <>
            <ScrollHints />
            <ScrollCue ended={ended} onGo={() => go("next")} />
            <Dock
              hidden={!open}
              page={headPage}
              total={PAGES.length}
              title={headAct?.title ?? ""}
              closed={headClosed}
              nextLabel={headEnded ? "Reopen the folder" : "Next page"}
              canPrev={ui.idx > 0}
              canNext={open}
              busy={ui.busy}
              onGo={go}
            />
          </>
        )}
      </div>
    </DossierControls.Provider>
  );
}
