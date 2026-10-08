#!/usr/bin/env bash
# Run from the project root (the folder that contains package.json).
set -e
[ -f package.json ] || { echo "Run this from the project root (package.json not found)."; exit 1; }
mkdir -p "components/dossier"
cat > 'components/dossier/timeline.ts' <<'EOF'
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
EOF
echo "wrote components/dossier/timeline.ts"
mkdir -p "components/dossier"
cat > 'components/dossier/sequence.ts' <<'EOF'
/**
 * Plans the order in which the items on one page get "written".
 *
 * Each call returns { s, d }: the page progress (0..1) at which an item starts
 * being written, and how long the writing takes. Longer text takes a little longer,
 * and the next item starts before the previous one is finished so the page is
 * authored in one flowing motion rather than item by item.
 */
export type Seq = (length: number | string) => { s: number; d: number };

export function sequence(start = 0.06, overlap = 0.5, pace = 1.3): Seq {
  let cursor = start;
  return (length) => {
    const n = typeof length === "string" ? length.length : length;
    // `pace` stretches the whole page: short pages use a larger value so they still take a moment to write.
    const d = Math.min(0.26, (0.03 + n / 4200) * pace);
    const s = cursor;
    cursor = s + d * (1 - overlap);
    return { s, d };
  };
}
EOF
echo "wrote components/dossier/sequence.ts"
mkdir -p "components/dossier"
cat > 'components/dossier/Write.tsx' <<'EOF'
import { Fragment } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Write: the one primitive behind every "being written onto the page" effect.
 *
 * It does no animating itself. It only declares *when* in a page's progress it
 * should be written (s = start, d = duration, both 0..1). CSS in globals.css turns
 * that into a `--r` value (0 → 1) and the modes below style themselves from it:
 *
 *   words  each word settles into place, a touch of accent "wet ink" fading to text colour
 *   line   a masked left-to-right wipe with a thin pen mark at the writing edge (headings)
 *   block  fade and rise (generic blocks)
 *   stamp  a small label that is pressed onto the page
 *
 * It renders plain, static markup, so it works as a server component and the full text
 * is always in the HTML (SEO, no-JS, reduced motion, screen readers).
 */

type Mode = "words" | "line" | "block" | "stamp";

type WriteProps = {
  as?: ElementType;
  mode?: Mode;
  s: number;
  d: number;
  className?: string;
  id?: string;
  children: ReactNode;
};

export function timing(s: number, d: number): CSSProperties {
  return { "--s": s.toFixed(3), "--k": (1 / d).toFixed(3) } as CSSProperties;
}

export default function Write({
  as: Tag = "p",
  mode = "words",
  s,
  d,
  className = "",
  id,
  children,
}: WriteProps) {
  const cls = `write write-${mode} ${className}`.trim();

  if (mode === "words" && typeof children === "string") {
    const words = children.split(" ");
    const last = Math.max(words.length - 1, 1);
    return (
      <Tag className={cls} style={timing(s, d)} data-write="" id={id}>
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className="w"
              style={{ "--i": (i / last).toFixed(3) } as CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </Tag>
    );
  }

  if (mode === "line") {
    return (
      <Tag className={cls} style={timing(s, d)} data-write="" id={id}>
        <span className="ink">{children}</span>
      </Tag>
    );
  }

  return (
    <Tag className={cls} style={timing(s, d)} data-write="" id={id}>
      {children}
    </Tag>
  );
}

/** A hairline that is drawn across the page. */
export function Rule({ s, d, className = "" }: { s: number; d: number; className?: string }) {
  return (
    <div
      className={`write write-rule d-rule ${className}`.trim()}
      style={timing(s, d)}
      data-write=""
      aria-hidden="true"
    />
  );
}
EOF
echo "wrote components/dossier/Write.tsx"
mkdir -p "components/dossier"
cat > 'components/dossier/Page.tsx' <<'EOF'
import type { CSSProperties, ReactNode } from "react";
import { site } from "@/data/site";
import { ACTS, PAGES, TIMELINE } from "./timeline";

/**
 * One sheet of the dossier.
 *
 * Desktop: sheets are stacked in the same spot and the scroll engine fades each one
 * in and out (CSS reads --p, the page's own progress).
 * Mobile / tablet / plain view: sheets are ordinary blocks in the document flow.
 *
 * The first sheet of each act carries the id used by navigation (#about, #experience, ...).
 */
export default function Page({
  id,
  children,
  foot,
}: {
  id: string;
  children: ReactNode;
  foot?: ReactNode;
}) {
  const timing = TIMELINE.find((p) => p.id === id);
  if (!timing) throw new Error(`Unknown dossier page: ${id}`);
  const act = ACTS.find((a) => a.id === timing.act)!;
  const folio = String(timing.index + 1).padStart(2, "0");
  const total = String(PAGES.length).padStart(2, "0");

  return (
    <section
      id={timing.first ? act.id : undefined}
      className="d-page"
      data-page={timing.index}
      data-active="false"
      data-last={timing.last ? "true" : "false"}
      aria-label={`${act.title}, page ${timing.index + 1} of ${PAGES.length}`}
      style={{ "--ov": timing.ov.toFixed(4) } as CSSProperties}
    >
      <div className="d-sheet">
        <div className="d-runhead" aria-hidden="true">
          <span>{site.name} · Portfolio dossier</span>
          <span>
            {act.no} {act.title} · p.{folio}/{total}
          </span>
        </div>
        <div className="d-body">{children}</div>
        <div className="d-runfoot">
          <span aria-hidden="true">{site.domain}</span>
          {foot ? <span className="d-runfoot-note">{foot}</span> : null}
        </div>
      </div>
    </section>
  );
}
EOF
echo "wrote components/dossier/Page.tsx"
mkdir -p "components/dossier"
cat > 'components/dossier/ui.tsx' <<'EOF'
import type { CSSProperties, ReactNode } from "react";
import Write, { timing } from "./Write";
import type { Seq } from "./sequence";

/** A list whose bullets are each written in turn. */
export function Bullets({ items, q }: { items: string[]; q: Seq }) {
  return (
    <ul className="d-bullets">
      {items.map((text) => (
        <Write key={text} as="li" mode="words" {...q(text)}>
          {text}
        </Write>
      ))}
    </ul>
  );
}

/** Technology tags that are set onto the page one after another. */
export function TagList({
  items,
  label,
  q,
}: {
  items: string[];
  label: string;
  q: Seq;
}) {
  if (items.length === 0) return null;
  const { s, d } = q(items.length * 8);
  const last = Math.max(items.length - 1, 1);
  return (
    <ul
      className="write write-stagger d-tags"
      style={timing(s, d)}
      data-write=""
      aria-label={label}
    >
      {items.map((item, i) => (
        <li
          key={item}
          className="d-tag"
          style={{ "--i": (i / last).toFixed(3) } as CSSProperties}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Small mono caption above a block of text. */
export function Caption({ q, children }: { q: Seq; children: string }) {
  return (
    <Write as="h4" mode="line" className="d-caption" {...q(children)}>
      {children}
    </Write>
  );
}

/**
 * States exactly what my role was. This is how the portfolio keeps
 * "contributed to" and "independently developed" clearly apart.
 */
export function RoleNote({
  q,
  solo = false,
  children,
}: {
  q: Seq;
  solo?: boolean;
  children: string;
}) {
  return (
    <Write
      as="p"
      mode="block"
      className={`d-rolenote ${solo ? "d-rolenote-solo" : ""}`}
      {...q(children)}
    >
      {children}
    </Write>
  );
}

export function Stamp({
  q,
  children,
}: {
  q: Seq;
  children: ReactNode;
}) {
  return (
    <Write as="p" mode="stamp" className="d-stamp" {...q(18)}>
      {children}
    </Write>
  );
}
EOF
echo "wrote components/dossier/ui.tsx"
mkdir -p "components/dossier"
cat > 'components/dossier/Topbar.tsx' <<'EOF'
"use client";

import { useEffect, useRef } from "react";
import { navItems, site } from "@/data/site";
import ThemeToggle from "@/components/layout/ThemeToggle";

type Props = {
  active: string | null;
  onJump: (id: string) => void;
  plain: boolean;
  canToggle: boolean;
  onTogglePlain: () => void;
};

/** Always-visible navigation: where you are, where else you can go, and a way to skip the animation. */
export default function Topbar({ active, onJump, plain, canToggle, onTogglePlain }: Props) {
  const navRef = useRef<HTMLElement>(null);

  // On narrow screens the nav scrolls sideways; keep the current section in view.
  useEffect(() => {
    if (!active) return;
    navRef.current
      ?.querySelector('[aria-current="location"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  return (
    <header className="d-topbar">
      <div className="d-topbar-inner">
        <a
          href="#top"
          className="d-brand"
          aria-label={`${site.name}, back to the start`}
          onClick={(e) => {
            e.preventDefault();
            onJump("top");
          }}
        >
          {site.name}
        </a>

        <nav ref={navRef} aria-label="Sections" className="d-nav">
          <ul>
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onJump(item.id);
                  }}
                >
                  <span className="d-nav-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="d-tools">
          {canToggle && (
            <button
              type="button"
              className="d-toggle"
              aria-pressed={plain}
              onClick={onTogglePlain}
              title={plain ? "Switch to the animated dossier" : "Show everything as a plain document"}
            >
              {plain ? "Animated view" : "Plain view"}
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
      <div className="d-progress" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}
EOF
echo "wrote components/dossier/Topbar.tsx"
mkdir -p "components/dossier"
cat > 'components/dossier/Dossier.tsx' <<'EOF'
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
EOF
echo "wrote components/dossier/Dossier.tsx"
