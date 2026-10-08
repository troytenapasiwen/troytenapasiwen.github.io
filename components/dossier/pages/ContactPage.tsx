import { Mail } from "lucide-react";
import Page from "../Page";
import Write, { Rule, timing } from "../Write";
import { sequence } from "../sequence";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { site } from "@/data/site";

const closing =
  "I’m looking for software development, web and mobile development, and AI/LLM application roles. Email is the quickest way to reach me.";

export default function ContactPage() {
  const q = sequence(0.1, 0.5, 2.6);
  const rows = [
    { href: site.links.email, text: site.emailAddress, icon: <Mail className="size-4" aria-hidden="true" />, external: false },
    { href: site.links.github, text: `github.com/${site.handle}`, icon: <GitHubIcon className="size-4" />, external: true },
    { href: site.links.linkedin, text: "linkedin.com/in/troypasiwen", icon: <LinkedInIcon className="size-4" />, external: true },
  ];
  const list = q(120);

  return (
    <Page id="contact">
      <div className="d-center-block">
        <Write as="h2" mode="line" className="d-act" {...q(10)}>
          <span className="d-act-no">06</span> Contact
        </Write>
        <Write as="p" mode="words" className="d-lead d-lead-wide" {...q(closing)}>
          {closing}
        </Write>

        <ul className="write write-stagger d-contact" style={timing(list.s, list.d)} data-write="">
          {rows.map((row, i) => (
            <li key={row.href} style={{ "--i": (i / (rows.length - 1)).toFixed(3) } as React.CSSProperties}>
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
            <li style={{ "--i": 1 } as React.CSSProperties}>
              <a href={site.resume} download className="d-contact-link">
                <span>Download resume</span>
              </a>
            </li>
          )}
        </ul>

        <Rule className="d-rule-gap" {...q(30)} />
        <Write as="div" mode="block" className="d-end" {...q(40)}>
          <span>
            © {new Date().getFullYear()} {site.name} · {site.domain}
          </span>
          <span>End of dossier</span>
          <a href="#top" className="d-backtop">
            Back to the folder
          </a>
        </Write>
      </div>
    </Page>
  );
}
