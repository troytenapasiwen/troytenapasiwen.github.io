import { ArrowDown, Download, Mail } from "lucide-react";
import { site } from "@/data/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

const primary =
  "inline-flex items-center gap-2 rounded bg-fg px-4 py-2 text-sm text-bg transition-opacity hover:opacity-85";
const secondary =
  "inline-flex items-center gap-2 rounded border border-line px-4 py-2 text-sm transition-colors hover:border-muted";

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pb-16">
      <h1
        id="hero-heading"
        className="font-serif text-4xl tracking-tight sm:text-5xl"
      >
        {site.name}
      </h1>
      <p className="mt-3 text-lg text-muted">{site.headline}</p>
      <p className="mt-6 max-w-xl leading-relaxed">{site.intro}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href="#projects" className={primary}>
          View Projects
          <ArrowDown className="size-4" aria-hidden="true" />
        </a>
        <a
          href={site.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={secondary}
        >
          <GitHubIcon className="size-4" />
          GitHub
        </a>
        <a
          href={site.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={secondary}
        >
          <LinkedInIcon className="size-4" />
          LinkedIn
        </a>
        <a href="#contact" className={secondary}>
          <Mail className="size-4" aria-hidden="true" />
          Contact
        </a>
        {site.resume && (
          <a href={site.resume} download className={secondary}>
            <Download className="size-4" aria-hidden="true" />
            Resume
          </a>
        )}
      </div>
    </section>
  );
}