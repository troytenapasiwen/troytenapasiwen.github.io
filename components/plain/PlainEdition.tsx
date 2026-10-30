import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import PlainSwitch from "./PlainSwitch";
import { DeviceShowcase, EvidenceFigure, Mark, NoteBlock, RelationTag, SiteShowcase } from "@/components/dossier/evidence";
import type { Seq } from "@/components/dossier/sequence";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { TechChip } from "@/components/ui/TechChip";
import { ContentPublishIcon, RecruitmentFlowIcon } from "@/components/ui/WorkIcons";
import { education, educationMedia } from "@/data/education";
import { confidentialityNote, experience, type ExperienceEntry, type System } from "@/data/experience";
import { projects } from "@/data/projects";
import { navItems, site } from "@/data/site";
import { skills } from "@/data/skills";

/**
 * The plain reading edition: the same portfolio, set as a quiet editorial publication.
 *
 * Everything is on one normal page with ordinary scrolling, nothing is hidden behind a page turn, and nothing is
 * animated. It uses the same data as the folder (data/*), the same palette and the same evidence components, so
 * it is the same portfolio in a different reading mode. It is also what is shown without JavaScript.
 */

// Evidence components are shared with the folder; here nothing is revealed, so every block simply shows.
const still: Seq = () => ({ dl: 0, du: 0 });

const isSolo = (s: System) => s.label.toLowerCase().startsWith("independently");

function Chips({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="pe-chips" aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <TechChip name={item} />
        </li>
      ))}
    </ul>
  );
}

function SectionHead({ id, title, dek }: { id: string; title: string; dek?: string }) {
  return (
    <header className="pe-head">
      <h2 id={`${id}-title`} className="pe-h2">
        {title}
      </h2>
      {dek && <p className="pe-dek">{dek}</p>}
    </header>
  );
}

function Employer({ job }: { job: ExperienceEntry }) {
  return (
    <header className="pe-employer">
      {job.logo && <Mark logo={job.logo} className="pe-mark" />}
      <div>
        <h3 className="pe-h3">{job.company}</h3>
        <p className="pe-role">{job.role}</p>
        <p className="pe-meta">{job.period}</p>
      </div>
    </header>
  );
}

function Entry({ system, icon }: { system: System; icon?: React.ReactNode }) {
  const ev = system.evidence;
  const marino = ev && ev.figures.length > 1;
  return (
    <article className="pe-entry" aria-labelledby={`pe-${slug(system.name)}`}>
      <div className="pe-entry-text">
        {icon && <div className="pe-icon">{icon}</div>}
        <h4 id={`pe-${slug(system.name)}`} className="pe-h4">
          {system.name}
        </h4>
        <p className={`pe-label ${isSolo(system) ? "is-solo" : ""}`}>{system.label}</p>
        <p className="pe-p">{system.purpose}</p>
        {system.impact && (
          <>
            <h5 className="pe-h5">Impact</h5>
            <p className="pe-p">{system.impact}</p>
          </>
        )}
        <h5 className="pe-h5">My contribution</h5>
        <ul className="pe-list">
          {system.contribution.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Chips items={system.skills} label={`Technologies for ${system.name}`} />
      </div>
      {ev && (
        <div className="pe-entry-media">
          {marino ? <SiteShowcase figures={ev.figures} q={still} /> : <EvidenceFigure figure={ev.figures[0]} q={still} />}
          {ev.relation && <RelationTag text={ev.relation} q={still} />}
          {ev.note && <NoteBlock note={ev.note} q={still} />}
        </div>
      )}
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function PlainEdition() {
  const iwsc = experience[0];
  const seaker = experience[1];
  const analyzer = projects.find((p) => p.slug === "ai-resume-analyzer")!;
  const reina = projects.find((p) => p.slug === "reina-pabili-services")!;
  const edu = education[0];
  const web = reina.figures?.find((f) => f.caption === "Web view");
  const mobile = reina.figures?.find((f) => f.caption === "Mobile view");

  return (
    <div className="pe">
      <header className="pe-mast">
        <div className="pe-mast-in">
          <a href="#top" className="pe-brand">
            <span className="pe-brand-name">{site.name}</span>
            <span className="pe-brand-role">{site.role}</span>
          </a>
          <nav className="pe-nav" aria-label="Sections">
            <ul>
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <PlainSwitch />
        </div>
      </header>

      <div className="pe-page">
        {/* ------------------------------------------------------------------ introduction */}
        <section id="plain-about" className="pe-feature" aria-labelledby="pe-name">
          <div className="pe-feature-text">
            <p className="pe-kicker">Portfolio</p>
            <h1 id="pe-name" className="pe-name">
              {site.name}
            </h1>
            <p className="pe-tagline">
              {site.role}
              <span>{site.focus}</span>
            </p>
            <p className="pe-lede">{site.statement}</p>
            <ul className="pe-elsewhere" aria-label="Find me elsewhere">
              <li>
                <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="size-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon className="size-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={site.links.email}>
                  <Mail className="size-4" aria-hidden="true" />
                  Email
                </a>
              </li>
            </ul>
          </div>
          <figure className="pe-portrait">
            <Image src={site.portrait.src} alt={site.portrait.alt} width={site.portrait.width} height={site.portrait.height} sizes="(min-width: 960px) 380px, 80vw" loading="lazy" decoding="async" />
            <figcaption>
              {site.name}, {site.role}
            </figcaption>
          </figure>
        </section>

        {/* ------------------------------------------------------------------ experience */}
        <section id="plain-experience" className="pe-section" aria-labelledby="experience-title">
          <SectionHead id="experience" title="Experience" dek={confidentialityNote} />

          <div className="pe-job">
            <Employer job={iwsc} />
            {iwsc.note && <p className="pe-meta">{iwsc.note}</p>}
            {iwsc.summary && <p className="pe-lead">{iwsc.summary}</p>}
            {iwsc.systems.map((s) => (
              <Entry key={s.name} system={s} />
            ))}
            {iwsc.general && (
              <aside className="pe-also">
                <h4 className="pe-h5">{iwsc.generalTitle ?? "Also in this role"}</h4>
                <ul className="pe-list">
                  {iwsc.general.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </aside>
            )}
          </div>

          <div className="pe-job">
            <Employer job={seaker} />
            {seaker.note && <p className="pe-meta">{seaker.note}</p>}
            {seaker.systems.map((s) => (
              <Entry
                key={s.name}
                system={s}
                icon={
                  s.name === "Recruitment Management System" ? (
                    <RecruitmentFlowIcon className="pe-icon-svg" />
                  ) : s.name === "Digital Marketing & Content" ? (
                    <ContentPublishIcon className="pe-icon-svg" />
                  ) : undefined
                }
              />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ projects */}
        <section id="plain-projects" className="pe-section" aria-labelledby="projects-title">
          <SectionHead id="projects" title="Selected projects" dek="Personal and academic work. Professional systems are filed under Experience." />

          <article className="pe-entry" aria-labelledby="pe-analyzer">
            <div className="pe-entry-text">
              <p className="pe-label">
                {analyzer.kind} · {analyzer.date}
              </p>
              <h3 id="pe-analyzer" className="pe-h3 pe-h3-lg">
                {analyzer.title}
              </h3>
              <p className="pe-p">{analyzer.overview}</p>
              {analyzer.purpose && <p className="pe-p pe-muted">{analyzer.purpose}</p>}
              <h5 className="pe-h5">How it works</h5>
              <ul className="pe-list">
                {analyzer.how?.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <h5 className="pe-h5">My role</h5>
              <ul className="pe-list">
                {analyzer.role?.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <Chips items={analyzer.tags} label={`Technologies for ${analyzer.title}`} />
              <div className="pe-links">
                {analyzer.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pe-link pe-link-strong">
                    {l.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only"> ({l.hint}, opens in a new tab)</span>
                  </a>
                ))}
                {analyzer.repo && (
                  <a href={analyzer.repo} target="_blank" rel="noopener noreferrer" className="pe-link">
                    <GitHubIcon className="size-4" />
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
            <div className="pe-entry-media">
              {analyzer.figures?.[0] && <EvidenceFigure figure={analyzer.figures[0]} q={still} />}
              {analyzer.notes?.map((n) => <NoteBlock key={n.label} note={n} q={still} />)}
            </div>
          </article>

          <article className="pe-entry" aria-labelledby="pe-reina">
            <div className="pe-entry-text">
              <p className="pe-label">
                {reina.kind} · {reina.date}
              </p>
              <h3 id="pe-reina" className="pe-h3 pe-h3-lg">
                {reina.title}
              </h3>
              <p className="pe-p">{reina.overview}</p>
              <h5 className="pe-h5">My role</h5>
              <ul className="pe-list">
                {reina.role?.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              {reina.testing && (
                <>
                  <h5 className="pe-h5">Testing conducted</h5>
                  <Chips items={reina.testing} label="Types of testing conducted" />
                </>
              )}
              <h5 className="pe-h5">Technologies</h5>
              <Chips items={reina.tags} label={`Technologies for ${reina.title}`} />
              {reina.links && (
                <div className="pe-links">
                  {reina.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pe-link pe-link-strong">
                      {l.label}
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                      <span className="sr-only"> ({l.hint}, opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="pe-entry-media">
              {web && mobile && <DeviceShowcase web={web} mobile={mobile} q={still} />}
              {reina.notes?.map((n) => <NoteBlock key={n.label} note={n} q={still} />)}
            </div>
          </article>
        </section>

        {/* ------------------------------------------------------------------ education */}
        <section id="plain-education" className="pe-section" aria-labelledby="education-title">
          <SectionHead id="education" title="Education" />
          <div className="pe-edu">
            <div className="pe-edu-text">
              <Image src={educationMedia.logo.src} alt={educationMedia.logo.alt} width={educationMedia.logo.width} height={educationMedia.logo.height} className="pe-edu-logo" loading="lazy" />
              <h3 className="pe-h3 pe-h3-lg">{edu.school}</h3>
              <p className="pe-lead">{edu.degree}</p>
              <p className="pe-p">{edu.specialization}</p>
              <p className="pe-meta">{edu.period}</p>
              {edu.honors && <p className="pe-honors">{edu.honors}</p>}
            </div>
            <figure className="pe-grad">
              <Image src={educationMedia.photo.src} alt={educationMedia.photo.alt} width={educationMedia.photo.width} height={educationMedia.photo.height} sizes="(min-width: 960px) 320px, 70vw" loading="lazy" decoding="async" />
            </figure>
          </div>
        </section>

        {/* ------------------------------------------------------------------ skills */}
        <section id="plain-skills" className="pe-section" aria-labelledby="skills-title">
          <SectionHead id="skills" title="Skills" />
          <div className="pe-skills">
            {skills.map((g) => (
              <div key={g.category} className="pe-skill-group">
                <h3 className="pe-h5">{g.category}</h3>
                <Chips items={g.items} label={g.category} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------ footer / contact */}
      <footer id="plain-contact" className="pe-foot">
        <div className="pe-foot-in">
          <div>
            <h2 className="pe-foot-title">Contact</h2>
            <p className="pe-foot-text">
              I’m looking for software development, web and mobile development, and AI/LLM application roles. Email is the quickest way to reach me.
            </p>
          </div>
          <ul className="pe-foot-links">
            <li>
              <a href={site.links.email}>
                <Mail className="size-4" aria-hidden="true" />
                {site.emailAddress}
              </a>
            </li>
            <li>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-4" />
                github.com/{site.handle}
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon className="size-4" />
                linkedin.com/in/troypasiwen
              </a>
            </li>
            {site.resume && (
              <li>
                <a href={site.resume} download>
                  Download resume
                </a>
              </li>
            )}
          </ul>
        </div>
        <p className="pe-foot-end">
          <span>
            © {new Date().getFullYear()} {site.name} · {site.domain}
          </span>
          <a href="#top">Back to the top</a>
        </p>
      </footer>
    </div>
  );
}
