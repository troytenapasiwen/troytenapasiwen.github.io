import Image from "next/image";
import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { site } from "@/data/site";

export default function IntroPage() {
  const q = sequence(0.07);
  return (
    <Page id="intro">
      <div className="d-cols d-cols-intro">
        <div className="d-col d-col-center">
          <Write as="h2" mode="line" className="d-act" {...q(12)}>
            <span className="d-act-no">01</span> Introduction
          </Write>
          <Write as="p" mode="line" className="d-display" {...q(12)}>
            {site.name}
          </Write>
          <Write as="p" mode="words" className="d-role" {...q(site.headline)}>
            {site.headline}
          </Write>
          <Rule className="d-rule-gap" {...q(30)} />
          <Write as="p" mode="words" className="d-meta" {...q(site.subtitle)}>
            {site.subtitle}
          </Write>
        </div>
        <div className="d-col d-col-center d-col-about">
          <figure className="d-portrait">
            <Image
              src="/troy.jpg"
              alt="Portrait of Troy Pasiwen"
              width={900}
              height={1100}
              priority
              className="d-portrait-image"
            />
            <figcaption className="d-portrait-caption">Troy Pasiwen</figcaption>
          </figure>
        </div>
      </div>
    </Page>
  );
}
