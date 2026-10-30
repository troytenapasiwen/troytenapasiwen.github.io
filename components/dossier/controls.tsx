"use client";

import { createContext } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, FileText, LayoutPanelTop } from "lucide-react";

/**
 * Controls for the dossier. Every one of them (wheel, touch, keyboard, these buttons) asks the same engine for
 * the same single step, so they can never disagree about where the folder is or how a page is revealed.
 */

export type Dir = "next" | "prev";

type Ctx = { go: (dir: Dir) => void; togglePlain: () => void; plain: boolean; canSwitch: boolean };
export const DossierControls = createContext<Ctx>({ go: () => {}, togglePlain: () => {}, plain: false, canSwitch: true });

/**
 * The invitation on the desk below the closed folder: a quiet label and a line that draws downward. It is a real
 * button (so keyboard and screen-reader users can use it) but it is not a call to action: scrolling already opens
 * the folder. It fades away as soon as the folder starts to move.
 */
export function ScrollCue({ ended, onGo }: { ended: boolean; onGo: () => void }) {
  return (
    <button type="button" className="d-cue" data-ended={ended ? "1" : "0"} onClick={onGo}>
      <span className="d-cue-text">{ended ? "Scroll to reopen" : "Scroll to explore"}</span>
      <span className="d-cue-line" aria-hidden="true">
        <ArrowDown className="size-3.5" />
      </span>
    </button>
  );
}

/** Previous / next, the current page and a row of ticks. Shown once the folder has been opened. */
export function Dock({
  hidden,
  page,
  total,
  title,
  closed,
  nextLabel,
  canPrev,
  canNext,
  busy,
  onGo,
}: {
  hidden: boolean;
  /** The page being shown, or being turned to. Past the last page (`total`) the folder is closed at the end. */
  page: number;
  total: number;
  title: string;
  /** The folder is closed, or is closing: the label says so instead of naming a page. */
  closed: boolean;
  nextLabel: string;
  canPrev: boolean;
  canNext: boolean;
  busy: boolean;
  onGo: (dir: Dir) => void;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <nav className="d-dock" aria-label="Page navigation" hidden={hidden} data-busy={busy ? "1" : "0"}>
      <button
        type="button"
        className="d-dock-btn d-dock-prev"
        onClick={() => onGo("prev")}
        aria-label="Previous page"
        aria-disabled={!canPrev}
        disabled={!canPrev}
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </button>
      <div className="d-dock-read">
        <p className="d-dock-now" aria-live="polite" aria-atomic="true">
          <span className="sr-only">{closed ? "Folder closed" : `Page ${page + 1} of ${total}, ${title}`}</span>
          <span aria-hidden="true">
            {closed ? (
              "Closed"
            ) : (
              <>
                {pad(page + 1)}/{pad(total)}
                <span className="d-dock-title"> {title}</span>
              </>
            )}
          </span>
        </p>
        <span className="d-ticks" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <i key={i} data-on={i === page ? "1" : i < page ? "p" : "0"} />
          ))}
        </span>
      </div>
      <button
        type="button"
        className="d-dock-btn d-dock-next"
        onClick={() => onGo("next")}
        aria-label={nextLabel}
        aria-disabled={!canNext}
        disabled={!canNext}
      >
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
    </nav>
  );
}

/**
 * Quiet hints just outside the left and right edges of the open folder: scrolling turns its pages. They have no
 * state of their own: the engine shows them (data-hint on the root) only while the folder is open and at rest.
 */
export function ScrollHints() {
  return (
    <div className="d-hints" aria-hidden="true">
      {(["l", "r"] as const).map((side) => (
        <span key={side} className={`d-hint d-hint-${side}`}>
          <ChevronUp className="d-hint-up" />
          <i className="d-hint-rail" />
          <ChevronDown className="d-hint-down" />
        </span>
      ))}
    </div>
  );
}

/** Switches between the folder and the plain reading edition. Used by the folder and by the edition's masthead. */
export function ViewSwitch({ plain, onClick, className = "" }: { plain: boolean; onClick: () => void; className?: string }) {
  return (
    <button type="button" className={`d-toggle ${className}`.trim()} aria-pressed={plain} onClick={onClick}>
      {plain ? <LayoutPanelTop className="size-4" aria-hidden="true" /> : <FileText className="size-4" aria-hidden="true" />}
      <span className="d-toggle-text">{plain ? "Folder view" : "Plain view"}</span>
    </button>
  );
}
