"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/site";

export default function NavLinks({
  variant,
}: {
  variant: "sidebar" | "mobile";
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const current = onHome ? active : null;

  // Track which section is under the reading line (30% down the viewport).
  useEffect(() => {
    if (!onHome) return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    function update() {
      const line = window.innerHeight * 0.3;
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      let found: string | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) found = el.id;
      }
      if (atBottom && sections.length > 0) {
        found = sections[sections.length - 1].id;
      }
      setActive(found);
    }

    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [onHome]);

  // On mobile, keep the active link visible in the sideways-scrolling row.
  useEffect(() => {
    if (variant !== "mobile" || !current) return;
    navRef.current
      ?.querySelector('[aria-current="location"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [current, variant]);

  if (variant === "sidebar") {
    return (
      <nav ref={navRef} aria-label="Sections" className="mt-10">
        <ul>
          {navItems.map((item, i) => {
            const isActive = current === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative flex items-baseline gap-3 py-1.5 text-sm transition-colors hover:text-fg ${
                    isActive ? "text-fg" : "text-muted"
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 top-1/2 h-px w-3 bg-accent"
                    />
                  )}
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav ref={navRef} aria-label="Sections" className="overflow-x-auto">
      <ul className="flex gap-5 whitespace-nowrap px-6 pb-2 text-sm">
        {navItems.map((item) => {
          const isActive = current === item.id;
          return (
            <li key={item.id}>
              <Link
                href={`/#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block border-b-2 py-1 transition-colors hover:text-fg ${
                  isActive
                    ? "border-accent text-fg"
                    : "border-transparent text-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
