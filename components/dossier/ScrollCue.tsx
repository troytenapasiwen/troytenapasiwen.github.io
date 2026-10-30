"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { ACTS } from "./timeline";
import "./flow.css";

/**
 * Scroll-down cues. This file only switches two attributes; the look is in flow.css.
 *
 * 1. Section cue. When a section opens (the first spread of an act, and the introduction after the folder opens) and
 *    the page has been drawn, a small "Scroll" mark appears at the foot of the sheet. It fades as soon as a turn begins
 *    (the engine reports `busy` from the first moment of a turn), so it is gone before the page has moved.
 *    Desktop shows it on the right half of the spread; phones show it on the half-page that opens the section.
 * 2. Overflow cue. A half-page whose text is taller than the room scrolls inside itself. Its body shows a soft fade and
 *    a chevron until it has been scrolled, then the cue fades out.
 *
 * Nothing here listens to wheel, touch or keys, adds an element to the page or takes pointer events, so it cannot
 * interfere with turning pages or with scrolling.
 */
export function useScrollCues(
  rootRef: RefObject<HTMLElement | null>,
  { mode, idx, last, busy }: { mode: "spread" | "single" | "static"; idx: number; last: number; busy: boolean },
) {
  // 1. section cue
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const surfaces = Array.from(root.querySelectorAll<HTMLElement>(".d-surface"));
    surfaces.forEach((el) => {
      if (el.getAttribute("data-cue") === "on") el.setAttribute("data-cue", "off");
    });
    if (mode === "static" || idx <= 0 || idx >= last || busy) return;
    const sheet = mode === "spread" ? (idx - 1) * 2 + 1 : idx - 1;
    const page = sheet >> 1;
    const opens = ACTS.some((a) => a.first === page);
    if (!opens) return;
    // in the single layout only the half that opens the section carries the cue (the left half)
    if (mode === "single" && (sheet & 1) === 1) return;
    surfaces.find((el) => el.dataset.surface === String(sheet))?.setAttribute("data-cue", "on");
  }, [rootRef, mode, idx, last, busy]);

  // 2. overflow cue
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode === "static") return;
    const onScroll = (e: Event) => {
      const body = e.target as HTMLElement | null;
      if (!body?.classList?.contains("d-body")) return;
      if (body.scrollTop > 6) body.setAttribute("data-scrolled", "");
      else if (body.scrollTop < 2) body.removeAttribute("data-scrolled");
    };
    // scroll events do not bubble, so listen in the capture phase on the folder
    root.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => root.removeEventListener("scroll", onScroll, { capture: true });
  }, [rootRef, mode]);
}
