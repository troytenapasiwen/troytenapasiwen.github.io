import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { Stamp } from "../ui";
import { education } from "@/data/education";

export default function EducationPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="education"
      left={
        <div className="d-stack d-stack-center">
          <Write as="h2" className="d-act" {...l()}>
            <span className="d-act-no">04</span> Education
          </Write>
          {education.map((item) => (
            <Write key={item.school} as="p" className="d-display d-display-md" {...l()}>
              {item.school}
            </Write>
          ))}
          <Rule className="d-rule-gap" {...l()} />
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
          {education.map((item) => (
            <article key={item.school + item.degree} className="d-edu">
              <Write as="h3" className="d-title" {...r()}>
                {item.degree}
              </Write>
              <Write as="p" className="d-p" {...r()}>
                {item.specialization}
              </Write>
              <Write as="p" className="d-meta" {...r()}>
                {item.period}
              </Write>
              {item.honors && <Stamp q={r}>{item.honors}</Stamp>}
            </article>
          ))}
        </div>
      }
    />
  );
}
