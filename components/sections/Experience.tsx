import Section from "@/components/ui/Section";
import TechTag from "@/components/ui/TechTag";
import { experience, experienceNote } from "@/data/experience";

export default function Experience() {
  return (
    <Section id="experience">
      <p className="mb-10 border-l-2 border-accent pl-4 text-sm text-muted">
        {experienceNote}
      </p>

      <div className="space-y-12">
        {experience.map((job) => (
          <article key={job.role + job.company}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-serif text-lg">{job.role}</h3>
              <p className="font-mono text-xs text-muted">{job.period}</p>
            </div>
            <p className="mt-1 text-sm">{job.company}</p>
            {job.note && (
              <p className="font-mono text-xs text-muted">{job.note}</p>
            )}

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-muted">
              {job.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
              {job.skills.map((skill) => (
                <TechTag key={skill}>{skill}</TechTag>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}