import Link from "next/link";
import { navItems, site } from "@/data/site";
import ThemeToggle from "./ThemeToggle";

export default function MobileNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg lg:hidden">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="font-serif text-lg tracking-tight">
          {site.name}
        </Link>
        <ThemeToggle />
      </div>
      <nav aria-label="Sections" className="overflow-x-auto">
        <ul className="flex gap-5 whitespace-nowrap px-6 pb-3 text-sm">
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-muted transition-colors hover:text-fg">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}