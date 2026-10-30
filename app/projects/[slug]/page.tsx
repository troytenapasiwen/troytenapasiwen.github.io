import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import TechTag from "@/components/ui/TechTag";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { NoteBlock, Shot } from "@/components/dossier/evidence";
import type { Seq } from "@/components/dossier/sequence";

// The loose-sheet pages show everything at once: nothing is revealed here.
const still: Seq = () => ({ dl: 0, du: 0 });

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
    <section className="border-t-2 border-fg py-8">
      <h2 className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.12em]">
        <span className="size-2.5 bg-vermilion" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-vermilion">
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
          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-fg transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to the dossier
        </Link>
      </div>

      <main
        id="main"
        className="mx-auto max-w-3xl border-2 border-fg bg-paper px-6 py-10 shadow-[10px_10px_0_var(--vermilion)] sm:px-12 sm:py-14"
      >
        <article>
          <header className="pb-10">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent">
              {project.kind} · {project.date}
            </p>
            <h1 className="mt-3 font-serif text-4xl uppercase leading-[0.95] tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
              {project.tags.map((tag) => (
                <TechTag key={tag}>{tag}</TechTag>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-folder bg-vermilion px-4 py-2 text-sm font-bold text-folder transition-colors hover:bg-folder hover:text-vermilion"
                >
                  {link.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">
                    ({link.hint}, opens in a new tab)
                  </span>
                </a>
              ))}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border-2 border-fg px-4 py-2 text-sm font-bold transition-colors hover:bg-fg hover:text-paper"
                >
                  <GitHubIcon className="size-4" />
                  View on GitHub
                </a>
              )}
            </div>
          </header>

          {project.figures && project.figures.length > 0 && (
            <section className="border-t-2 border-fg py-8" aria-label="Screens">
              <div className="grid gap-6 sm:grid-cols-2">
                {project.figures.map((figure) => (
                  <figure
                    key={figure.src}
                    className={`m-0 ${figure.height > figure.width ? "mx-auto max-w-[14rem]" : "sm:col-span-2"}`}
                  >
                    {figure.height > figure.width ? (
                      <Image
                        src={figure.src}
                        alt={figure.alt}
                        width={figure.width}
                        height={figure.height}
                        sizes="14rem"
                        className="h-auto w-full rounded-2xl border-4 border-folder"
                      />
                    ) : (
                      <Shot figure={figure} priority />
                    )}
                    <figcaption className="mt-2 text-sm text-muted">{figure.caption}</figcaption>
                  </figure>
                ))}
              </div>
              {project.notes && (
                <div className="mt-6 grid gap-4">
                  {project.notes.map((note) => (
                    <NoteBlock key={note.label} note={note} q={still} />
                  ))}
                </div>
              )}
            </section>
          )}

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
