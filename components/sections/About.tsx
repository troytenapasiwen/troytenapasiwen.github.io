import Section from "@/components/ui/Section";
import { site } from "@/data/site";

export default function About() {
  return (
    <Section id="about">
      <div className="space-y-4 leading-relaxed">
        {site.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}