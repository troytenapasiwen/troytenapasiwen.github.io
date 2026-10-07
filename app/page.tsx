import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Section from "@/components/ui/Section";

function Placeholder({ id }: { id: string }) {
  return (
    <Section id={id}>
      <p className="text-muted">Coming in a later stage.</p>
      <div className="h-40" />
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Placeholder id="projects" />
      <Placeholder id="skills" />
      <Education />
      <Placeholder id="contact" />
    </>
  );
}