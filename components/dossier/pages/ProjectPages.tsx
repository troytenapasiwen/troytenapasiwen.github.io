import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import Page from "../Page";
import Spot from "../spots";
import Write, { timing } from "../Write";
import { sequence, type Seq } from "../sequence";
import { Bullets, Caption, TagList } from "../ui";
import { StackList } from "../stack";
import { NoteBlock, Shot } from "../evidence";
import { ViewImageButton } from "../ImageViewer";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { projects } from "@/data/projects";
import type { Figure } from "@/data/media";
import "./ProjectPages.css";

function getProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Missing project: ${slug}`);
  return project;
}

/**
 * The AI Resume Analyzer's phone screenshot is an existing file in public/images that data/projects.ts does not list
 * (only its web preview is). It is described here, next to the page that uses it, so no project data is changed.
 */
const analyzerMobile: Figure = {
  src: "/images/airesumeanalyzer_mob.jpg",
  alt: "AI Resume Analyzer on a phone: an \u201cAdd a resume\u201d section with a PDF upload box, above a \u201cQuestions\u201d section.",
  width: 828,
  height: 1606,
  caption: "Mobile view",
};

/**
 * The right-hand page of a project introduction: the web screenshot, with the phone screenshot standing in front of
 * its lower-left corner. Without a phone view (or without a web view) it shows the one screen it has. Sizes come from
 * each image's own width and height, so nothing is stretched.
 */
function ProjectScreens({ web, mobile, label, q }: { web?: Figure; mobile?: Figure; label: string; q: Seq }) {
  return (
    <div className="pv-stage">
      <Write as="figure" mode="image" className={`pv-show ${web && mobile ? "pv-both" : "pv-one"}`} {...q(120)}>
        {web && (
          <span className="pv-web" style={mobile ? undefined : { marginLeft: 0 }}>
            <Shot figure={web} priority />
            <span className="d-tagline">{web.caption}</span>
            <ViewImageButton figure={web} />
          </span>
        )}
        {mobile && (
          <span className="pv-phone">
            <span className="d-phone">
              <Image src={mobile.src} alt={mobile.alt} width={mobile.width} height={mobile.height} sizes="160px" loading="lazy" decoding="async" className="d-phone-img" />
            </span>
            <span className="d-tagline">{mobile.caption}</span>
            <ViewImageButton figure={mobile} />
          </span>
        )}
        <figcaption className="sr-only">{label}</figcaption>
      </Write>
    </div>
  );
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

/**
 * AI Resume Analyzer, introduction. Left: the name and the description. Right: the interface on the web and on a
 * phone. Everything else about the project is on the next spread.
 */
export function AnalyzerPage() {
  const p = getProject("ai-resume-analyzer");
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="proj-analyzer"
      left={
        <div className="d-stack pv-intro">
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
          <Write as="p" className="d-p pv-lede" {...l(p.overview.length)}>
            {p.overview}
          </Write>
          <Spot kind="resume" />
        </div>
      }
      right={<ProjectScreens web={p.figures?.[0]} mobile={analyzerMobile} label="The AI Resume Analyzer on the web and on a phone" q={r} />}
    />
  );
}

/** AI Resume Analyzer, details: the purpose, how it works and my role (left); the status, process, stack and links (right). */
export function AnalyzerHowPage() {
  const p = getProject("ai-resume-analyzer");
  const l = sequence();
  const r = sequence();
  const steps = p.pipeline ?? [];
  const pipe = r(60);
  const note = p.notes?.[0];
  return (
    <Page
      id="proj-analyzer-how"
      left={
        <div className="d-stack d-stack-mid d-roomy">
          {p.purpose && (
            <Write as="p" className="d-p d-muted" {...l(p.purpose.length)}>
              {p.purpose}
            </Write>
          )}
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
          {p.stack ? <StackList stack={p.stack} label={`Technologies for ${p.title}`} q={r} /> : <TagList items={p.tags} label={`Technologies for ${p.title}`} q={r} />}
          {note && <NoteBlock note={note} q={r} />}
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={r} live />
        </div>
      }
    />
  );
}

/**
 * REINA Pabili Services, introduction. Left: the name and the description. Right: the web and mobile views.
 * The role, testing, technologies, notes and links are on the next spread.
 */
export function ReinaPage() {
  const p = getProject("reina-pabili-services");
  const l = sequence();
  const r = sequence();
  const web = p.figures?.find((f) => f.caption === "Web view");
  const mobile = p.figures?.find((f) => f.caption === "Mobile view");
  return (
    <Page
      id="proj-reina"
      foot={
        <>
          Professional and internship systems are filed under <a href="#experience">Experience</a>.
        </>
      }
      left={
        <div className="d-stack pv-intro">
          <Write as="p" className="d-kicker" {...l(40)}>
            {`${p.kind} · ${p.date}`}
          </Write>
          <Write as="h3" className="d-display d-display-md" {...l(p.title.length)}>
            {p.title}
          </Write>
          <Write as="p" className="d-p pv-lede" {...l(p.overview.length)}>
            {p.overview}
          </Write>
          <Spot kind="parcel" />
        </div>
      }
      right={<ProjectScreens web={web} mobile={mobile} label="REINA Pabili Services on the web and on a phone" q={r} />}
    />
  );
}

/** REINA Pabili Services, details: my role and the testing conducted (left); the stack, notes and links (right). */
export function ReinaScreensPage() {
  const p = getProject("reina-pabili-services");
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="proj-reina-screens"
      left={
        <div className="d-stack d-stack-mid d-roomy">
          <Caption q={l}>My role</Caption>
          <Bullets items={p.role ?? []} q={l} />
          {p.testing && (
            <>
              <Caption q={l}>Testing conducted</Caption>
              <TagList items={p.testing} label="Types of testing conducted" q={l} />
            </>
          )}
        </div>
      }
      right={
        <div className="d-stack d-stack-mid d-roomy">
          <Caption q={r}>Technologies</Caption>
          {p.stack ? <StackList stack={p.stack} label={`Technologies for ${p.title}`} q={r} /> : <TagList items={p.tags} label={`Technologies for ${p.title}`} q={r} />}
          <div className="pv-notes">
            {p.notes?.map((n) => <NoteBlock key={n.label} note={n} q={r} />)}
          </div>
          <ProjectLinks slug={p.slug} repo={p.repo} title={p.title} q={r} live />
        </div>
      }
    />
  );
}
