import Page from "../Page";
import Write from "../Write";
import { sequence } from "../sequence";
import { Caption } from "../ui";
import { ExperienceArt, Plate, ProjectsArt } from "../illustrations";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import "../flow.css";

/**
 * Divider spreads: the title of a major section on the right, a plate on the left.
 * The contents list is built from the same data the section's pages use, so it never says anything new.
 */

/** Reserves the time the plate needs to be drawn (the engine reads the --dl / --du of every .write on a sheet). */
export function Hold({ ms }: { ms: number }) {
  return <i className="write fx-hold" style={{ "--dl": "0ms", "--du": `${ms}ms` } as React.CSSProperties} aria-hidden="true" />;
}

function Contents({ items, q }: { items: Array<{ key: string; name: string; label: string }>; q: ReturnType<typeof sequence> }) {
  return (
    <ol className="d-index dv-contents">
      {items.map((item, i) => (
        <li key={item.key}>
          <Write as="div" className="d-index-row" {...q(50)}>
            <span className="d-index-no">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="d-index-name">{item.name}</span>
              <span className="d-index-label">{item.label}</span>
            </span>
          </Write>
        </li>
      ))}
    </ol>
  );
}

export function ExperienceDividerPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="exp-divider"
      left={
        <div className="dv-left">
          <Hold ms={1800} />
          <Plate q={l} label="A design canvas: a wireframe with a selection moving across it, and a route plotted with anchor points" fig="Fig. 02" caption="Experience">
            <ExperienceArt />
          </Plate>
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
          <Write as="p" className="dv-no" {...r(10)}>
            02
          </Write>
          <Write as="h2" mode="words" className="dv-title" {...r(10)}>
            Experience
          </Write>
          <Write as="p" className="d-kicker" {...r(40)}>
            Professional / internship work
          </Write>
          <Caption q={r}>In this section</Caption>
          <Contents
            q={r}
            items={experience.map((job) => ({ key: job.role, name: job.role, label: `${job.company}, ${job.period}` }))}
          />
        </div>
      }
    />
  );
}

export function ProjectsDividerPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="proj-divider"
      left={
        <div className="dv-left">
          <Hold ms={1800} />
          <Plate q={l} label="Artboards: a phone and a browser, a small component library, and a component being set into place" fig="Fig. 03" caption="Projects">
            <ProjectsArt />
          </Plate>
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
          <Write as="p" className="dv-no" {...r(10)}>
            03
          </Write>
          <Write as="h2" mode="words" className="dv-title" {...r(8)}>
            Projects
          </Write>
          <Write as="p" className="d-kicker" {...r(30)}>
            Selected work
          </Write>
          <Caption q={r}>In this section</Caption>
          <Contents
            q={r}
            items={projects.map((p) => ({ key: p.slug, name: p.title, label: `${p.kind}, ${p.date}` }))}
          />
        </div>
      }
    />
  );
}
