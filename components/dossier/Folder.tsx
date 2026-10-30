import { site } from "@/data/site";

/**
 * The cover of the dossier: one physical object that stays the same object for the whole sequence.
 *
 *   shell   `.d-lid-holder` > `.d-lid` > `.d-lid-front`. It is built in PORTRAIT proportions. In its
 *           starting state the shell is simply turned a quarter turn (CSS rotateZ), so landscape and
 *           portrait are the same folder seen at different points of one rotation, never two objects.
 *   lid     hinged on the left (spine) edge. Opening swings it right -> left about that edge; its
 *           front is the cover, its back is the inside of the cover (a plain board the first page of
 *           paper lies on). Closing is the same motion played backwards.
 *   print   `.d-cover` is the lettering printed on the cover. It is sized to the folder's *visual*
 *           box (which morphs from landscape to portrait) and counter-rotates so the type stays
 *           upright and readable while the shell turns beneath it.
 *
 * The cover carries only what a real folder would: a tab, a reference line, the owner's name and role. Everything
 * else is found by opening it. Dossier.tsx writes progress onto the elements marked `data-drive`; globals.css turns
 * that into transforms.
 */
export default function Folder() {
  const nameParts = site.name.split(" ");
  const initials = nameParts.map((p) => p[0]).join("");

  return (
    <div className="d-lid-holder" data-drive>
      <span className="d-spine d-orn" aria-hidden="true" />

      <div className="d-lid" data-drive>
        {/* FRONT: the cover */}
        <div className="d-lid-face d-lid-front" data-drive>
          <span className="d-lid-shade" data-drive aria-hidden="true" />
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
                <div>
                  <span>Portfolio dossier</span>
                  <span>Ref · {site.domain}</span>
                </div>
                <span className="d-index-mark">{initials}</span>
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
            </div>
          </div>
        </div>

        {/* BACK: the inside of the cover, seen as the lid swings open and then lies flat on the left */}
        <div className="d-lid-face d-lid-back" aria-hidden="true" />
      </div>
    </div>
  );
}
