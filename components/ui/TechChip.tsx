import { Accessibility, Bot, BrainCircuit, Clapperboard, Cloud, Code, Coffee, Database, FlaskConical, Gauge, Megaphone, MonitorSmartphone, Smartphone, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { techMarks } from "./techMarks";

/**
 * Maps the technology names used in the portfolio data to a vendored mark (see techMarks.ts).
 * A name that is not listed here has no official mark available. Nothing is redrawn and no other company's logo is
 * used as a stand-in: such a name gets a generic icon from `iconFor` below, or (if neither exists) text only.
 */
const markFor: Record<string, string> = {
  "Next.js": "nextdotjs",
  React: "react",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Firebase: "firebase",
  "Tailwind CSS": "tailwindcss",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  PostgreSQL: "postgresql",
  Python: "python",
  Streamlit: "streamlit",
  // Streamlit's own hosting service, shown with the Streamlit mark.
  "Streamlit Community Cloud": "streamlit",
  Ollama: "ollama",
  "Google Maps Directions API": "googlemaps",
  MySQL: "mysql",
  Git: "git",
  GitHub: "github",
  Figma: "figma",
  Canva: "canva",
  Vercel: "vercel",
  Pydantic: "pydantic",
  Flutter: "flutter",
  Lighthouse: "lighthouse",
  "OWASP ZAP": "zap",
};

/**
 * Skills and tools that have no official mark available (or no brand at all): a plain line icon from the site's own
 * icon set (lucide), drawn in the text colour. These are generic pictograms, not logos.
 */
const iconFor: Record<string, LucideIcon> = {
  "HTML/CSS": Code,
  Java: Coffee,
  "Cloud Firestore": Database,
  ChromaDB: Database,
  Render: Cloud,
  "Microsoft SQL Server": Database,
  "Llama 3.2": Bot,
  "AI-Assisted Development": Sparkles,
  "LLM Tools": BrainCircuit,
  "Software Testing": FlaskConical,
  Apptim: Gauge,
  WAVE: Accessibility,
  BrowserStack: MonitorSmartphone,
  "Firebase Test Lab": Smartphone,
  CapCut: Clapperboard,
  "Meta Business Suite": Megaphone,
};

/** Marks whose official colour is (near) black are drawn in the text colour so they also read on the black cover. */
const MONO = new Set(["000000", "0A0A0A", "181717"]);

export function hasMark(name: string) {
  return Boolean(markFor[name]);
}

/** The mark for a technology, else a generic icon, else a small neutral tick (keeps rows aligned). */
export function TechIcon({ name, className = "" }: { name: string; className?: string }) {
  const key = markFor[name];
  const mark = key ? techMarks[key] : undefined;
  if (!mark) {
    const Generic = iconFor[name];
    if (Generic) return <Generic className={`tc-ico tc-ico-line ${className}`.trim()} strokeWidth={1.75} aria-hidden="true" focusable="false" />;
    return <span className={`tc-none ${className}`.trim()} aria-hidden="true" />;
  }
  const mono = MONO.has(mark.hex.toUpperCase());
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`tc-ico ${className}`.trim()} fill={mono ? "currentColor" : `#${mark.hex}`}>
      <path d={mark.path} />
    </svg>
  );
}

/** A compact logo + name pair. Renders a <span>, so it can sit inside any list item or sentence. */
export function TechChip({ name }: { name: string }) {
  return (
    <span className="tc">
      <TechIcon name={name} />
      <span className="tc-name">{name}</span>
    </span>
  );
}
