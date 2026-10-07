import Link from "next/link";
import { Mail } from "lucide-react";
import { site } from "@/data/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";

const iconLink = "rounded p-2 text-muted transition-colors hover:text-fg";

export default function Sidebar() {
  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:justify-between lg:border-r lg:border-line lg:p-8">
      <div>
        <Link href="/" className="font-serif text-2xl tracking-tight">
          {site.name}
        </Link>
        <p className="mt-3 text-sm">{site.role}</p>
        <p className="text-sm text-muted">{site.focus}</p>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
          {site.subtitle}
        </p>

        <NavLinks variant="sidebar" />
      </div>

      <div className="-ml-2 flex items-center gap-1">
        <a href={site.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLink}>
          <GitHubIcon className="size-4.5" />
        </a>
        <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLink}>
          <LinkedInIcon className="size-4.5" />
        </a>
        <a href={site.links.email} aria-label="Email" className={iconLink}>
          <Mail className="size-4.5" aria-hidden="true" />
        </a>
        <ThemeToggle />
      </div>
    </aside>
  );
}
