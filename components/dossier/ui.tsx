import type { CSSProperties, ReactNode } from "react";
import Write, { timing } from "./Write";
import type { Seq } from "./sequence";

/** A list whose bullets are each written in turn. */
export function Bullets({ items, q }: { items: string[]; q: Seq }) {
  return (
    <ul className="d-bullets">
      {items.map((text) => (
        <Write key={text} as="li" mode="words" {...q(text)}>
          {text}
        </Write>
      ))}
    </ul>
  );
}

/** Technology tags that are set onto the page one after another. */
export function TagList({
  items,
  label,
  q,
}: {
  items: string[];
  label: string;
  q: Seq;
}) {
  if (items.length === 0) return null;
  const { s, d } = q(items.length * 8);
  const last = Math.max(items.length - 1, 1);
  return (
    <ul
      className="write write-stagger d-tags"
      style={timing(s, d)}
      data-write=""
      aria-label={label}
    >
      {items.map((item, i) => (
        <li
          key={item}
          className="d-tag"
          style={{ "--i": (i / last).toFixed(3) } as CSSProperties}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Small mono caption above a block of text. */
export function Caption({ q, children }: { q: Seq; children: string }) {
  return (
    <Write as="h4" mode="line" className="d-caption" {...q(children)}>
      {children}
    </Write>
  );
}

/**
 * States exactly what my role was. This is how the portfolio keeps
 * "contributed to" and "independently developed" clearly apart.
 */
export function RoleNote({
  q,
  solo = false,
  children,
}: {
  q: Seq;
  solo?: boolean;
  children: string;
}) {
  return (
    <Write
      as="p"
      mode="block"
      className={`d-rolenote ${solo ? "d-rolenote-solo" : ""}`}
      {...q(children)}
    >
      {children}
    </Write>
  );
}

export function Stamp({
  q,
  children,
}: {
  q: Seq;
  children: ReactNode;
}) {
  return (
    <Write as="p" mode="stamp" className="d-stamp" {...q(18)}>
      {children}
    </Write>
  );
}
