import Page from "../Page";
import Write from "../Write";
import { sequence } from "../sequence";
import { Bullets, Caption, RoleNote, TagList } from "../ui";
import {
  confidentialityNote,
  experience,
  type ExperienceEntry,
  type System,
} from "@/data/experience";

const iwsc = experience[0];
const seaker = experience[1];

function findSystem(job: ExperienceEntry, name: string): System {
  const system = job.systems.find((s) => s.name === name);
  if (!system) throw new Error(`Missing experience entry: ${name}`);
  return system;
}

const isSolo = (s: System) => s.label.toLowerCase().startsWith("independently");

/** Page 1 of the archive: the Inter-World role and an index of the systems filed under it. */
export function ExperienceOverviewPage() {
  const q = sequence(0.06);
  return (
    <Page id="exp-iwsc" foot={confidentialityNote}>
      <div className="d-cols">
        <div className="d-col">
          <Write as="h2" mode="line" className="d-act" {...q(10)}>
            <span className="d-act-no">02</span> Experience
          </Write>
          <Write as="p" mode="line" className="d-kicker" {...q(30)}>
            Archive 01 · Professional / internship work
          </Write>
          <Write as="h3" mode="line" className="d-title" {...q(26)}>
            {iwsc.role}
          </Write>
          <Write as="p" mode="words" className="d-company" {...q(iwsc.company)}>
            {iwsc.company}
          </Write>
          <Write as="p" mode="words" className="d-meta" {...q(30)}>
            {`${iwsc.period} · ${iwsc.note}`}
          </Write>
          <Write as="p" mode="words" className="d-p" {...q(iwsc.summary ?? "")}>
            {iwsc.summary ?? ""}
          </Write>
        </div>

        <div className="d-col">
          <Caption q={q}>Systems filed under this role</Caption>
          <ol className="d-index">
            {iwsc.systems.map((system, i) => (
              <li key={system.name}>
                <Write as="div" mode="block" className="d-index-row" {...q(system.name + system.label)}>
                  <span className="d-index-no">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="d-index-name">{system.name}</span>
                    <span className={`d-index-label ${isSolo(system) ? "is-solo" : ""}`}>
                      {system.label}
                    </span>
                  </span>
                </Write>
              </li>
            ))}
          </ol>
          {iwsc.general && (
            <>
              <Caption q={q}>{iwsc.generalTitle ?? "Also in this role"}</Caption>
              <Bullets items={iwsc.general} q={q} />
            </>
          )}
        </div>
      </div>
    </Page>
  );
}

/** One internal system: what it is, what it achieved, and exactly what I did. */
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
  const q = sequence(0.06);
  const solo = isSolo(system);
  return (
    <Page id={pageId} foot={confidentialityNote}>
      <div className="d-cols">
        <div className="d-col">
          <Write as="p" mode="line" className="d-kicker" {...q(40)}>
            {`Archive entry ${String(entry).padStart(2, "0")} / ${String(entries).padStart(2, "0")} · ${job.company}`}
          </Write>
          <Write as="h3" mode="line" className="d-title d-title-lg" {...q(system.name)}>
            {system.name}
          </Write>
          <RoleNote q={q} solo={solo}>
            {system.label}
          </RoleNote>
          <Caption q={q}>What it is for</Caption>
          <Write as="p" mode="words" className="d-p" {...q(system.purpose)}>
            {system.purpose}
          </Write>
          {system.impact && (
            <>
              <Caption q={q}>Impact</Caption>
              <Write as="p" mode="words" className="d-p" {...q(system.impact)}>
                {system.impact}
              </Write>
            </>
          )}
        </div>
        <div className="d-col">
          <Caption q={q}>My contribution</Caption>
          <Bullets items={system.contribution} q={q} />
          <TagList items={system.skills} label={`Technologies for ${system.name}`} q={q} />
        </div>
      </div>
    </Page>
  );
}

/** SEAker System Technologies: the concurrent internship and the Marino World website. */
export function SeakerPage() {
  const system = findSystem(seaker, "Marino World Website & CMS");
  const q = sequence(0.06);
  return (
    <Page id="exp-seaker" foot={confidentialityNote}>
      <div className="d-cols">
        <div className="d-col">
          <Write as="p" mode="line" className="d-kicker" {...q(30)}>
            Archive 02 · Concurrent internship
          </Write>
          <Write as="h3" mode="line" className="d-title" {...q(seaker.role)}>
            {seaker.role}
          </Write>
          <Write as="p" mode="words" className="d-company" {...q(seaker.company)}>
            {seaker.company}
          </Write>
          <Write as="p" mode="words" className="d-meta" {...q(seaker.period)}>
            {seaker.period}
          </Write>
          <Write as="p" mode="words" className="d-p d-muted" {...q(seaker.note ?? "")}>
            {seaker.note ?? ""}
          </Write>
          <Write as="h3" mode="line" className="d-title d-title-sub" {...q(system.name)}>
            {system.name}
          </Write>
          <RoleNote q={q}>{system.label}</RoleNote>
          <Write as="p" mode="words" className="d-p" {...q(system.purpose)}>
            {system.purpose}
          </Write>
        </div>
        <div className="d-col">
          {system.impact && (
            <>
              <Caption q={q}>Impact</Caption>
              <Write as="p" mode="words" className="d-p" {...q(system.impact)}>
                {system.impact}
              </Write>
            </>
          )}
          <Caption q={q}>My contribution</Caption>
          <Bullets items={system.contribution} q={q} />
          <TagList items={system.skills} label={`Technologies for ${system.name}`} q={q} />
        </div>
      </div>
    </Page>
  );
}

/** The Recruitment Management System (workflow design only) and the marketing work. */
export function RecruitmentPage() {
  const recruitment = findSystem(seaker, "Recruitment Management System");
  const marketing = findSystem(seaker, "Digital Marketing & Content");
  const q = sequence(0.06, 0.5, 1.1); // the densest page: write slightly faster so it finishes in time
  return (
    <Page id="exp-recruitment" foot={confidentialityNote}>
      <div className="d-cols">
        <div className="d-col">
          <Write as="p" mode="line" className="d-kicker" {...q(30)}>
            Archive 02 · Entry 02 / 03
          </Write>
          <Write as="h3" mode="line" className="d-title d-title-lg" {...q(recruitment.name)}>
            {recruitment.name}
          </Write>
          <RoleNote q={q}>{recruitment.label}</RoleNote>
          <Write as="p" mode="words" className="d-p" {...q(recruitment.purpose)}>
            {recruitment.purpose}
          </Write>
          <Caption q={q}>My contribution</Caption>
          <Bullets items={recruitment.contribution} q={q} />
        </div>
        <div className="d-col">
          <Write as="p" mode="line" className="d-kicker" {...q(30)}>
            Archive 02 · Entry 03 / 03
          </Write>
          <Write as="h3" mode="line" className="d-title d-title-lg" {...q(marketing.name)}>
            {marketing.name}
          </Write>
          <RoleNote q={q}>{marketing.label}</RoleNote>
          <Write as="p" mode="words" className="d-p" {...q(marketing.purpose)}>
            {marketing.purpose}
          </Write>
          <Caption q={q}>My contribution</Caption>
          <Bullets items={marketing.contribution} q={q} />
          <TagList items={marketing.skills} label="Tools" q={q} />
        </div>
      </div>
    </Page>
  );
}

export const experienceJobs = { iwsc, seaker };
export type { ExperienceEntry };
