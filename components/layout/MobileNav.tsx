import Link from "next/link";
import { site } from "@/data/site";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";

export default function MobileNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg lg:hidden">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="font-serif text-lg tracking-tight">
          {site.name}
        </Link>
        <ThemeToggle />
      </div>
      <NavLinks variant="mobile" />
    </header>
  );
}
