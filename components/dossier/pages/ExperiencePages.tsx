import Page from "../Page";
import Write from "../Write";
import { sequence } from "../sequence";
import { Bullets, Caption, RoleNote, TagList } from "../ui";
import { confidentialityNote, experience, type ExperienceEntry, type System } from "@/data/experience";

const iwsc = experience[0];
const seaker = experience[1];

function findSystem(job: ExperienceEntry, name: string): System {
  const system = job.systems.find((s) => s.name === name);
  if (!system) throw new Error(`Missing experience entry: ${name}`);
  return system;
}

const isSolo = (s: System) => s.label.toLowerCase().startsWith("independently");

/** Page 1 of the archive: the Inter-World role (left) and an index of the systems filed under it (right). */
export function ExperienceOverviewPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="exp-iwsc"
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="h2" className="d-act" {...l()}>
            <span className="d-act-no">02</span> Experience
          </Write>
          <Write as="p" className="d-kicker" {...l()}>
            Archive 01 · Professional / internship work
          </Write>
          <Write as="h3" className="d-title" {...l()}>
            {iwsc.role}
          </Write>
          <Write as="p" className="d-company" {...l()}>
            {iwsc.company}
          </Write>
          <Write as="p" className="d-meta" {...l()}>
            {`${iwsc.period} · ${iwsc.note}`}
          </Write>
          <Write as="p" className="d-p" {...l()}>
            {iwsc.summary ?? ""}
          </Write>
        </div>
      }
      right={
        <div className="d-stack">
          <Caption q={r}>Systems filed under this role</Caption>
          <ol className="d-index">
            {iwsc.systems.map((system, i) => (
              <li key={system.name}>
                <Write as="div" className="d-index-row" {...r()}>
                  <span className="d-index-no">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="d-index-name">{system.name}</span>
                    <span className={`d-index-label ${isSolo(system) ? "is-solo" : ""}`}>{system.label}</span>
                  </span>
                </Write>
              </li>
            ))}
          </ol>
          {iwsc.general && (
            <>
              <Caption q={r}>{iwsc.generalTitle ?? "Also in this role"}</Caption>
              <Bullets items={iwsc.general} q={r} />
            </>
          )}
        </div>
      }
    />
  );
}

/** One internal system: what it is and what it achieved (left), exactly what I did (right). */
export function SystemPage({
  pageId,
  job,
  systemName,
  entry,
  entries,
}: {
  pageId: string;
  job: ExperienceEntry;
  systemName: string;
  entry: number;
  entries: number;
}) {
  const system = findSystem(job, systemName);
  const l = sequence();
  const r = sequence();
  const solo = isSolo(system);
  return (
    <Page
      id={pageId}
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l()}>
            {`Archive entry ${String(entry).padStart(2, "0")} / ${String(entries).padStart(2, "0")} · ${job.company}`}
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...l()}>
            {system.name}
          </Write>
          <RoleNote q={l} solo={solo}>
            {system.label}
          </RoleNote>
          <Caption q={l}>What it is for</Caption>
          <Write as="p" className="d-p" {...l()}>
            {system.purpose}
          </Write>
          {system.impact && (
            <>
              <Caption q={l}>Impact</Caption>
              <Write as="p" className="d-p" {...l()}>
                {system.impact}
              </Write>
            </>
          )}
        </div>
      }
      right={
        <div className="d-stack">
          <Caption q={r}>My contribution</Caption>
          <Bullets items={system.contribution} q={r} />
          <TagList items={system.skills} label={`Technologies for ${system.name}`} q={r} />
        </div>
      }
    />
  );
}

/** SEAker System Technologies: the concurrent internship and the Marino World website. */
export function SeakerPage() {
  const system = findSystem(seaker, "Marino World Website & CMS");
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="exp-seaker"
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l()}>
            Archive 02 · Concurrent internship
          </Write>
          <Write as="h3" className="d-title" {...l()}>
            {seaker.role}
          </Write>
          <Write as="p" className="d-company" {...l()}>
            {seaker.company}
          </Write>
          <Write as="p" className="d-meta" {...l()}>
            {seaker.period}
          </Write>
          <Write as="p" className="d-p d-muted" {...l()}>
            {seaker.note ?? ""}
          </Write>
          <Write as="h3" className="d-title d-title-sub" {...l()}>
            {system.name}
          </Write>
          <RoleNote q={l}>{system.label}</RoleNote>
          <Write as="p" className="d-p" {...l()}>
            {system.purpose}
          </Write>
        </div>
      }
      right={
        <div className="d-stack">
          {system.impact && (
            <>
              <Caption q={r}>Impact</Caption>
              <Write as="p" className="d-p" {...r()}>
                {system.impact}
              </Write>
            </>
          )}
          <Caption q={r}>My contribution</Caption>
          <Bullets items={system.contribution} q={r} />
          <TagList items={system.skills} label={`Technologies for ${system.name}`} q={r} />
        </div>
      }
    />
  );
}

/** The Recruitment Management System (workflow design only) and the marketing work. */
export function RecruitmentPage() {
  const recruitment = findSystem(seaker, "Recruitment Management System");
  const marketing = findSystem(seaker, "Digital Marketing & Content");
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="exp-recruitment"
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l()}>
            Archive 02 · Entry 02 / 03
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...l()}>
            {recruitment.name}
          </Write>
          <RoleNote q={l}>{recruitment.label}</RoleNote>
          <Write as="p" className="d-p" {...l()}>
            {recruitment.purpose}
          </Write>
          <Caption q={l}>My contribution</Caption>
          <Bullets items={recruitment.contribution} q={l} />
        </div>
      }
      right={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...r()}>
            Archive 02 · Entry 03 / 03
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...r()}>
            {marketing.name}
          </Write>
          <RoleNote q={r}>{marketing.label}</RoleNote>
          <Write as="p" className="d-p" {...r()}>
            {marketing.purpose}
          </Write>
          <Caption q={r}>My contribution</Caption>
          <Bullets items={marketing.contribution} q={r} />
          <TagList items={marketing.skills} label="Tools" q={r} />
        </div>
      }
    />
  );
}

export const experienceJobs = { iwsc, seaker };
export type { ExperienceEntry };
