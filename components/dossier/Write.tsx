import { Fragment } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Write: the one primitive behind every "being written onto the page" effect.
 *
 * It does no animating itself. It only declares *when* in a page's progress it
 * should be written (s = start, d = duration, both 0..1). CSS in globals.css turns
 * that into a `--r` value (0 → 1) and the modes below style themselves from it:
 *
 *   words  each word settles into place, a touch of accent "wet ink" fading to text colour
 *   line   a masked left-to-right wipe with a thin pen mark at the writing edge (headings)
 *   block  fade and rise (generic blocks)
 *   stamp  a small label that is pressed onto the page
 *
 * It renders plain, static markup, so it works as a server component and the full text
 * is always in the HTML (SEO, no-JS, reduced motion, screen readers).
 */

type Mode = "words" | "line" | "block" | "stamp";

type WriteProps = {
  as?: ElementType;
  mode?: Mode;
  s: number;
  d: number;
  className?: string;
  id?: string;
  children: ReactNode;
};

export function timing(s: number, d: number): CSSProperties {
  return { "--s": s.toFixed(3), "--k": (1 / d).toFixed(3) } as CSSProperties;
}

export default function Write({
  as: Tag = "p",
  mode = "words",
  s,
  d,
  className = "",
  id,
  children,
}: WriteProps) {
  const cls = `write write-${mode} ${className}`.trim();

  if (mode === "words" && typeof children === "string") {
    const words = children.split(" ");
    const last = Math.max(words.length - 1, 1);
    return (
      <Tag className={cls} style={timing(s, d)} data-write="" id={id}>
        {words.map((word, i) => (
          <Fragment key={i}>
            <span
              className="w"
              style={{ "--i": (i / last).toFixed(3) } as CSSProperties}
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </Tag>
    );
  }

  if (mode === "line") {
    return (
      <Tag className={cls} style={timing(s, d)} data-write="" id={id}>
        <span className="ink">{children}</span>
      </Tag>
    );
  }

  return (
    <Tag className={cls} style={timing(s, d)} data-write="" id={id}>
      {children}
    </Tag>
  );
}

/** A hairline that is drawn across the page. */
export function Rule({ s, d, className = "" }: { s: number; d: number; className?: string }) {
  return (
    <div
      className={`write write-rule d-rule ${className}`.trim()}
      style={timing(s, d)}
      data-write=""
      aria-hidden="true"
    />
  );
}
