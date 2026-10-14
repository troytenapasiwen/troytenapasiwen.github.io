import type { CSSProperties } from "react";
import { Mail } from "lucide-react";
import Page from "../Page";
import Write, { Rule, timing } from "../Write";
import { sequence } from "../sequence";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { site } from "@/data/site";

const closing =
  "I’m looking for software development, web and mobile development, and AI/LLM application roles. Email is the quickest way to reach me.";

export default function ContactPage() {
  const l = sequence();
  const r = sequence();
  const rows = [
    { href: site.links.email, text: site.emailAddress, icon: <Mail className="size-4" aria-hidden="true" />, external: false },
    { href: site.links.github, text: `github.com/${site.handle}`, icon: <GitHubIcon className="size-4" />, external: true },
    { href: site.links.linkedin, text: "linkedin.com/in/troypasiwen", icon: <LinkedInIcon className="size-4" />, external: true },
  ];
  const list = r();

  return (
    <Page
      id="contact"
      left={
        <div className="d-stack d-stack-center">
          <Write as="h2" className="d-act" {...l()}>
            <span className="d-act-no">06</span> Contact
          </Write>
          <Write as="p" className="d-lead" {...l()}>
            {closing}
          </Write>
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
          <ul className="write write-stagger d-contact" style={timing(list.s, list.d)}>
            {rows.map((row, i) => (
              <li key={row.href} style={{ "--i": (i / (rows.length - 1)).toFixed(3) } as CSSProperties}>
                <a
                  href={row.href}
                  {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="d-contact-link"
                >
                  {row.icon}
                  <span>{row.text}</span>
                </a>
              </li>
            ))}
            {site.resume && (
              <li style={{ "--i": 1 } as CSSProperties}>
                <a href={site.resume} download className="d-contact-link">
                  <span>Download resume</span>
                </a>
              </li>
            )}
          </ul>
          <Rule className="d-rule-gap" {...r()} />
          <Write as="div" className="d-end" {...r()}>
            <span>
              © {new Date().getFullYear()} {site.name} · {site.domain}
            </span>
            <span>End of dossier</span>
            <a href="#top" className="d-backtop">
              Back to the folder
            </a>
          </Write>
        </div>
      }
    />
  );
}
