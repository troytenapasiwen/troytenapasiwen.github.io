#!/usr/bin/env bash
# Run from the project root (the folder that contains package.json).
set -e
[ -f package.json ] || { echo "Run this from the project root (package.json not found)."; exit 1; }
mkdir -p "components/dossier/pages"
cat > 'components/dossier/pages/IntroPage.tsx' <<'EOF'
import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { site } from "@/data/site";

export default function IntroPage() {
  const q = sequence(0.07);
  return (
    <Page id="intro">
      <div className="d-cols d-cols-intro">
        <div className="d-col d-col-center">
          <Write as="h2" mode="line" className="d-act" {...q(12)}>
            <span className="d-act-no">01</span> Introduction
          </Write>
          <Write as="p" mode="line" className="d-display" {...q(12)}>
            {site.name}
          </Write>
          <Write as="p" mode="words" className="d-role" {...q(site.headline)}>
            {site.headline}
          </Write>
          <Rule className="d-rule-gap" {...q(30)} />
          <Write as="p" mode="words" className="d-lead" {...q(site.intro)}>
            {site.intro}
          </Write>
        </div>
        <div className="d-col d-col-center d-col-about">
          {site.about.map((paragraph) => (
            <Write key={paragraph} as="p" mode="words" className="d-p" {...q(paragraph)}>
              {paragraph}
            </Write>
          ))}
          <Write as="p" mode="words" className="d-meta" {...q(site.subtitle)}>
            {site.subtitle}
          </Write>
        </div>
      </div>
    </Page>
  );
}
EOF
echo "wrote components/dossier/pages/IntroPage.tsx"
mkdir -p "components/dossier/pages"
cat > 'components/dossier/pages/ExperiencePages.tsx' <<'EOF'
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
EOF
echo "wrote components/dossier/pages/ExperiencePages.tsx"
mkdir -p "components/dossier/pages"
cat > 'components/dossier/pages/ProjectPages.tsx' <<'EOF'
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import Page from "../Page";
import Write, { timing } from "../Write";
import { sequence } from "../sequence";
import { Bullets, Caption, TagList } from "../ui";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { projects } from "@/data/projects";

function getProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Missing project: ${slug}`);
  return project;
}

function ProjectLinks({
  slug,
  repo,
  title,
  q,
}: {
  slug: string;
  repo?: string;
  title: string;
  q: ReturnType<typeof sequence>;
}) {
  const { s, d } = q(40);
  return (
    <div className="write write-block d-links" style={timing(s, d)} data-write="">
      {repo && (
        <a href={repo} target="_blank" rel="noopener noreferrer" className="d-btn">
          <GitHubIcon className="size-4" />
          <span>
            View on GitHub<span className="sr-only">: {title}</span>
          </span>
        </a>
      )}
      <Link href={`/projects/${slug}/`} className="d-btn d-btn-ghost">
        <span>
          Project details<span className="sr-only">: {title}</span>
        </span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** The visually strongest personal project: AI Resume Analyzer. */
export function AnalyzerPage() {
  const p = getProject("ai-resume-analyzer");
  const q = sequence(0.05);
  const steps = p.pipeline ?? [];
  const pipe = q(120);
  const last = Math.max(steps.length - 1, 1);

  return (
    <Page id="proj-analyzer">
      <div className="d-stack">
        <div className="d-head">
          <Write as="h2" mode="line" className="d-act" {...q(10)}>
            <span className="d-act-no">03</span> Projects
          </Write>
          <Write as="p" mode="line" className="d-kicker" {...q(p.kind + p.date)}>
            {`${p.kind} · ${p.date}`}
          </Write>
          <Write as="h3" mode="line" className="d-display d-display-md" {...q(p.title)}>
            {p.title}
          </Write>
        </div>

        {steps.length > 0 && (
          <ol
            className="write write-stagger d-pipe"
            style={timing(pipe.s, pipe.d)}
            data-write=""
            aria-label="How the analyzer works"
          >
            {steps.map((step, i) => (
              <li
                key={step.step}
                className="d-pipe-node"
                style={{ "--i": (i / last).toFixed(3) } as CSSProperties}
              >
                <span className="d-pipe-step">{`${String(i + 1).padStart(2, "0")} · ${step.step}`}</span>
                <span className="d-pipe-label">{step.label}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="d-cols">
          <div className="d-col">
            <Write as="p" mode="words" className="d-p" {...q(p.overview)}>
              {p.overview}
            </Write>
            {p.purpose && (
              <Write as="p" mode="words" className="d-p d-muted" {...q(p.purpose)}>
                {p.purpose}
              </Write>
            )}
          </div>
          <div className="d-col">
            <Caption q={q}>How it works</Caption>
            <Bullets items={p.how ?? []} q={q} />
          </div>
        </div>

        <div className="d-foot-row">
          <TagList items={p.tags} label={`Technologies for ${p.title}`} q={q} />
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={q} />
        </div>
      </div>
    </Page>
  );
}

/** REINA Pabili Services: the capstone project, described with its real scope. */
export function ReinaPage() {
  const p = getProject("reina-pabili-services");
  const q = sequence(0.06);
  return (
    <Page
      id="proj-reina"
      foot={
        <>
          Professional and internship systems are filed under{" "}
          <a href="#experience">Experience</a>.
        </>
      }
    >
      <div className="d-cols">
        <div className="d-col">
          <Write as="p" mode="line" className="d-kicker" {...q(p.kind + p.date)}>
            {`${p.kind} · ${p.date}`}
          </Write>
          <Write as="h3" mode="line" className="d-display d-display-md" {...q(p.title)}>
            {p.title}
          </Write>
          <Write as="p" mode="words" className="d-p" {...q(p.overview)}>
            {p.overview}
          </Write>
          <TagList items={p.tags} label={`Technologies for ${p.title}`} q={q} />
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={q} />
        </div>
        <div className="d-col">
          <Caption q={q}>My role</Caption>
          <Bullets items={p.role ?? []} q={q} />
          {p.testing && (
            <>
              <Caption q={q}>Testing conducted</Caption>
              <TagList items={p.testing} label="Types of testing conducted" q={q} />
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
EOF
echo "wrote components/dossier/pages/ProjectPages.tsx"
mkdir -p "components/dossier/pages"
cat > 'components/dossier/pages/EducationPage.tsx' <<'EOF'
import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { Stamp } from "../ui";
import { education } from "@/data/education";

export default function EducationPage() {
  const q = sequence(0.1, 0.5, 2.6);
  return (
    <Page id="education">
      <div className="d-center-block">
        <Write as="h2" mode="line" className="d-act" {...q(10)}>
          <span className="d-act-no">04</span> Education
        </Write>
        {education.map((item) => (
          <article key={item.school + item.degree} className="d-edu">
            <Write as="p" mode="line" className="d-display d-display-md" {...q(item.school)}>
              {item.school}
            </Write>
            <Rule className="d-rule-gap" {...q(30)} />
            <Write as="h3" mode="words" className="d-title" {...q(item.degree)}>
              {item.degree}
            </Write>
            <Write as="p" mode="words" className="d-p" {...q(item.specialization)}>
              {item.specialization}
            </Write>
            <Write as="p" mode="words" className="d-meta" {...q(item.period)}>
              {item.period}
            </Write>
            {item.honors && <Stamp q={q}>{item.honors}</Stamp>}
          </article>
        ))}
      </div>
    </Page>
  );
}
EOF
echo "wrote components/dossier/pages/EducationPage.tsx"
mkdir -p "components/dossier/pages"
cat > 'components/dossier/pages/SkillsPage.tsx' <<'EOF'
import type { CSSProperties } from "react";
import Page from "../Page";
import Write, { timing } from "../Write";
import { sequence } from "../sequence";
import { skills } from "@/data/skills";

export default function SkillsPage() {
  const q = sequence(0.08, 0.6, 2.4);
  return (
    <Page id="skills">
      <div className="d-stack">
        <div className="d-head">
          <Write as="h2" mode="line" className="d-act" {...q(10)}>
            <span className="d-act-no">05</span> Skills
          </Write>
          <Write as="p" mode="line" className="d-kicker" {...q(32)}>
            Technical index · system inventory
          </Write>
        </div>

        <div className="d-inventory">
          {skills.map((group, gi) => {
            const { s, d } = q(group.items.length * 14);
            const last = Math.max(group.items.length - 1, 1);
            const id = `skills-${gi}`;
            return (
              <section key={group.category} className="d-inv-group" aria-labelledby={id}>
                <h3 id={id} className="d-inv-head">
                  <span className="d-inv-letter">{String.fromCharCode(65 + gi)}</span>
                  <span>{group.category}</span>
                  <span className="d-inv-count">{String(group.items.length).padStart(2, "0")}</span>
                </h3>
                <ul
                  className="write write-stagger d-inv-list"
                  style={timing(s, d)}
                  data-write=""
                >
                  {group.items.map((item, i) => (
                    <li key={item} style={{ "--i": (i / last).toFixed(3) } as CSSProperties}>
                      <span className="d-inv-no" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
EOF
echo "wrote components/dossier/pages/SkillsPage.tsx"
mkdir -p "components/dossier/pages"
cat > 'components/dossier/pages/ContactPage.tsx' <<'EOF'
import { Mail } from "lucide-react";
import Page from "../Page";
import Write, { Rule, timing } from "../Write";
import { sequence } from "../sequence";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { site } from "@/data/site";

const closing =
  "I’m looking for software development, web and mobile development, and AI/LLM application roles. Email is the quickest way to reach me.";

export default function ContactPage() {
  const q = sequence(0.1, 0.5, 2.6);
  const rows = [
    { href: site.links.email, text: site.emailAddress, icon: <Mail className="size-4" aria-hidden="true" />, external: false },
    { href: site.links.github, text: `github.com/${site.handle}`, icon: <GitHubIcon className="size-4" />, external: true },
    { href: site.links.linkedin, text: "linkedin.com/in/troypasiwen", icon: <LinkedInIcon className="size-4" />, external: true },
  ];
  const list = q(120);

  return (
    <Page id="contact">
      <div className="d-center-block">
        <Write as="h2" mode="line" className="d-act" {...q(10)}>
          <span className="d-act-no">06</span> Contact
        </Write>
        <Write as="p" mode="words" className="d-lead d-lead-wide" {...q(closing)}>
          {closing}
        </Write>

        <ul className="write write-stagger d-contact" style={timing(list.s, list.d)} data-write="">
          {rows.map((row, i) => (
            <li key={row.href} style={{ "--i": (i / (rows.length - 1)).toFixed(3) } as React.CSSProperties}>
              <a
                href={row.href}
                {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="d-contact-link"
              >
                {row.icon}
                <span>{row.text}</span>
              </a>
            </li>
          ))}
          {site.resume && (
            <li style={{ "--i": 1 } as React.CSSProperties}>
              <a href={site.resume} download className="d-contact-link">
                <span>Download resume</span>
              </a>
            </li>
          )}
        </ul>

        <Rule className="d-rule-gap" {...q(30)} />
        <Write as="div" mode="block" className="d-end" {...q(40)}>
          <span>
            © {new Date().getFullYear()} {site.name} · {site.domain}
          </span>
          <span>End of dossier</span>
          <a href="#top" className="d-backtop">
            Back to the folder
          </a>
        </Write>
      </div>
    </Page>
  );
}
EOF
echo "wrote components/dossier/pages/ContactPage.tsx"
