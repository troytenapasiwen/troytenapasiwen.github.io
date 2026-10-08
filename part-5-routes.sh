#!/usr/bin/env bash
# Run from the project root (the folder that contains package.json).
set -e
[ -f package.json ] || { echo "Run this from the project root (package.json not found)."; exit 1; }
mkdir -p "app"
cat > 'app/page.tsx' <<'EOF'
import Dossier from "@/components/dossier/Dossier";
import Folder from "@/components/dossier/Folder";
import IntroPage from "@/components/dossier/pages/IntroPage";
import {
  ExperienceOverviewPage,
  SystemPage,
  SeakerPage,
  RecruitmentPage,
  experienceJobs,
} from "@/components/dossier/pages/ExperiencePages";
import { AnalyzerPage, ReinaPage } from "@/components/dossier/pages/ProjectPages";
import EducationPage from "@/components/dossier/pages/EducationPage";
import SkillsPage from "@/components/dossier/pages/SkillsPage";
import ContactPage from "@/components/dossier/pages/ContactPage";

/**
 * The home page is one continuous dossier. The order of the pages here must match
 * PAGES in components/dossier/timeline.ts.
 */
export default function Home() {
  const { iwsc } = experienceJobs;
  return (
    <Dossier cover={<Folder />}>
      <IntroPage />
      <ExperienceOverviewPage />
      <SystemPage pageId="exp-inventory" job={iwsc} systemName="Inventory Management System" entry={1} entries={3} />
      <SystemPage pageId="exp-crewing" job={iwsc} systemName="Crewing Management System" entry={2} entries={3} />
      <SystemPage pageId="exp-forms" job={iwsc} systemName="Automated Forms Portal" entry={3} entries={3} />
      <SeakerPage />
      <RecruitmentPage />
      <AnalyzerPage />
      <ReinaPage />
      <EducationPage />
      <SkillsPage />
      <ContactPage />
    </Dossier>
  );
}
EOF
echo "wrote app/page.tsx"
mkdir -p "app/projects/[slug]"
cat > 'app/projects/[slug]/page.tsx' <<'EOF'
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import TechTag from "@/components/ui/TechTag";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { GitHubIcon } from "@/components/ui/BrandIcons";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-rule py-8">
      <h2 className="font-serif text-xl tracking-tight">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Project pages are loose sheets from the same dossier: paper on the desk, same type and colours.
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen px-4 pb-10 pt-5 sm:px-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between pb-5">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the dossier
        </Link>
        <ThemeToggle />
      </div>

      <main
        id="main"
        className="mx-auto max-w-3xl rounded border border-rule bg-paper px-6 py-10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] sm:px-12 sm:py-14"
      >
        <article>
          <header className="pb-10">
            <p className="font-mono text-xs text-accent">
              {project.kind} · {project.date}
            </p>
            <h1 className="mt-2 font-serif text-4xl tracking-tight">
              {project.title}
            </h1>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
              {project.tags.map((tag) => (
                <TechTag key={tag}>{tag}</TechTag>
              ))}
            </ul>
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded border border-rule px-4 py-2 text-sm transition-colors hover:border-muted"
              >
                <GitHubIcon className="size-4" />
                View on GitHub
              </a>
            )}
          </header>

          <Block title="Overview">
            <p>{project.overview}</p>
          </Block>
          {project.purpose && (
            <Block title="Purpose">
              <p>{project.purpose}</p>
            </Block>
          )}
          {project.problem && (
            <Block title="Problem">
              <p>{project.problem}</p>
            </Block>
          )}
          {project.how && (
            <Block title="How it works">
              <List items={project.how} />
            </Block>
          )}
          {project.role && (
            <Block title="My role">
              <List items={project.role} />
            </Block>
          )}
          {project.learned && (
            <Block title="What I learned">
              <List items={project.learned} />
            </Block>
          )}
        </article>
      </main>

      <footer className="mx-auto max-w-3xl pt-6 font-mono text-xs text-muted">
        © {new Date().getFullYear()} {site.name} · {site.domain}
      </footer>
    </div>
  );
}
EOF
echo "wrote app/projects/[slug]/page.tsx"
