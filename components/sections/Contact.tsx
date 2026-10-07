import { Mail } from "lucide-react";
import Section from "@/components/ui/Section";
import { site } from "@/data/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";

const row =
  "flex items-center gap-3 py-3 text-sm transition-colors hover:text-accent";

export default function Contact() {
  return (
    <Section id="contact">
      <p className="max-w-xl leading-relaxed">
        I&apos;m looking for software development, web and mobile development, and
        AI/LLM application roles. Email is the quickest way to reach me.
      </p>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        <li>
          <a href={site.links.email} className={row}>
            <Mail className="size-4" aria-hidden="true" />
            {site.emailAddress}
          </a>
        </li>
        <li>
          <a href={site.links.github} target="_blank" rel="noopener noreferrer" className={row}>
            <GitHubIcon className="size-4" />
            github.com/troytenapasiwen
          </a>
        </li>
        <li>
          <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className={row}>
            <LinkedInIcon className="size-4" />
            linkedin.com/in/troypasiwen
          </a>
        </li>
      </ul>
    </Section>
  );
}
