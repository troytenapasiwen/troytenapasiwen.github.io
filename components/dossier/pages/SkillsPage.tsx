import type { CSSProperties } from "react";
import Page from "../Page";
import Write, { timing } from "../Write";
import { sequence, type Seq } from "../sequence";
import { skills } from "@/data/skills";

function Group({ group, gi, q }: { group: (typeof skills)[number]; gi: number; q: Seq }) {
  const { s, d } = q();
  const last = Math.max(group.items.length - 1, 1);
  const id = `skills-${gi}`;
  return (
    <section className="d-inv-group" aria-labelledby={id}>
      <h3 id={id} className="d-inv-head">
        <span className="d-inv-letter">{String.fromCharCode(65 + gi)}</span>
        <span>{group.category}</span>
        <span className="d-inv-count">{String(group.items.length).padStart(2, "0")}</span>
      </h3>
      <ul className="write write-stagger d-inv-list" style={timing(s, d)}>
        {group.items.map((item, i) => (
          <li key={item} style={{ "--i": (i / last).toFixed(3) } as CSSProperties}>
            <span className="d-inv-no" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SkillsPage() {
  const l = sequence();
  const r = sequence();
  const half = Math.ceil(skills.length / 2);
  return (
    <Page
      id="skills"
      left={
        <div className="d-stack">
          <div className="d-head">
            <Write as="h2" className="d-act" {...l()}>
              <span className="d-act-no">05</span> Skills
            </Write>
            <Write as="p" className="d-kicker" {...l()}>
              Technical index · system inventory
            </Write>
          </div>
          {skills.slice(0, half).map((g, i) => (
            <Group key={g.category} group={g} gi={i} q={l} />
          ))}
        </div>
      }
      right={
        <div className="d-stack">
          {skills.slice(half).map((g, i) => (
            <Group key={g.category} group={g} gi={half + i} q={r} />
          ))}
        </div>
      }
    />
  );
}
