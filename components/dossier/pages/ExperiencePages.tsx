import Page from "../Page";
import Write from "../Write";
import { sequence } from "../sequence";
import { Bullets, Caption, RoleNote, TagList } from "../ui";
import { StackList } from "../stack";
import { EvidenceFigure, NoteBlock, RelationTag, SiteShowcase } from "../evidence";
import { ContentPublishIcon, RecruitmentFlowIcon } from "@/components/ui/WorkIcons";
import { confidentialityNote, experience, type ExperienceEntry, type System } from "@/data/experience";

const iwsc = experience[0];
const seaker = experience[1];

function findSystem(job: ExperienceEntry, name: string): System {
  const system = job.systems.find((s) => s.name === name);
  if (!system) throw new Error(`Missing experience entry: ${name}`);
  return system;
}

const isSolo = (s: System) => s.label.toLowerCase().startsWith("independently");

/**
 * First page after the Inter-World introduction: an index of the systems filed under the role (left) and the
 * other work done in it (right). The employer, dates and summary are on the introduction spread (RoleIntroPages.tsx).
 */
export function ExperienceOverviewPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="exp-iwsc"
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l(40)}>
            {iwsc.company}
          </Write>
          <Write as="h3" className="d-title" {...l(iwsc.role.length)}>
            {iwsc.role}
          </Write>
          <Caption q={l}>Systems filed under this role</Caption>
          <ol className="d-index">
            {iwsc.systems.map((system, i) => (
              <li key={system.name}>
                <Write as="div" className="d-index-row" {...l(60)}>
                  <span className="d-index-no">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="d-index-name">{system.name}</span>
                    <span className={`d-index-label ${isSolo(system) ? "is-solo" : ""}`}>{system.label}</span>
                  </span>
                </Write>
              </li>
            ))}
          </ol>
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
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

/**
 * One internal system. Left: what it is and the evidence (the login screen, with its note).
 * Right: what it is for, what it achieved, and exactly what I did.
 */
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
  const ev = system.evidence;
  return (
    <Page
      id={pageId}
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l(50)}>
            {`Entry ${String(entry).padStart(2, "0")} of ${String(entries).padStart(2, "0")}, ${job.company}`}
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...l(system.name.length)}>
            {system.name}
          </Write>
          <RoleNote q={l} solo={solo}>
            {system.label}
          </RoleNote>
          {ev?.relation && <RelationTag text={ev.relation} q={l} />}
          {ev?.figures[0] && <EvidenceFigure figure={ev.figures[0]} q={l} />}
          {ev?.note && <NoteBlock note={ev.note} q={l} />}
        </div>
      }
      right={
        <div className="d-stack">
          <Caption q={r}>What it is for</Caption>
          <Write as="p" className="d-p" {...r(system.purpose.length)}>
            {system.purpose}
          </Write>
          {system.impact && (
            <>
              <Caption q={r}>Impact</Caption>
              <Write as="p" className="d-p" {...r(system.impact.length)}>
                {system.impact}
              </Write>
            </>
          )}
          <Caption q={r}>My contribution</Caption>
          <Bullets items={system.contribution} q={r} />
          {system.stack ? <StackList stack={system.stack} label={`Technologies for ${system.name}`} q={r} /> : <TagList items={system.skills} label={`Technologies for ${system.name}`} q={r} />}
        </div>
      }
    />
  );
}

/** SEAker System Technologies: an index of what was filed under the role, and the Marino World entry. The company and dates are on the introduction spread. */
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
          <Write as="p" className="d-kicker" {...l(40)}>
            Concurrent internship
          </Write>
          <Write as="p" className="d-kicker" {...l(40)}>
            {seaker.company}
          </Write>
          <Write as="h3" className="d-title" {...l(seaker.role.length)}>
            {seaker.role}
          </Write>
          <Caption q={l}>Filed under this role</Caption>
          <ol className="d-index">
            {seaker.systems.map((s, i) => (
              <li key={s.name}>
                <Write as="div" className="d-index-row" {...l(60)}>
                  <span className="d-index-no">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="d-index-name">{s.name}</span>
                    <span className="d-index-label">{s.label}</span>
                  </span>
                </Write>
              </li>
            ))}
          </ol>
        </div>
      }
      right={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...r(30)}>
            Entry 01 of 03
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...r(system.name.length)}>
            {system.name}
          </Write>
          <RoleNote q={r}>{system.label}</RoleNote>
          <Write as="p" className="d-p" {...r(system.purpose.length)}>
            {system.purpose}
          </Write>
          {system.impact && (
            <>
              <Caption q={r}>Impact</Caption>
              <Write as="p" className="d-p" {...r(system.impact.length)}>
                {system.impact}
              </Write>
            </>
          )}
        </div>
      }
    />
  );
}

/** Marino World, shown as the real website: two views of one site (left), and what I contributed (right). */
export function MarinoPage() {
  const system = findSystem(seaker, "Marino World Website & CMS");
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="exp-marino"
      foot={confidentialityNote}
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l(40)}>
            Partner website
          </Write>
          <Write as="h3" className="d-title" {...l(system.name.length)}>
            {system.name}
          </Write>
          {system.evidence && <SiteShowcase figures={system.evidence.figures} q={l} />}
          {system.stack ? <StackList stack={system.stack} label={`Technologies for ${system.name}`} q={l} /> : <TagList items={system.skills} label={`Technologies for ${system.name}`} q={l} />}
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
          <Caption q={r}>My contribution</Caption>
          <Bullets items={system.contribution} q={r} />
        </div>
      }
    />
  );
}

/** The Recruitment Management System (workflow design only) and the marketing work, each with a small pictogram. */
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
          <Write as="div" className="d-pictogram" {...l(30)}>
            <RecruitmentFlowIcon className="d-pictogram-icon" />
            <span>
              <span className="d-kicker">Entry 02 of 03</span>
              <span className="d-pictogram-cap">Process and workflow design</span>
            </span>
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...l(recruitment.name.length)}>
            {recruitment.name}
          </Write>
          <RoleNote q={l}>{recruitment.label}</RoleNote>
          <Write as="p" className="d-p" {...l(recruitment.purpose.length)}>
            {recruitment.purpose}
          </Write>
          <Caption q={l}>My contribution</Caption>
          <Bullets items={recruitment.contribution} q={l} />
        </div>
      }
      right={
        <div className="d-stack">
          <Write as="div" className="d-pictogram" {...r(30)}>
            <ContentPublishIcon className="d-pictogram-icon" />
            <span>
              <span className="d-kicker">Entry 03 of 03</span>
              <span className="d-pictogram-cap">Social media content and visual design</span>
            </span>
          </Write>
          <Write as="h3" className="d-title d-title-lg" {...r(marketing.name.length)}>
            {marketing.name}
          </Write>
          <RoleNote q={r}>{marketing.label}</RoleNote>
          <Write as="p" className="d-p" {...r(marketing.purpose.length)}>
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
