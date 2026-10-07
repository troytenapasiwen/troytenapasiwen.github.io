import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import TechTag from "@/components/ui/TechTag";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <Section id="projects">
      <ul className="divide-y divide-line border-y border-line">
        {projects.map((project) => (
          <li key={project.slug} className="py-6">
            <p className="font-mono text-xs text-accent">{project.kind}</p>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-serif text-xl">
                <Link
                  href={`/projects/${project.slug}/`}
                  className="underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="font-mono text-xs text-muted">{project.date}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.summary}
            </p>
            <ul
              className="mt-3 flex flex-wrap gap-2"
              aria-label={`Technologies for ${project.title}`}
            >
              {project.tags.map((tag) => (
                <TechTag key={tag}>{tag}</TechTag>
              ))}
            </ul>
            <Link
              href={`/projects/${project.slug}/`}
              className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              View details
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted">
        Professional and internship systems are listed under{" "}
        <a href="#experience" className="text-accent hover:underline">
          Experience
        </a>
        .
      </p>
    </Section>
  );
}
