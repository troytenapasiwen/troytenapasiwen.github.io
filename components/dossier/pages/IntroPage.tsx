import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Page from "../Page";
import Write, { Rule } from "../Write";
import { sequence } from "../sequence";
import { site } from "@/data/site";

/** Opening spread: who, what, and a face. Education and the longer story live on their own pages. */
export default function IntroPage() {
  const l = sequence();
  const r = sequence();
  return (
    <Page
      id="intro"
      left={
        <div className="d-stack d-stack-center">
          <Write as="h2" className="d-act d-act-sm" {...l(12)}>
            <span className="d-act-no">01</span> Introduction
          </Write>
          <Write as="p" mode="words" className="d-display" {...l(30)}>
            {site.name}
          </Write>
          <Write as="p" className="d-role" {...l(40)}>
            {site.headline}
          </Write>
          <Rule className="d-rule-gap" {...l()} />
          <Write as="p" className="d-statement" {...l(site.statement.length)}>
            {site.statement}
          </Write>
          <Write as="p" className="d-next" {...l(20)}>
            <span>Experience</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Write>
        </div>
      }
      right={
        <Write as="figure" mode="image" className="d-portrait" {...r(60)}>
          <Image
            src={site.portrait.src}
            alt={site.portrait.alt}
            width={site.portrait.width}
            height={site.portrait.height}
            sizes="(min-width: 1024px) 480px, 80vw"
            loading="eager"
            fetchPriority="low"
            className="d-portrait-image"
          />
          <figcaption className="d-portrait-caption">
            <span>{site.name}</span>
            <span>{site.role}</span>
          </figcaption>
        </Write>
      }
    />
  );
}
