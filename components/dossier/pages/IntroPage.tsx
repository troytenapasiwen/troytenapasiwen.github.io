import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Page from "../Page";
import Write, { Hold, Rule } from "../Write";
import Hand from "../Hand";
import { ACTS } from "../timeline";
import { site } from "@/data/site";
import "./IntroPage.css";

/**
 * Opening spread: who, what, and a face.
 *
 * The left sheet is drawn in a fixed order (the delays below are the choreography, in ms after the page has settled):
 *   label -> "Hi, I'm" -> the hand comes up and waves -> the name, letter by letter -> role -> statement -> next.
 * The right sheet then mounts the portrait like a physical print: shadow, backing plate, mat, photograph, corners, labels
 * (their delays are in IntroPage.css). Everything is read from `site`; nothing is repeated here.
 */
export default function IntroPage() {
  const act = ACTS[0];
  const next = ACTS[1];
  return (
    <Page
      id="intro"
      left={
        <div className="d-stack d-stack-center ip-copy">
          <Write as="h2" mode="label" className="ip-eyebrow" dl={0} du={420}>
            {act.no} / {act.title}
          </Write>
          <div className="ip-greet">
            <Write as="p" mode="words" className="ip-hi" dl={140} du={420}>
              Hi, I&apos;m
            </Write>
            <Hand />
          </div>
          <Write as="p" mode="letters" className="d-display ip-name" dl={420} du={1050}>
            {site.name}
          </Write>
          <Write as="p" className="d-role" dl={920} du={600}>
            {site.headline}
          </Write>
          <Rule className="d-rule-gap" dl={1000} du={600} />
          <Write as="p" className="d-statement" dl={1150} du={700}>
            {site.statement}
          </Write>
          <Write as="p" mode="label" className="d-next ip-next" dl={1500} du={500}>
            <span>Continue to {next.label}</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Write>
        </div>
      }
      right={
        <div className="ip-stage">
          <Hold ms={1800} />
          <div className="ip-mount">
            <span className="ip-shadow" aria-hidden="true" />
            <span className="ip-back" aria-hidden="true" />
            <figure className="ip-mat">
              <div className="ip-photo">
                <Image
                  src={site.portrait.src}
                  alt={site.portrait.alt}
                  width={site.portrait.width}
                  height={site.portrait.height}
                  sizes="(min-width: 1024px) 480px, 80vw"
                  loading="eager"
                  fetchPriority="low"
                  className="ip-image"
                />
                <span className="ip-corner ip-corner-tl" aria-hidden="true" />
                <span className="ip-corner ip-corner-tr" aria-hidden="true" />
                <span className="ip-corner ip-corner-bl" aria-hidden="true" />
                <span className="ip-corner ip-corner-br" aria-hidden="true" />
              </div>
              <figcaption className="ip-label">
                <span>{site.name}</span>
                <span>{site.role}</span>
              </figcaption>
              <span className="ip-reg" aria-hidden="true" />
              <span className="ip-tech" aria-hidden="true">
                Fig. 01 · 4:5
              </span>
            </figure>
          </div>
        </div>
      }
    />
  );
}
