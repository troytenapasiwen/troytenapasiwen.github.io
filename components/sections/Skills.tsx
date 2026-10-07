import Section from "@/components/ui/Section";
import TechTag from "@/components/ui/TechTag";
import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <Section id="skills">
      <dl className="divide-y divide-line border-y border-line">
        {skills.map((group) => (
          <div
            key={group.category}
            className="grid gap-3 py-4 sm:grid-cols-[11rem_1fr]"
          >
            <dt className="font-mono text-xs text-muted">{group.category}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechTag key={item}>{item}</TechTag>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
