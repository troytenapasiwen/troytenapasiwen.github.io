import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Write: the one primitive behind every "appears on the page" effect.
 *
 * It does no animating itself. It only declares *when* in a sheet's reveal progress it should appear
 * (s = start, d = duration, both 0..1). CSS in globals.css turns that into a `--r` value (0 -> 1):
 *
 *   words / line / block   a calm fade with a very small rise, one block at a time
 *   stamp                  a small label that is pressed onto the page
 *
 * The reveal progress follows the page turn that uncovers the sheet, so it reverses cleanly when
 * scrolling up and never restarts. The full text is always in the HTML (SEO, no-JS, reduced motion,
 * screen readers); once a sheet is fully revealed CSS drops every transform, so text is crisp.
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

export default function Write({ as: Tag = "p", mode = "block", s, d, className = "", id, children }: WriteProps) {
  const cls = `write write-${mode === "stamp" ? "stamp" : "block"} ${className}`.trim();
  return (
    <Tag className={cls} style={timing(s, d)} id={id}>
      {children}
    </Tag>
  );
}

/** A hairline that is drawn across the page. */
export function Rule({ s, d, className = "" }: { s: number; d: number; className?: string }) {
  return <div className={`write write-rule d-rule ${className}`.trim()} style={timing(s, d)} aria-hidden="true" />;
}
