import Page from "../Page";
import Write from "../Write";
import { sequence } from "../sequence";
import { MarketingArt, Plate, SoftwareArt } from "../illustrations";
import { Mark } from "../evidence";
import { Hold } from "./DividerPages";
import type { ExperienceEntry } from "@/data/experience";
import "../flow.css";

/**
 * Introduction spread for one internship role, placed before the systems and work filed under it.
 * Everything written here is the role's own data (employer, dates, note, summary); only the plate is new.
 * The first role has its plate on the left and its text on the right; the second is the mirror image, so the two
 * introductions read as a pair but are never the same spread twice.
 */
export function RoleIntroPage({
  pageId,
  job,
  position,
  of,
  plate,
}: {
  pageId: string;
  job: ExperienceEntry;
  position: number;
  of: number;
  plate: "software" | "marketing";
}) {
  const l = sequence();
  const r = sequence();
  const plateFirst = plate === "software";
  const q = plateFirst ? l : r; // the plate's sequence
  const t = plateFirst ? r : l; // the text's sequence

  const art = (
    <div className="ri-left">
      <Hold ms={1800} />
      <Plate
        q={q}
        label={
          plate === "software"
            ? "A code editor with lines being written, an interface wireframe, a data store and a short run of checks"
            : "A poster laid out on a canvas, a content calendar filling in, a site window with a publish mark, and a process flow"
        }
        fig={`Role ${String(position).padStart(2, "0")}`}
        caption={job.role}
      >
        {plate === "software" ? <SoftwareArt /> : <MarketingArt />}
      </Plate>
    </div>
  );

  const text = (
    <div className="ri-text">
      <Write as="p" className="ri-count" {...t(20)}>
        {`Internship ${String(position).padStart(2, "0")} of ${String(of).padStart(2, "0")}`}
      </Write>
      <Write as="div" className="d-employer" {...t(60)}>
        {job.logo && <Mark logo={job.logo} />}
        <span className="d-employer-text">
          <span className="d-company">{job.company}</span>
          <span className="d-meta">{job.period}</span>
        </span>
      </Write>
      <Write as="h2" className="ri-role" {...t(job.role.length * 2)}>
        {job.role}
      </Write>
      {job.note && (
        <Write as="p" className={job.summary ? "d-meta" : "d-p d-muted"} {...t(job.note.length)}>
          {job.note}
        </Write>
      )}
      {job.summary && (
        <Write as="p" className="d-p" {...t(job.summary.length)}>
          {job.summary}
        </Write>
      )}
    </div>
  );

  return <Page id={pageId} left={plateFirst ? art : text} right={plateFirst ? text : art} />;
}
