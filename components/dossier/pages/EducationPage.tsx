import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { Stamp } from "../ui";
import { education } from "@/data/education";

export default function EducationPage() {
  const q = sequence(0.1, 0.5, 2.6);
  return (
    <Page id="education">
      <div className="d-center-block">
        <Write as="h2" mode="line" className="d-act" {...q(10)}>
          <span className="d-act-no">04</span> Education
        </Write>
        {education.map((item) => (
          <article key={item.school + item.degree} className="d-edu">
            <Write as="p" mode="line" className="d-display d-display-md" {...q(item.school)}>
              {item.school}
            </Write>
            <Rule className="d-rule-gap" {...q(30)} />
            <Write as="h3" mode="words" className="d-title" {...q(item.degree)}>
              {item.degree}
            </Write>
            <Write as="p" mode="words" className="d-p" {...q(item.specialization)}>
              {item.specialization}
            </Write>
            <Write as="p" mode="words" className="d-meta" {...q(item.period)}>
              {item.period}
            </Write>
            {item.honors && <Stamp q={q}>{item.honors}</Stamp>}
          </article>
        ))}
      </div>
    </Page>
  );
}
