import { ArrowDown } from "lucide-react";
import { site, navItems } from "@/data/site";

/**
 * The cover of the dossier.
 *
 * The lid is a two-sided plane hinged on the left edge: its front is the cover,
 * its back is the inside of the cover. Scroll progress (--f, set on the root by
 * Dossier.tsx) swings it open in CSS, so this component is plain static markup.
 *
 * `d-folder-base` is only used on mobile / tablet, where the lid opens over a
 * dark panel instead of over the pinned dossier frame.
 */
export default function Folder() {
  return (
    <div className="d-lid-holder">
      <div className="d-folder-base" aria-hidden="true">
        <div className="d-folder-inner">
          <span>Introduction</span>
          <i /> <i /> <i /> <i />
        </div>
      </div>

      <div className="d-lid">
        {/* FRONT: the cover */}
        <div className="d-lid-face d-lid-front">
          <span className="d-lid-tab d-orn" aria-hidden="true">
            Portfolio
          </span>
          <span className="d-crop d-crop-tl d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-tr d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-bl d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-br d-orn" aria-hidden="true" />
          <span className="d-sheen d-orn" aria-hidden="true" />

          <div className="d-cover">
            <div className="d-cover-top d-orn" aria-hidden="true">
              <span>Portfolio dossier</span>
              <span>Ref · {site.domain}</span>
            </div>

            <div className="d-cover-main">
              <h1 className="d-cover-name">{site.name}</h1>
              <p className="d-cover-role">{site.headline}</p>
            </div>

            <div className="d-cover-bottom d-orn">
              <div>
                <span className="d-cover-label">Education</span>
                <span>{site.subtitle}</span>
              </div>
              <div className="d-cover-contents" aria-hidden="true">
                <span className="d-cover-label">Contents</span>
                <span>
                  {navItems.map((n, i) => `${String(i + 1).padStart(2, "0")} ${n.label}`).join("  ·  ")}
                </span>
              </div>
              <div className="d-cover-cue" aria-hidden="true">
                <span>Scroll to open</span>
                <ArrowDown className="size-4" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK: the inside of the cover, seen while the lid swings open */}
        <div className="d-lid-face d-lid-back" aria-hidden="true">
          <div className="d-lid-back-inner">
            <span className="d-cover-label">Contents</span>
            <ol>
              {navItems.map((n, i) => (
                <li key={n.id}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {n.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
