import Image from "next/image";
import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { site } from "@/data/site";

export default function IntroPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="intro"
      left={
        <div className="d-stack d-stack-center">
          <Write as="h2" className="d-act" {...l()}>
            <span className="d-act-no">01</span> Introduction
          </Write>
          <Write as="p" className="d-display" {...l()}>
            {site.name}
          </Write>
          <Write as="p" className="d-role" {...l()}>
            {site.headline}
          </Write>
          <Rule className="d-rule-gap" {...l()} />
          <Write as="p" className="d-meta" {...l()}>
            {site.subtitle}
          </Write>
        </div>
      }
      right={
        <Write as="figure" className="d-portrait" {...r()}>
          <Image
            src="/troy.jpg"
            alt="Portrait of Troy Pasiwen"
            width={900}
            height={1100}
            loading="eager"
            fetchPriority="low"
            className="d-portrait-image"
          />
          <figcaption className="d-portrait-caption">Troy Pasiwen</figcaption>
        </Write>
      }
    />
  );
}
