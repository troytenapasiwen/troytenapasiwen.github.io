import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import Page from "../Page";
import Write, { timing } from "../Write";
import { sequence, type Seq } from "../sequence";
import { Bullets, Caption, TagList } from "../ui";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { projects } from "@/data/projects";

function getProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Missing project: ${slug}`);
  return project;
}

/** Project actions get their own block, below the tags, and wrap on narrow screens. */
function ProjectLinks({ slug, repo, title, q }: { slug: string; repo?: string; title: string; q: Seq }) {
  const { s, d } = q();
  return (
    <div className="write write-block d-links" style={timing(s, d)}>
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

/** AI Resume Analyzer. Left: title, metadata, description, process. Right: implementation, tags, actions. */
export function AnalyzerPage() {
  const p = getProject("ai-resume-analyzer");
  const l = sequence();
  const r = sequence();
  const steps = p.pipeline ?? [];
  const pipe = l();
  const last = Math.max(steps.length - 1, 1);

  return (
    <Page
      id="proj-analyzer"
      left={
        <div className="d-stack">
          <div className="d-head">
            <Write as="h2" className="d-act" {...l()}>
              <span className="d-act-no">03</span> Projects
            </Write>
            <Write as="p" className="d-kicker" {...l()}>
              {`${p.kind} · ${p.date}`}
            </Write>
            <Write as="h3" className="d-display d-display-md" {...l()}>
              {p.title}
            </Write>
          </div>
          <Write as="p" className="d-p" {...l()}>
            {p.overview}
          </Write>
          {p.purpose && (
            <Write as="p" className="d-p d-muted" {...l()}>
              {p.purpose}
            </Write>
          )}
          {steps.length > 0 && (
            <ol className="write write-stagger d-pipe" style={timing(pipe.s, pipe.d)} aria-label="How the analyzer works">
              {steps.map((step, i) => (
                <li key={step.step} className="d-pipe-node" style={{ "--i": (i / last).toFixed(3) } as CSSProperties}>
                  <span className="d-pipe-step">{`${String(i + 1).padStart(2, "0")} · ${step.step}`}</span>
                  <span className="d-pipe-label">{step.label}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      }
      right={
        <div className="d-stack">
          <Caption q={r}>How it works</Caption>
          <Bullets items={p.how ?? []} q={r} />
          <Caption q={r}>Technologies</Caption>
          <TagList items={p.tags} label={`Technologies for ${p.title}`} q={r} />
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={r} />
        </div>
      }
    />
  );
}

/** REINA Pabili Services: the capstone project, described with its real scope. */
export function ReinaPage() {
  const p = getProject("reina-pabili-services");
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="proj-reina"
      foot={
        <>
          Professional and internship systems are filed under <a href="#experience">Experience</a>.
        </>
      }
      left={
        <div className="d-stack">
          <Write as="p" className="d-kicker" {...l()}>
            {`${p.kind} · ${p.date}`}
          </Write>
          <Write as="h3" className="d-display d-display-md" {...l()}>
            {p.title}
          </Write>
          <Write as="p" className="d-p" {...l()}>
            {p.overview}
          </Write>
          <Caption q={l}>My role</Caption>
          <Bullets items={p.role ?? []} q={l} />
        </div>
      }
      right={
        <div className="d-stack">
          {p.testing && (
            <>
              <Caption q={r}>Testing conducted</Caption>
              <TagList items={p.testing} label="Types of testing conducted" q={r} />
            </>
          )}
          <Caption q={r}>Technologies</Caption>
          <TagList items={p.tags} label={`Technologies for ${p.title}`} q={r} />
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={r} />
        </div>
      }
    />
  );
}
