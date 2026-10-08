"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Sidebar from "./Sidebar";
import {
  ACTS,
  FOLDER_SCREENS,
  OPEN_SCREENS,
  OVERLAP,
  PAGES,
  ROTATE_SCREENS,
  SCROLL_SCREENS,
  SIDEBAR_SCREENS,
  TIMELINE,
  TOTAL,
  actById,
  actJumpTarget,
} from "./timeline";

/**
 * The scroll engine.
 *
 * ONE scroll position is the only clock. It is turned into a physical state, in this order:
 *
 *   entrance   (time, once)  background only -> after ~1s the landscape folder is presented
 *   stage A    ra 0 -> 1     the SAME folder turns in space, landscape -> portrait
 *              sb 0 -> 1     the sidebar slides in (folder is portrait and still closed)
 *   stage B    op 0 -> 1     the portrait folder opens, right cover swinging to the left
 *   pages      --p per page  sheets are written and turned one after another
 *
 * Nothing is "played": scrolling back up simply evaluates the same functions at smaller values, so
 * every stage reverses by itself. The visuals are CSS; this file only writes numbers.
 *
 * Three presentations share one set of markup. <html data-dm="..."> (set before first paint by the
 * inline script in layout.tsx) selects which CSS applies:
 *
 *   cinematic  desktop: the folder and the pages are pinned in one sticky stage and the open folder
 *              is a two-panel spread (lid on the left, sheets on the right).
 *   flow       phones / tablets / short windows: the same folder sequence plays pinned, then the
 *              sheets slide up over it as ordinary readable pages.
 *   static     reduced motion, or the "Plain view" button: a normal document, nothing animates.
 */

type Mode = "cinematic" | "flow" | "static";

const REDUCED = "(prefers-reduced-motion: reduce)";
const CINEMATIC = "(min-width: 1024px) and (min-height: 620px)";

/** Width / height of the portrait folder. Landscape is the same object turned a quarter turn. */
const ASPECT = 0.72;
const MIN_FIT = 0.6;

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);

function detectMode(): Mode {
  const reduced = window.matchMedia(REDUCED).matches;
  let plain = false;
  try {
    plain = localStorage.getItem("dossier-view") === "plain";
  } catch {
    // Storage can be blocked; fall through to the automatic choice.
  }
  if (reduced || plain) return "static";
  return window.matchMedia(CINEMATIC).matches ? "cinematic" : "flow";
}

/**
 * Halfway through the turn the folder is at 45 degrees, where its bounding box is larger than in either
 * orientation. `dip` is how much the folder is pulled back (scale) at that moment so it never leaves the
 * screen: 0 when there is room, larger on short or small screens.
 */
function dip(pw: number, ph: number, ls: number, vw: number, vh: number) {
  const diag = (pw + ph) * Math.SQRT1_2;
  const fits = Math.min((vh - 90) / diag, (vw * 0.92) / diag);
  return Math.max(0, (ls + 1) / 2 - fits);
}

/**
 * Sizes of the physical folder in px. Computed from the viewport, so the folder always fits:
 *   pw x ph  portrait size of the closed folder
 *   side     width of the sidebar (a slim rail on small screens)
 *   ls       how much larger the folder is shown while landscape (it settles to 1 as it turns)
 */
function geometry(mode: "cinematic" | "flow") {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (mode === "cinematic") {
    const side = 216;
    const availH = vh - 124;
    const availW = vw - side - 56; // two panels once opened
    const pw = even(Math.min(availW / 2, availH * ASPECT, 900 * ASPECT));
    const ph = even(pw / ASPECT);
    const ls = clamp(Math.min(1.4, (vw * 0.92) / ph, (vh - 100) / pw), 0.5, 1.4);
    return { pw, ph, side, ls, dip: dip(pw, ph, ls, vw, vh) };
  }
  const side = vw >= 640 ? 52 : 44;
  const pw = even(Math.max(160, Math.min(vw - side - 32, (vh - 88) * ASPECT, 560)));
  const ph = even(pw / ASPECT);
  const ls = clamp(Math.min(1.3, (vw - 32) / ph, (vh - 96) / pw), 0.5, 1.3);
  return { pw, ph, side, ls, dip: dip(pw, ph, ls, vw, vh) };
}

export default function Dossier({
  cover,
  children,
}: {
  cover: ReactNode;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("flow");
  const [reduced, setReduced] = useState(false);
  const [activeAct, setActiveAct] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(-1);
  const modeRef = useRef<Mode>("flow");

  // ---- choose the presentation, and keep it up to date -------------------------------------
  useEffect(() => {
    const apply = () => {
      const next = detectMode();
      modeRef.current = next;
      document.documentElement.setAttribute("data-dm", next);
      setMode(next);
      setReduced(window.matchMedia(REDUCED).matches);
    };
    apply();
    const queries = [window.matchMedia(REDUCED), window.matchMedia(CINEMATIC)];
    queries.forEach((mq) => mq.addEventListener("change", apply));
    return () => queries.forEach((mq) => mq.removeEventListener("change", apply));
  }, []);

  // ---- jump to a section ------------------------------------------------------------------
  const jump = useCallback((id: string) => {
    const m = modeRef.current;
    if (m === "cinematic") {
      const track = trackRef.current;
      if (!track) return;
      const u = id === "top" ? 0 : actJumpTarget(id);
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      // Instant on purpose: nobody should have to watch the animation to reach a section.
      window.scrollTo({ top: trackTop + u * window.innerHeight, behavior: "instant" as ScrollBehavior });
    } else if (id === "top") {
      window.scrollTo({ top: 0, behavior: m === "static" ? "auto" : "smooth" });
    } else {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: m === "static" ? "auto" : "smooth", block: "start" });
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

  // Following a #section link from elsewhere on the same page (browser back/forward, typed hashes).
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (id && actById(id) && modeRef.current !== "static") jump(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [jump]);

  // Arriving with a hash (for example from a project page's "All projects" link).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !actById(id) || modeRef.current === "static") return;
    // The browser also tries to scroll to the hash on load; jump again once it has settled.
    const frame = requestAnimationFrame(() => jump(id));
    const later = window.setTimeout(() => jump(id), 250);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [jump]);

  // ---- entrance: empty background, then (after about a second) the folder is presented -------
  useEffect(() => {
    const root = rootRef.current;
    if (!root || root.hasAttribute("data-in")) return;
    const id = window.location.hash.slice(1);
    const deepLink = !!id && !!actById(id);
    if (mode === "static" || deepLink || window.scrollY > 8) {
      // Plain view, a direct link to a section, or a restored scroll position: no staging.
      root.setAttribute("data-in", "");
      return;
    }
    const t = window.setTimeout(() => root.setAttribute("data-in", ""), 1000);
    return () => window.clearTimeout(t);
  }, [mode]);

  // ---- the scroll loop ---------------------------------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const applied = new WeakMap<Element, Record<string, string>>();
    const setVar = (el: HTMLElement, name: string, value: string) => {
      let rec = applied.get(el);
      if (!rec) {
        rec = {};
        applied.set(el, rec);
      }
      if (rec[name] === value) return;
      rec[name] = value;
      el.style.setProperty(name, value);
    };

    // Elements that read the physical state (folder, lid, lettering, sidebar ...). They get the three
    // scroll numbers directly, so the (large) page text is never restyled while the folder moves.
    const drivers = Array.from(root.querySelectorAll<HTMLElement>("[data-drive]"));
    const sidebar = root.querySelector<HTMLElement>(".d-sidebar");

    const applyGeometry = () => {
      if (mode === "static") return;
      const g = geometry(mode);
      root.style.setProperty("--pw", `${g.pw}px`);
      root.style.setProperty("--ph", `${g.ph}px`);
      root.style.setProperty("--side", `${g.side}px`);
      root.style.setProperty("--ls", g.ls.toFixed(4));
      root.style.setProperty("--dip", g.dip.toFixed(4));
    };

    /** Scroll (in screens) -> the physical state. The ONLY place the stages are defined. */
    const drive = (u: number) => {
      const ra = clamp(u / ROTATE_SCREENS); // 0 landscape .. 1 portrait
      const sb = clamp((u - ROTATE_SCREENS) / SIDEBAR_SCREENS); // sidebar
      const op = clamp((u - ROTATE_SCREENS - SIDEBAR_SCREENS) / OPEN_SCREENS); // folder opening
      const sRa = ra.toFixed(4);
      const sSb = sb.toFixed(4);
      const sOp = op.toFixed(4);
      drivers.forEach((el) => {
        setVar(el, "--ra", sRa);
        setVar(el, "--sb", sSb);
        setVar(el, "--op", sOp);
      });
      if (sidebar) sidebar.dataset.on = sb > 0.01 ? "1" : "0";

      const stage =
        u <= 0.001 ? "landscape" : ra < 1 ? "turning" : op <= 0 ? "portrait" : op < 1 ? "opening" : "open";
      if (root.dataset.stage !== stage) root.dataset.stage = stage;
      if (op >= 0.999) root.setAttribute("data-settled", "");
      else root.removeAttribute("data-settled");
      return { ra, sb, op };
    };

    // -- cinematic --
    const pages = Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));
    let lastPage = -2;
    let lastAct: string | null | undefined;

    const updateCinematic = () => {
      const track = trackRef.current;
      if (!track) return;
      const vh = window.innerHeight;
      const u = clamp(-track.getBoundingClientRect().top / vh, 0, SCROLL_SCREENS);
      const { sb } = drive(u);
      if (sidebar) setVar(sidebar, "--gp", (u / SCROLL_SCREENS).toFixed(4));

      let current = -1;
      TIMELINE.forEach((p) => {
        const el = pages[p.index];
        if (!el) return;
        const t = (u - p.a) / p.w;
        const on = t > 0 && (t < 1 || p.last);
        const value = t <= 0 ? 0 : t >= 1 ? 1 : t;
        setVar(el, "--p", value.toFixed(4));
        const flag = on ? "true" : "false";
        if (el.dataset.active !== flag) el.dataset.active = flag;
        if (u >= p.a + OVERLAP / 2) current = p.index;
      });

      if (current !== lastPage) {
        lastPage = current;
        setActivePage(current);
      }
      // Before the first page, the sidebar is visible and the dossier is still closed: Introduction.
      const act = current >= 0 ? TIMELINE[current].act : sb > 0.5 ? ACTS[0].id : null;
      if (act !== lastAct) {
        lastAct = act;
        setActiveAct(act);
      }
    };

    // -- flow / static --
    const pending = new Set(Array.from(root.querySelectorAll<HTMLElement>("[data-write]")));
    const anchors = ACTS.map((a) => document.getElementById(a.id));

    const updateFlow = () => {
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const y = window.scrollY;
      const track = trackRef.current;
      let u = 0;

      if (mode === "flow" && track) {
        u = Math.max(0, -track.getBoundingClientRect().top / vh);
        drive(u);
        // Writing is tied to how far each element has risen into the viewport, and it never un-writes.
        pending.forEach((el) => {
          const top = el.getBoundingClientRect().top;
          const r = clamp((vh * 0.94 - top) / (vh * 0.3));
          if (r > 0) el.style.setProperty("--r", r.toFixed(3));
          if (r >= 1) pending.delete(el);
        });
      }
      if (sidebar) setVar(sidebar, "--gp", clamp(y / Math.max(doc.scrollHeight - vh, 1)).toFixed(4));

      let act: string | null = null;
      anchors.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= vh * 0.35) act = ACTS[i].id;
      });
      if (!act && mode === "flow" && u >= ROTATE_SCREENS + SIDEBAR_SCREENS * 0.5) act = ACTS[0].id;
      if (act !== lastAct) {
        lastAct = act;
        setActiveAct(act);
      }
    };

    if (mode === "static" && sidebar) sidebar.dataset.on = "1";

    const update = mode === "cinematic" ? updateCinematic : updateFlow;
    const schedule = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
      }
    };
    const onResize = () => {
      applyGeometry();
      schedule();
    };

    applyGeometry();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

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
    if (mode === "cinematic" && fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tiltRaf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      // Hand everything back to CSS: remove whatever the loop wrote.
      ["--pw", "--ph", "--side", "--ls", "--dip"].forEach((n) => root.style.removeProperty(n));
      drivers.forEach((el) =>
        ["--ra", "--sb", "--op", "--tx", "--ty", "--gp"].forEach((n) => el.style.removeProperty(n)),
      );
      root.removeAttribute("data-stage");
      root.removeAttribute("data-settled");
      root.querySelectorAll<HTMLElement>("[data-page]").forEach((el) => {
        el.style.removeProperty("--p");
        el.dataset.active = "false";
      });
      root.querySelectorAll<HTMLElement>("[data-write]").forEach((el) => el.style.removeProperty("--r"));
    };
  }, [mode]);

  // ---- fit: a sheet never clips its text --------------------------------------------------
  // The open folder's right panel is portrait, so dense pages get a slightly smaller type scale
  // (--fit, never below MIN_FIT). Measured from the real layout, so it adapts to any window size.
  useEffect(() => {
    if (mode !== "cinematic") return;
    const root = rootRef.current;
    if (!root) return;
    const sheets = Array.from(root.querySelectorAll<HTMLElement>("[data-page]"));
    let timer = 0;

    const run = () => {
      sheets.forEach((page) => {
        const sheet = page.querySelector<HTMLElement>(".d-sheet");
        if (!sheet) return;
        let f = 1;
        page.style.setProperty("--fit", "1");
        for (let i = 0; i < 4; i++) {
          // The tolerance covers the small "ink settling" offsets of text that is not yet written.
          if (sheet.scrollHeight - sheet.clientHeight <= 14) break;
          f = Math.max(MIN_FIT, f * (sheet.clientHeight / sheet.scrollHeight) * 0.98);
          page.style.setProperty("--fit", f.toFixed(3));
          if (f <= MIN_FIT) break;
        }
      });
    };
    const later = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, 140);
    };

    run();
    document.fonts?.ready.then(run);
    window.addEventListener("resize", later);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", later);
      sheets.forEach((page) => page.style.removeProperty("--fit"));
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

  const page = activePage >= 0 ? TIMELINE[activePage] : null;
  const act = page ? ACTS.find((a) => a.id === page.act) : null;
  const tab = act
    ? `${act.no} ${act.title} · ${String(page!.index + 1).padStart(2, "0")}/${String(PAGES.length).padStart(2, "0")}`
    : "Portfolio";
  const folio = page
    ? `${String(page.index + 1).padStart(2, "0")} / ${String(PAGES.length).padStart(2, "0")}`
    : "00 / " + String(PAGES.length).padStart(2, "0");

  return (
    <div className="d-root" ref={rootRef}>
      <Sidebar
        active={activeAct}
        onJump={jump}
        plain={mode === "static"}
        canToggle={!reduced}
        onTogglePlain={togglePlain}
        folio={folio}
      />
      <main id="main" className="dossier">
        <div id="top" />
        <div
          className="d-track"
          ref={trackRef}
          style={
            {
              "--total": TOTAL.toFixed(3),
              "--intro": FOLDER_SCREENS.toFixed(3),
            } as CSSProperties
          }
        >
          <div className="d-stage">
            <div className="d-object" ref={objectRef} data-drive>
              <span className="d-shadow" data-drive aria-hidden="true" />
              <div className="d-cover-wrap">{cover}</div>
              <div className="d-spacer" aria-hidden="true" />
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
