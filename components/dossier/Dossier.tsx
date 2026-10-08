"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Topbar from "./Topbar";
import {
  ACTS,
  FOLDER_SCREENS,
  OVERLAP,
  PAGES,
  SCROLL_SCREENS,
  TIMELINE,
  TOTAL,
  actById,
  actJumpTarget,
} from "./timeline";

/**
 * The scroll engine.
 *
 * Three presentations share one set of markup. <html data-dm="..."> (set before first paint by
 * the inline script in layout.tsx) selects which CSS applies:
 *
 *   cinematic  desktop: the folder and pages are pinned in one sticky stage. Scroll position
 *              is turned into progress values that CSS reads to open the folder and to write
 *              and turn each page.
 *   flow       phones / tablets / short windows: the cover opens as you scroll, then the pages
 *              slide up over it as normal sheets; each element is written as it enters view.
 *   static     reduced motion, or the "Plain view" button: a normal document, nothing animates.
 *
 * All the JavaScript does is write a few CSS custom properties (--f, --p, --r, --gp) from the
 * scroll position, at most once per animation frame. The visuals themselves are CSS.
 */

type Mode = "cinematic" | "flow" | "static";

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

function detectMode(): Mode {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let plain = false;
  try {
    plain = localStorage.getItem("dossier-view") === "plain";
  } catch {
    // Storage can be blocked; fall through to the automatic choice.
  }
  if (reduced || plain) return "static";
  return window.matchMedia("(min-width: 1024px) and (min-height: 620px)").matches
    ? "cinematic"
    : "flow";
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
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };
    apply();
    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(min-width: 1024px) and (min-height: 620px)"),
    ];
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

  // ---- the scroll loop ---------------------------------------------------------------------
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const cache = new Map<Element, string>();
    const setVar = (el: HTMLElement, name: string, value: string) => {
      if (cache.get(el) === name + value) return;
      cache.set(el, name + value);
      el.style.setProperty(name, value);
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
      const f = clamp(u / FOLDER_SCREENS);

      root.style.setProperty("--f", f.toFixed(4));
      root.style.setProperty("--gp", (u / SCROLL_SCREENS).toFixed(4));
      if (f >= 0.17) root.setAttribute("data-opened", "");
      else root.removeAttribute("data-opened");

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
      const act = current >= 0 ? TIMELINE[current].act : null;
      if (act !== lastAct) {
        lastAct = act;
        setActiveAct(act);
      }
    };

    // -- flow --
    const pending = new Set(Array.from(root.querySelectorAll<HTMLElement>("[data-write]")));
    const anchors = ACTS.map((a) => document.getElementById(a.id));

    const updateFlow = () => {
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const y = window.scrollY;

      root.style.setProperty("--gp", clamp(y / Math.max(doc.scrollHeight - vh, 1)).toFixed(4));

      if (mode === "flow") {
        root.style.setProperty("--f", clamp(y / (vh * 0.9)).toFixed(4));
        // Writing is tied to how far each element has risen into the viewport, and it never un-writes.
        pending.forEach((el) => {
          const top = el.getBoundingClientRect().top;
          const r = clamp((vh * 0.94 - top) / (vh * 0.3));
          if (r > 0) el.style.setProperty("--r", r.toFixed(3));
          if (r >= 1) pending.delete(el);
        });
      }

      let act: string | null = null;
      anchors.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= vh * 0.35) act = ACTS[i].id;
      });
      if (act !== lastAct) {
        lastAct = act;
        setActiveAct(act);
      }
    };

    const update = mode === "cinematic" ? updateCinematic : updateFlow;
    const schedule = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Gentle pointer tilt on the whole dossier (desktop with a mouse only).
    const obj = objectRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let tiltRaf = 0;
    const onMove = (e: PointerEvent) => {
      if (!obj || tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = 0;
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        obj.style.setProperty("--tx", nx.toFixed(3));
        obj.style.setProperty("--ty", ny.toFixed(3));
      });
    };
    if (mode === "cinematic" && fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tiltRaf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onMove);
      // Hand the pages back to CSS: remove everything the loop wrote.
      root.style.removeProperty("--f");
      root.style.removeProperty("--gp");
      root.removeAttribute("data-opened");
      root.querySelectorAll<HTMLElement>("[data-page]").forEach((el) => {
        el.style.removeProperty("--p");
        el.dataset.active = "false";
      });
      root.querySelectorAll<HTMLElement>("[data-write]").forEach((el) => el.style.removeProperty("--r"));
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
    : "Closed";

  return (
    <div className="d-root" ref={rootRef}>
      <Topbar
        active={activeAct}
        onJump={jump}
        plain={mode === "static"}
        canToggle={!reduced}
        onTogglePlain={togglePlain}
      />
      <main id="main" className="dossier">
        <div id="top" />
        <div
          className="d-track"
          ref={trackRef}
          style={{ "--total": TOTAL.toFixed(3) } as CSSProperties}
        >
          <div className="d-stage">
            <div className="d-object" ref={objectRef}>
              <div className="d-cover-wrap">{cover}</div>
              <div className="d-frame">
                <span className="d-frame-tab" aria-hidden="true">
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
