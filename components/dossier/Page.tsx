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
