import type { CSSProperties, ReactNode } from "react";
import Write, { timing } from "./Write";
import type { Seq } from "./sequence";
import { TechChip } from "@/components/ui/TechChip";

/** A list whose bullets are each written in turn. */
export function Bullets({ items, q }: { items: string[]; q: Seq }) {
  return (
    <ul className="d-bullets">
      {items.map((text) => (
        <Write key={text} as="li" mode="bullet" {...q(text.length)}>
          {text}
        </Write>
      ))}
    </ul>
  );
}

/** Technologies: a logo and a name each, set onto the page one after another. */
export function TagList({ items, label, q }: { items: string[]; label: string; q: Seq }) {
  if (items.length === 0) return null;
  const { dl, du } = q(24);
  return (
    <ul className="write write-stagger write-chips d-tags" style={timing(dl, du)} aria-label={label}>
      {items.map((item, i) => (
        <li key={item} className="d-tag" style={{ "--n": i } as CSSProperties}>
          <TechChip name={item} />
        </li>
      ))}
    </ul>
  );
}

/** Small caption above a block of text. */
export function Caption({ q, children }: { q: Seq; children: string }) {
  return (
    <Write as="h4" mode="block" className="d-caption" {...q(children.length)}>
      {children}
    </Write>
  );
}

/**
 * States exactly what my role was. This is how the portfolio keeps
 * "contributed to" and "independently developed" clearly apart.
 */
export function RoleNote({ q, solo = false, children }: { q: Seq; solo?: boolean; children: string }) {
  return (
    <Write as="p" mode="block" className={`d-rolenote ${solo ? "d-rolenote-solo" : ""}`} {...q(children.length)}>
      {children}
    </Write>
  );
}

export function Stamp({ q, children }: { q: Seq; children: ReactNode }) {
  return (
    <Write as="p" mode="stamp" className="d-stamp" {...q(20)}>
      {children}
    </Write>
  );
}
