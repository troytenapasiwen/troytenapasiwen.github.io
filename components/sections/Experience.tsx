import Section from "@/components/ui/Section";
import TechTag from "@/components/ui/TechTag";
import { experience, confidentialityNote } from "@/data/experience";

function Detail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <h5 className="font-mono text-xs text-muted">{title}</h5>
      <div className="mt-1.5 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export default function Experience() {
  return (
    <Section id="experience">
      <div className="space-y-20">
        {experience.map((job) => (
          <article key={job.role + job.company}>
            <p className="font-mono text-xs text-accent">
              Professional / internship work
            </p>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-serif text-xl">{job.role}</h3>
              <p className="font-mono text-xs text-muted">{job.period}</p>
            </div>
            <p className="mt-1 text-sm">{job.company}</p>
            {job.note && <p className="mt-1 text-xs text-muted">{job.note}</p>}
            {job.summary && (
              <p className="mt-4 text-sm leading-relaxed">{job.summary}</p>
            )}

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {job.systems.map((system) => (
                <li key={system.name} className="py-7">
                  <h4 className="font-serif text-lg">{system.name}</h4>
                  <p className="mt-1 font-mono text-xs text-accent">
                    {system.label}
                  </p>

                  <Detail title="What it is for">
                    <p className="text-muted">{system.purpose}</p>
                  </Detail>

                  {system.impact && (
                    <Detail title="Impact">
                      <p className="text-muted">{system.impact}</p>
                    </Detail>
                  )}

                  <Detail title="My contribution">
                    <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
                      {system.contribution.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Detail>

                  {system.skills.length > 0 && (
                    <ul
                      className="mt-5 flex flex-wrap gap-2"
                      aria-label={`Technologies for ${system.name}`}
                    >
                      {system.skills.map((skill) => (
                        <TechTag key={skill}>{skill}</TechTag>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {job.general && (
              <Detail title={job.generalTitle ?? "Also in this role"}>
                <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
                  {job.general.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Detail>
            )}
          </article>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted">{confidentialityNote}</p>
    </Section>
  );
}
