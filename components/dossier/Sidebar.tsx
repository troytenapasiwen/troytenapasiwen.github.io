"use client";

import { useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { navItems, site } from "@/data/site";

type Props = {
  active: string | null;
  onJump: (id: string) => void;
  plain: boolean;
  canToggle: boolean;
  onTogglePlain: () => void;
  /** Text for the small page counter, e.g. "03 / 12". */
  folio: string;
};

/**
 * The left-hand navigation: where you are, where else you can go, and a way to skip the animation.
 *
 * It is a real nav, not decoration: every entry is an anchor to its section (#about, #experience, ...),
 * the current section carries aria-current, and clicking jumps straight there.
 *
 * It is marked `data-drive`, so Dossier.tsx writes the scroll-driven `--sb` onto it and CSS slides it in
 * only after the folder has become portrait. On phones and tablets it is a slim rail of section numbers.
 */
export default function Sidebar({ active, onJump, plain, canToggle, onTogglePlain, folio }: Props) {
  const navRef = useRef<HTMLElement>(null);

  // If the list is taller than the screen (short windows), keep the current section in view.
  useEffect(() => {
    if (!active) return;
    navRef.current
      ?.querySelector('[aria-current="location"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <aside className="d-sidebar" data-drive>
      <a
        href="#top"
        className="d-brand"
        aria-label={`${site.name}, back to the start`}
        onClick={(e) => {
          e.preventDefault();
          onJump("top");
        }}
      >
        <span className="d-brand-name">{site.name}</span>
        <span className="d-brand-sub">Portfolio dossier</span>
      </a>

      <nav ref={navRef} aria-label="Sections" className="d-nav">
        <ul>
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                title={item.title}
                aria-current={active === item.id ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onJump(item.id);
                }}
              >
                <span className="d-nav-no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="d-nav-label">{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="d-side-foot">
        <span className="d-folio" aria-hidden="true">
          {folio}
        </span>
        {canToggle && (
          <button
            type="button"
            className="d-toggle"
            aria-pressed={plain}
            onClick={onTogglePlain}
            title={plain ? "Switch to the animated dossier" : "Show everything as a plain document"}
          >
            <FileText className="size-4 d-toggle-icon" aria-hidden="true" />
            <span className="d-toggle-text">{plain ? "Animated view" : "Plain view"}</span>
          </button>
        )}
      </div>

      <div className="d-progress" aria-hidden="true">
        <span />
      </div>
    </aside>
  );
}
