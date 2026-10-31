import type { CSSProperties, ReactNode } from "react";
import { site } from "@/data/site";
import { ACTS, PAGES } from "./timeline";

/**
 * One page of the dossier = one spread: a LEFT half and a RIGHT half, each a physical sheet ("surface").
 *
 *   desktop  both halves are visible together; a leaf's front is a right half and its back is the next
 *            page's left half, so one turn reveals a whole new spread.
 *   phone    each half is its own sheet and turns on its own.
 *
 * The markup is identical in every presentation; globals.css and Dossier.tsx decide where each surface
 * sits and how it turns. Every surface has the same three regions, in normal document flow, so nothing
 * can overlap:
 *
 *   header (.d-runhead)  ->  body (.d-body, takes the remaining height)  ->  footer (.d-runfoot)
 *
 * The first page of each act carries the id used by in-page links (#experience, ...).
 */
export default function Page({
  id,
  left,
  right,
  foot,
}: {
  id: string;
  left: ReactNode;
  right: ReactNode;
  foot?: ReactNode;
}) {
  const index = PAGES.findIndex((p) => p.id === id);
  if (index < 0) throw new Error(`Unknown dossier page: ${id}`);
  const act = ACTS.find((a) => a.id === PAGES[index].act)!;
  const folio = String(index + 1).padStart(2, "0");
  const total = String(PAGES.length).padStart(2, "0");
  const first = act.first === index;
  const label = `${act.title}, page ${index + 1} of ${PAGES.length}`;

  const surface = (side: "l" | "r", content: ReactNode) => (
    <section
      id={side === "l" && first ? act.id : undefined}
      className="d-surface"
      data-surface={index * 2 + (side === "l" ? 0 : 1)}
      data-side={side}
      data-page={index}
      data-active="false"
      data-rv="done"
      style={{ "--n": index * 2 + (side === "l" ? 0 : 1) } as CSSProperties}
      aria-label={`${label}, ${side === "l" ? "left" : "right"} half`}
    >
      <div className="d-face">
        <div className="d-sheet" data-pid={id} data-folio={folio} data-act={act.no} data-tone={side === "l" && (id === "intro" || id === "contact") ? "ink" : undefined} style={{ "--act": Number(act.no) } as CSSProperties}>
          <div className="d-runhead" aria-hidden="true">
            <span className="d-rh-a">{site.name} · Portfolio dossier</span>
            <span className="d-rh-b">
              {act.no} {act.title} · p.{folio}/{total}
            </span>
          </div>
          <div className="d-body">{content}</div>
          <div className="d-runfoot">
            {side === "l" ? (
              <span aria-hidden="true">{site.domain}</span>
            ) : foot ? (
              <span className="d-runfoot-note">{foot}</span>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
      <span className="d-dim" aria-hidden="true" />
      <span className="d-shade" aria-hidden="true" />
      <span className="d-cast" aria-hidden="true" />
      <div className="d-back" aria-hidden="true" />
    </section>
  );

  return (
    <div className="d-page">
      {surface("l", left)}
      {surface("r", right)}
    </div>
  );
}
