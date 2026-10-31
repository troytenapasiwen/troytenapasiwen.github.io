import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Write: the one primitive behind every "appears on the page" effect.
 *
 * It does no animating itself. It only declares *when* (dl = delay, du = duration, both in ms) the block is
 * drawn once its sheet starts to be revealed. globals.css turns that into a transition that runs only while the
 * sheet is marked data-rv="running", which Dossier.tsx does after the page turn has settled:
 *
 *   block   drawn from the top-left corner to the right and down, a soft diagonal wipe with a fade (no movement)
 *   words   short headings only: the words fade in one after the other, left to right
 *   stamp   a small label that is pressed onto the page
 *   image   a photograph or screenshot: uncovered from the top downward, settling by a hair (no distortion)
 *   bullet  a list item: it fades in from just left of its place
 *   letters the one big name on a page: every letter rises into line, one after the other
 *   label   small metadata (numbers, captions): it settles in after the primary content
 *   fade    a whole figure that only needs to be there (its own parts do the moving)
 *
 * Every mode takes the same dl / du from sequence.ts, so choosing a different effect never changes the order or the
 * time a page needs to be drawn.
 *
 * The full text is always in the HTML (SEO, no-JS, screen readers). If the animation engine is not running, or a
 * sheet is marked done, every block is simply visible.
 */

type Mode = "block" | "words" | "letters" | "stamp" | "image" | "bullet" | "fade" | "label";

type WriteProps = {
  as?: ElementType;
  mode?: Mode;
  dl: number;
  du: number;
  className?: string;
  id?: string;
  children: ReactNode;
};

export function timing(dl: number, du: number): CSSProperties {
  return { "--dl": `${dl}ms`, "--du": `${du}ms` } as CSSProperties;
}

function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="wd" style={{ "--n": i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/** Reserves the time a drawing or an arrangement needs (the engine reads the --dl / --du of every .write on a sheet). */
export function Hold({ ms }: { ms: number }) {
  return <i className="write fx-hold" style={{ "--dl": "0ms", "--du": `${ms}ms` } as CSSProperties} aria-hidden="true" />;
}

/** Letters: the text stays whole for assistive technology, the letters are drawn for the eye. */
function Letters({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w, all) => (
          <span key={w} className="lt-word">
            {word.split("").map((ch, c) => (
              <span key={c} className="lt" style={{ "--n": n++ } as CSSProperties}>
                {ch}
              </span>
            ))}
            {w < all.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </>
  );
}

export default function Write({ as: Tag = "p", mode = "block", dl, du, className = "", id, children }: WriteProps) {
  const cls = `write write-${mode} ${className}`.trim();
  const words = mode === "words" && typeof children === "string";
  const letters = mode === "letters" && typeof children === "string";
  return (
    <Tag className={cls} style={timing(dl, du)} id={id}>
      {words ? <Words text={children as string} /> : letters ? <Letters text={children as string} /> : children}
    </Tag>
  );
}

/** A hairline that is drawn across the page. */
export function Rule({ dl, du, className = "" }: { dl: number; du: number; className?: string }) {
  return <div className={`write write-rule d-rule ${className}`.trim()} style={timing(dl, du)} aria-hidden="true" />;
}
