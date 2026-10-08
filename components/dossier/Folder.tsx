import { ArrowDown } from "lucide-react";
import { site, navItems } from "@/data/site";

/**
 * The cover of the dossier: one physical object that stays the same object for the whole intro.
 *
 *   shell   `.d-lid-holder` > `.d-lid` > `.d-lid-front`. It is built in PORTRAIT proportions. In its
 *           starting state the shell is simply turned a quarter turn (CSS rotateZ), so landscape and
 *           portrait are the same folder seen at different points of one rotation, never two objects.
 *   lid     hinged on the left (spine) edge. Opening swings it right -> left about that edge; its
 *           front is the cover, its back is the inside of the cover.
 *   print   `.d-cover` is the lettering printed on the cover. It is sized to the folder's *visual*
 *           box (which morphs from landscape to portrait) and counter-rotates so the type stays
 *           upright and readable while the shell turns beneath it.
 *
 * Everything here is static markup. Dossier.tsx writes scroll progress onto the elements marked
 * `data-drive` and globals.css turns that into transforms.
 *
 * `d-folder-base` is only used on phones / tablets, where the lid opens over a plain board
 * instead of over the pinned dossier frame.
 */
export default function Folder() {
  const nameParts = site.name.split(" ");

  return (
    <div className="d-lid-holder" data-drive>
      <div className="d-folder-base" aria-hidden="true">
        <div className="d-folder-inner">
          <span>Introduction</span>
          <i /> <i /> <i /> <i />
        </div>
      </div>

      <span className="d-spine d-orn" aria-hidden="true" />

      <div className="d-lid" data-drive>
        {/* FRONT: the cover */}
        <div className="d-lid-face d-lid-front" data-drive>
          <span className="d-lid-tab d-orn" aria-hidden="true">
            Portfolio
          </span>
          <span className="d-crease d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-tl d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-tr d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-bl d-orn" aria-hidden="true" />
          <span className="d-crop d-crop-br d-orn" aria-hidden="true" />

          <div className="d-cover" data-drive>
           <div className="d-print">
              <div className="d-cover-top d-orn" aria-hidden="true">
                <span>Portfolio dossier</span>
                <span>Ref · {site.domain}</span>
              </div>

              <div className="d-cover-main">
                <h1 className="d-cover-name">
                  {nameParts.map((part, i) => (
                    <span key={i}>
                      <span className="d-nw">{part}</span>
                      {i < nameParts.length - 1 ? " " : ""}
                    </span>
                  ))}
                </h1>
                <p className="d-cover-role">{site.headline}</p>
              </div>

              <div className="d-cover-contents d-orn" aria-hidden="true">
                <span className="d-cover-label">Contents</span>
                <span>
                  {navItems.map((n, i) => `${String(i + 1).padStart(2, "0")} ${n.title}`).join("  ·  ")}
                </span>
              </div>

              <div className="d-cover-bottom d-orn">
                <div>
                  <span className="d-cover-label">Education</span>
                  <span>{site.subtitle}</span>
                </div>
                <div className="d-cover-cue" aria-hidden="true">
                  <span>Scroll</span>
                  <ArrowDown className="size-4" />
                </div>
              </div>
             </div>
          </div>
        </div>

        {/* BACK: the inside of the cover, seen as the lid swings open and then lies flat on the left */}
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
            <span className="d-lid-back-foot">
              {site.name} · {site.domain}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
