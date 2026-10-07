import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import TechTag from "@/components/ui/TechTag";
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
    <section className="border-t border-line py-8">
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

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <article>
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>

      <header className="pb-10 pt-8">
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
            className="mt-6 inline-flex items-center gap-2 rounded border border-line px-4 py-2 text-sm transition-colors hover:border-muted"
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
  );
}
