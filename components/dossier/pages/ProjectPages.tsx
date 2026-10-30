import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import Page from "../Page";
import Write, { timing } from "../Write";
import { sequence, type Seq } from "../sequence";
import { Bullets, Caption, TagList } from "../ui";
import { EvidenceFigure, NoteBlock, PhoneFigure } from "../evidence";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { projects } from "@/data/projects";

function getProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Missing project: ${slug}`);
  return project;
}

/** Project actions get their own block and wrap on narrow screens. */
function ProjectLinks({ slug, repo, title, q, live = false }: { slug: string; repo?: string; title: string; q: Seq; live?: boolean }) {
  const p = getProject(slug);
  const { dl, du } = q(40);
  return (
    <div className="write write-block d-links" style={timing(dl, du)}>
      {live &&
        p.links?.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="d-btn d-btn-live">
            <span>
              {link.label}
              <span className="sr-only">: {title} ({link.hint}, opens in a new tab)</span>
            </span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ))}
      {repo && (
        <a href={repo} target="_blank" rel="noopener noreferrer" className="d-btn">
          <GitHubIcon className="size-4" />
          <span>
            View on GitHub<span className="sr-only">: {title}</span>
          </span>
        </a>
      )}
    </div>
  );
}

/** AI Resume Analyzer, part one. Left: what it is. Right: the interface, its status and the public preview. */
export function AnalyzerPage() {
  const p = getProject("ai-resume-analyzer");
  const l = sequence();
  const r = sequence();
  const note = p.notes?.[0];
  return (
    <Page
      id="proj-analyzer"
      left={
        <div className="d-stack">
          <div className="d-head">
            <Write as="h2" className="d-act" {...l(10)}>
              <span className="d-act-no">03</span> Projects
            </Write>
            <Write as="p" className="d-kicker" {...l(40)}>
              {`${p.kind} · ${p.date}`}
            </Write>
            <Write as="h3" className="d-display d-display-md" {...l(p.title.length)}>
              {p.title}
            </Write>
          </div>
          <Write as="p" className="d-p" {...l(p.overview.length)}>
            {p.overview}
          </Write>
          {p.purpose && (
            <Write as="p" className="d-p d-muted" {...l(p.purpose.length)}>
              {p.purpose}
            </Write>
          )}
        </div>
      }
      right={
        <div className="d-stack">
          {p.figures?.[0] && <EvidenceFigure figure={p.figures[0]} q={r} />}
          {note && <NoteBlock note={note} q={r} />}
          <ProjectLinks slug={p.slug} title={p.title} q={r} live />
        </div>
      }
    />
  );
}

/** AI Resume Analyzer, part two: how it works, the process, and the stack. */
export function AnalyzerHowPage() {
  const p = getProject("ai-resume-analyzer");
  const l = sequence();
  const r = sequence();
  const steps = p.pipeline ?? [];
  const pipe = r(60);
  return (
    <Page
      id="proj-analyzer-how"
      left={
        <div className="d-stack d-stack-mid d-roomy">
          <Caption q={l}>How it works</Caption>
          <Bullets items={p.how ?? []} q={l} />
          <Caption q={l}>My role</Caption>
          <Bullets items={p.role ?? []} q={l} />
        </div>
      }
      right={
        <div className="d-stack d-stack-mid d-roomy">
          {steps.length > 0 && (
            <>
              <Caption q={r}>The process</Caption>
              <ol className="write write-stagger d-pipe" style={timing(pipe.dl, pipe.du)} aria-label="How the analyzer works">
                {steps.map((step, i) => (
                  <li key={step.step} className="d-pipe-node" style={{ "--n": i } as CSSProperties}>
                    <span className="d-pipe-step">{`${String(i + 1).padStart(2, "0")} · ${step.step}`}</span>
                    <span className="d-pipe-label">{step.label}</span>
                  </li>
                ))}
              </ol>
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

/** REINA Pabili Services, part one: the project and my role (left); testing, technologies and links (right). */
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
          <Write as="p" className="d-kicker" {...l(40)}>
            {`${p.kind} · ${p.date}`}
          </Write>
          <Write as="h3" className="d-display d-display-md" {...l(p.title.length)}>
            {p.title}
          </Write>
          <Write as="p" className="d-p" {...l(p.overview.length)}>
            {p.overview}
          </Write>
          <Caption q={l}>My role</Caption>
          <Bullets items={p.role ?? []} q={l} />
        </div>
      }
      right={
        <div className="d-stack d-stack-mid d-roomy">
          {p.testing && (
            <>
              <Caption q={r}>Testing conducted</Caption>
              <TagList items={p.testing} label="Types of testing conducted" q={r} />
            </>
          )}
          <Caption q={r}>Technologies</Caption>
          <TagList items={p.tags} label={`Technologies for ${p.title}`} q={r} />
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={r} live />
        </div>
      }
    />
  );
}

/**
 * REINA Pabili Services, part two: the same application on two screens, one on each page of the spread.
 * The web view and its status note on the left; the phone view and the service area on the right.
 */
export function ReinaScreensPage() {
  const p = getProject("reina-pabili-services");
  const l = sequence();
  const r = sequence();
  const web = p.figures?.find((f) => f.caption === "Web view");
  const mobile = p.figures?.find((f) => f.caption === "Mobile view");
  const status = p.notes?.find((n) => n.tone === "status");
  const scope = p.notes?.find((n) => n.tone === "scope");
  return (
    <Page
      id="proj-reina-screens"
      left={
        <div className="d-stack d-stack-mid">
          <Write as="p" className="d-kicker" {...l(40)}>
            One application, two screens
          </Write>
          {web && <EvidenceFigure figure={web} q={l} />}
          {status && <NoteBlock note={status} q={l} />}
        </div>
      }
      right={
        <div className="d-stack d-stack-mid">
          <div className="d-phonerow">
            {mobile && <PhoneFigure figure={mobile} q={r} />}
            <div className="d-phonerow-note">{scope && <NoteBlock note={scope} q={r} />}</div>
          </div>
        </div>
      }
    />
  );
}
