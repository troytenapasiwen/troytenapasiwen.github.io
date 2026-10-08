import type { CSSProperties } from "react";
import Page from "../Page";
import Write, { timing } from "../Write";
import { sequence } from "../sequence";
import { skills } from "@/data/skills";

export default function SkillsPage() {
  const q = sequence(0.08, 0.6, 2.4);
  return (
    <Page id="skills">
      <div className="d-stack">
        <div className="d-head">
          <Write as="h2" mode="line" className="d-act" {...q(10)}>
            <span className="d-act-no">05</span> Skills
          </Write>
          <Write as="p" mode="line" className="d-kicker" {...q(32)}>
            Technical index · system inventory
          </Write>
        </div>

        <div className="d-inventory">
          {skills.map((group, gi) => {
            const { s, d } = q(group.items.length * 14);
            const last = Math.max(group.items.length - 1, 1);
            const id = `skills-${gi}`;
            return (
              <section key={group.category} className="d-inv-group" aria-labelledby={id}>
                <h3 id={id} className="d-inv-head">
                  <span className="d-inv-letter">{String.fromCharCode(65 + gi)}</span>
                  <span>{group.category}</span>
                  <span className="d-inv-count">{String(group.items.length).padStart(2, "0")}</span>
                </h3>
                <ul
                  className="write write-stagger d-inv-list"
                  style={timing(s, d)}
                  data-write=""
                >
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
          })}
        </div>
      </div>
    </Page>
  );
}
