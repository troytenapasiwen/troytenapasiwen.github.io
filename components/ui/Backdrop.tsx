/**
 * The desk the folder sits on: a fixed, purely decorative layer behind everything.
 *
 * It is built like a printed work table rather than a wallpaper, and it shares the folder's light (from the top left):
 * a technical grid laid on a receding plane, with registration marks, loose sheets lying under the folder (each a small
 * stack with visible thickness and a contact shadow), a strip of empty contact-sheet frames, a ruler along the left edge, an
 * oversized outlined monogram, and a few small orange marks that tie the desk to the folder's tab. Paper grain and
 * a soft vignette sit on top of all of it.
 *
 * It never takes part in layout or interaction (pointer-events: none, aria-hidden). Only a few elements move, very
 * slowly and only by transform; on phones, with reduced motion, and in the plain edition nothing moves at all.
 */
const FRAMES = Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function Backdrop() {
  return (
    <div className="bd" aria-hidden="true">
      <div className="bd-glow" />
      <div className="bd-plane">
        <div className="bd-grid" />
      </div>
      <div className="bd-far" />
      <div className="bd-ruler" />
      <div className="bd-sheet bd-sheet-a">
        <i /> <i /> <i /> <i /> <i />
      </div>
      <div className="bd-sheet bd-sheet-b">
        <i /> <i /> <i /> <i />
      </div>
      <div className="bd-sheet bd-sheet-c">
        <i /> <i /> <i />
      </div>
      <div className="bd-strip">
        <div className="bd-strip-track">
          {[...FRAMES, ...FRAMES].map((n, i) => (
            <span key={i} data-hot={n === "07" ? "1" : "0"}>
              {n}
            </span>
          ))}
        </div>
      </div>
      <div className="bd-mono">TP</div>
      <div className="bd-line bd-line-v" />
      <div className="bd-line bd-line-h" />
      <i className="bd-reg bd-reg-tl" />
      <i className="bd-reg bd-reg-tr" />
      <i className="bd-reg bd-reg-bl" />
      <i className="bd-reg bd-reg-br" />
      <div className="bd-grain" />
      <div className="bd-vignette" />
    </div>
  );
}
