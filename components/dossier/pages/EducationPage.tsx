import Image from "next/image";
import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { Stamp } from "../ui";
import { education, educationMedia } from "@/data/education";

/** Education: the university's own wide mark with its name (left); the graduation portrait above the programme (right). */
export default function EducationPage() {
  const l = sequence();
  const r = sequence();
  const { logo, photo } = educationMedia;
  return (
    <Page
      id="education"
      left={
        <div className="d-stack d-stack-center">
          <Write as="h2" className="d-act" {...l(10)}>
            <span className="d-act-no">04</span> Education
          </Write>
          <Write as="div" mode="image" className="d-edu-logo" {...l(40)}>
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} sizes="(min-width: 1024px) 460px, 80vw" loading="eager" />
          </Write>
          {education.map((item) => (
            <Write key={item.school} as="p" className="d-display d-display-md" {...l(item.school.length)}>
              {item.school}
            </Write>
          ))}
          <Rule className="d-rule-gap" {...l()} />
        </div>
      }
      right={
        <div className="d-stack d-stack-center">
          <Write as="figure" mode="image" className="d-grad" {...r(60)}>
            <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 1024px) 340px, 70vw" loading="lazy" decoding="async" />
          </Write>
          {education.map((item) => (
            <article key={item.school + item.degree} className="d-edu">
              <Write as="h3" className="d-title" {...r(item.degree.length)}>
                {item.degree}
              </Write>
              <Write as="p" className="d-p" {...r(item.specialization.length)}>
                {item.specialization}
              </Write>
              <Write as="p" className="d-meta" {...r(20)}>
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
