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
