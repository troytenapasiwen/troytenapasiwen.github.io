"use client";

import { useEffect, useRef } from "react";
import { navItems, site } from "@/data/site";
import ThemeToggle from "@/components/layout/ThemeToggle";

type Props = {
  active: string | null;
  onJump: (id: string) => void;
  plain: boolean;
  canToggle: boolean;
  onTogglePlain: () => void;
};

/** Always-visible navigation: where you are, where else you can go, and a way to skip the animation. */
export default function Topbar({ active, onJump, plain, canToggle, onTogglePlain }: Props) {
  const navRef = useRef<HTMLElement>(null);

  // On narrow screens the nav scrolls sideways; keep the current section in view.
  useEffect(() => {
    if (!active) return;
    navRef.current
      ?.querySelector('[aria-current="location"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  return (
    <header className="d-topbar">
      <div className="d-topbar-inner">
        <a
          href="#top"
          className="d-brand"
          aria-label={`${site.name}, back to the start`}
          onClick={(e) => {
            e.preventDefault();
            onJump("top");
          }}
        >
          {site.name}
        </a>

        <nav ref={navRef} aria-label="Sections" className="d-nav">
          <ul>
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onJump(item.id);
                  }}
                >
                  <span className="d-nav-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="d-tools">
          {canToggle && (
            <button
              type="button"
              className="d-toggle"
              aria-pressed={plain}
              onClick={onTogglePlain}
              title={plain ? "Switch to the animated dossier" : "Show everything as a plain document"}
            >
              {plain ? "Animated view" : "Plain view"}
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
      <div className="d-progress" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}
