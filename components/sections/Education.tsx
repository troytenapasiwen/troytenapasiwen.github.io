import Section from "@/components/ui/Section";
import { education } from "@/data/education";

export default function Education() {
  return (
    <Section id="education">
      {education.map((item) => (
        <article key={item.school + item.degree}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="font-serif text-lg">{item.degree}</h3>
            <p className="font-mono text-xs text-muted">{item.period}</p>
          </div>
          <p className="mt-1 text-sm">{item.school}</p>
          <p className="text-sm text-muted">{item.specialization}</p>
          {item.honors && <p className="mt-3 text-sm">{item.honors}</p>}
        </article>
      ))}
    </Section>
  );
}