"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FileText } from "lucide-react";
import { MIN_SINGLE_HEIGHT, REDUCED_QUERY, SPREAD_QUERY, computeGeometry } from "./geometry";
import type { Mode } from "./geometry";
import { ACTS, PAGES, SURFACES, TIMELINES, actById, actJumpTarget } from "./timeline";
import type { Span } from "./timeline";

/**
 * The scroll engine.
 *
 * ONE scroll position is the only clock. It is turned into a physical state by one pure function:
 *
 *   rotate   ra 0 -> 1     the SAME folder turns in space, landscape -> portrait
 *   open     op 0 -> 1     the portrait folder opens, right cover swinging to the left
 *   turn k   t  0 -> 1     leaf k turns about the spine; its back lands on the left (desktop) or it
 *                          swings away (phone). Each sheet's reveal progress `--p` follows the turn
 *                          that uncovers it.
 *   read     (rest)        Contact stays still for a while so it can be read
 *   close    op 1 -> 0     the lid swings back over the pages (the opening, reversed); the pages that
 *                          lie on the lid travel with it
 *   rotate   ra 1 -> 0     the folder turns back to its closed landscape state (the rotation, reversed)
 *
 * Nothing is "played": scrolling back simply evaluates the same function at a smaller value, so every
 * stage reverses by itself and rapid or repeated scrolling can never leave the pages out of step.
 * The visuals are CSS; this file only writes numbers (CSS custom properties), and only when they change.
 *
 * <html data-dm="..."> (set before first paint by the inline script in layout.tsx) selects:
 *
 *   spread  desktop: two pages visible at once, like an open book.
 *   single  phones / portrait tablets: one page visible, every half-page turns as its own sheet.
 *   static  reduced motion, the "Plain view" button, or a window too short for a page: a normal document.
 */

const MIN_FIT = { spread: 0.72, single: 0.8 } as const;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const ease = (x: number) => x * x * (3 - 2 * x);
const ramp = (u: number, s: Span) => clamp((u - s.a) / (s.b - s.a));

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

export default function Dossier({ cover, children }: { cover: ReactNode; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("single");
  const [reduced, setReduced] = useState(false);
  const [short, setShort] = useState(false);
  const [activePage, setActivePage] = useState(-1);
  const modeRef = useRef<Mode>("single");
  const unitRef = useRef(800);
  const trackTopRef = useRef(0);

  // ---- choose the presentation, and keep it up to date -------------------------------------
  useEffect(() => {
    const apply = () => {
      const next = detectMode();
      modeRef.current = next;
      document.documentElement.setAttribute("data-dm", next);
      setMode(next);
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

  // ---- jump to a section ------------------------------------------------------------------
  const jump = useCallback((id: string) => {
    const m = modeRef.current;
    if (m === "spread" || m === "single") {
      const u = id === "top" ? 0 : actJumpTarget(id, m);
      // Instant on purpose: nobody should have to watch the animation to reach a section.
      window.scrollTo({ top: trackTopRef.current + u * unitRef.current, behavior: "instant" as ScrollBehavior });
    } else if (id === "top") {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
    }
    try {
      history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
    } catch {
      // Ignore: the hash is only a convenience.
    }
  }, []);

  // In-page links inside the sheets (e.g. "Experience", "Back to the folder") use the same jump.
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
      if (id && actById(id) && modeRef.current !== "static") jump(id);
    };
    window.addEventListener("hashchange", onHash);
    const id = window.location.hash.slice(1);
    let frame = 0;
    let later = 0;
    if (id && actById(id)) {
      // The browser also tries to scroll to the hash on load; jump again once it has settled.
      frame = requestAnimationFrame(() => modeRef.current !== "static" && jump(id));
      later = window.setTimeout(() => modeRef.current !== "static" && jump(id), 250);
    }
    return () => {
      window.removeEventListener("hashchange", onHash);
      cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [jump]);

  // ---- the scroll loop ---------------------------------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "static") return;
    const layout = mode;
    const tl = TIMELINES[layout];
    const last = PAGES.length - 1;

    const applied = new WeakMap<Element, Record<string, string>>();
    const setVar = (el: HTMLElement, name: string, value: string) => {
      let rec = applied.get(el);
      if (!rec) applied.set(el, (rec = {}));
      if (rec[name] === value) return;
      rec[name] = value;
      el.style.setProperty(name, value);
    };
    const setAttr = (el: HTMLElement, name: string, value: string) => {
      if (el.getAttribute(name) !== value) el.setAttribute(name, value);
    };

    const drivers = Array.from(root.querySelectorAll<HTMLElement>("[data-drive]"));
    const surfaces = Array.from(root.querySelectorAll<HTMLElement>("[data-surface]")).sort(
      (a, b) => Number(a.dataset.surface) - Number(b.dataset.surface),
    );
    const sheets = surfaces.map((el) => el.querySelector<HTMLElement>(".d-sheet")!);

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
      // slides away, so the folder never resizes and the scroll progress never jumps mid-scroll.
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
      root.style.setProperty("--total", tl.total.toFixed(3));
      unitRef.current = vh;
      trackTopRef.current = (trackRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
      return true;
    };

    // ---- scroll -> physical state ------------------------------------------------------------
    let lastU = -1;
    let lastPage = -2;
    const update = () => {
      const u = clamp((window.scrollY - trackTopRef.current) / unitRef.current, 0, tl.scroll);
      if (u === lastU) return;
      lastU = u;

      // folder: rotation and lid. Closing and un-rotating are the same ramps, subtracted.
      const ra = ramp(u, tl.rotateIn) - ramp(u, tl.rotateOut);
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
      setAttr(root, "data-end", u >= tl.scroll - 0.02 ? "1" : "0");

      // leaves
      const t = tl.turns.map((span) => ramp(u, span));
      const leaf = (k: number) => (k >= 0 && k < t.length ? t[k] : 0);
      const closed = op <= 0.001;

      surfaces.forEach((el, s) => {
        const page = s >> 1;
        const left = (s & 1) === 0;
        let own: number; // this surface's own turn / landing progress
        let v: number; // reveal progress: how much of it has been uncovered
        let visible: boolean;
        let rest: boolean;
        let lc = 0; // how far the lid has closed over a page that lies on it

        if (layout === "spread") {
          if (left) {
            own = page === 0 ? op : leaf(page - 1);
            v = own;
            visible = !closed && v > 0 && (leaf(page) < 1 || page === last);
            lc = page === 0 ? 0 : 1 - e;
            rest = own >= 1 && lc <= 0;
          } else {
            own = leaf(page);
            v = page === 0 ? op : leaf(page - 1);
            visible = !closed && v > 0 && (own < 1 || page === last);
            rest = own <= 0;
          }
        } else {
          own = leaf(s);
          v = s === 0 ? op : leaf(s - 1);
          visible = !closed && v > 0 && (own < 1 || s === SURFACES - 1);
          rest = own <= 0;
        }

        setVar(el, "--t", own.toFixed(4));
        if (layout === "spread" && left) setVar(el, "--lc", lc.toFixed(4));
        setVar(el, "--p", v.toFixed(4));
        setAttr(el, "data-active", visible ? "true" : "false");
        setAttr(el, "data-turn", rest ? "rest" : "moving");
        setAttr(el, "data-done", v >= 1 ? "1" : "0");
      });

      // which page is on show (for the tab)
      const turned = t.filter((x) => x >= 0.5).length;
      const sheet = layout === "spread" ? turned : turned >> 1;
      const current = e < 0.5 ? -1 : Math.min(sheet, last);
      if (current !== lastPage) {
        lastPage = current;
        setActivePage(current);
      }
    };

    let raf = 0;
    const schedule = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
      }
    };
    const onResize = () => {
      if (measure()) {
        lastU = -1;
        runFit();
      }
      schedule();
    };

    measure(true);
    runFit();
    document.fonts?.ready.then(runFit);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
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
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tiltRaf);
      window.clearTimeout(fitTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", fitLater);
      window.removeEventListener("pointermove", onMove);
      // Hand everything back to CSS: remove whatever the loop wrote.
      ["--pw", "--ph", "--ls", "--dip", "--dy", "--total"].forEach((n) => root.style.removeProperty(n));
      drivers.forEach((el) => ["--ra", "--op", "--tx", "--ty"].forEach((n) => el.style.removeProperty(n)));
      ["data-lidtop", "data-settled", "data-end", "data-measuring"].forEach((n) => root.removeAttribute(n));
      surfaces.forEach((el) => {
        ["--t", "--lc", "--p"].forEach((n) => el.style.removeProperty(n));
        el.setAttribute("data-active", "false");
        el.removeAttribute("data-turn");
        el.removeAttribute("data-done");
      });
      sheets.forEach((sheet) => {
        sheet.style.removeProperty("--fit");
        sheet.removeAttribute("data-overflow");
      });
    };
  }, [mode]);

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

  const page = activePage >= 0 ? PAGES[activePage] : null;
  const act = page ? ACTS.find((a) => a.id === page.act) : null;
  const tab = act
    ? `${act.no} ${act.title} · ${String(activePage + 1).padStart(2, "0")}/${String(PAGES.length).padStart(2, "0")}`
    : "Portfolio";
  const plain = mode === "static";

  return (
    <div className="d-root" ref={rootRef}>
      {/* Measures the small viewport (100svh) and the device safe areas; invisible. */}
      <div className="d-probe" ref={probeRef} aria-hidden="true" />
      {!reduced && !short && (
        <button
          type="button"
          className="d-toggle"
          aria-pressed={plain}
          onClick={togglePlain}
          title={plain ? "Switch to the animated dossier" : "Show everything as a plain document"}
        >
          <FileText className="size-4" aria-hidden="true" />
          <span className="d-toggle-text">{plain ? "Animated view" : "Plain view"}</span>
        </button>
      )}
      <main id="main" className="dossier">
        <div id="top" />
        <div className="d-track" ref={trackRef}>
          <div className="d-stage">
            <div className="d-object" ref={objectRef} data-drive>
              <span className="d-shadow" data-drive aria-hidden="true" />
              <div className="d-cover-wrap">{cover}</div>
              <div className="d-frame">
                <span className="d-frame-tab" data-drive aria-hidden="true">
                  {tab}
                </span>
                <div className="d-pages">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
