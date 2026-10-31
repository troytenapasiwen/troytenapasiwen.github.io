import Write from "./Write";
import { Block, Pop, Solid, SolidDefs } from "./solids";

/**
 * Spots: small solid objects set into the free space of a spread, built from the same parts and the same rise as the
 * plates (solids.tsx, flow.css), standing directly on the paper.
 *
 * A spot only ever takes the room that is left over: it is a flex item with no basis and no minimum height, so it grows up
 * to a modest maximum when the page has space and shrinks to nothing when the text needs it. It never overlaps text, it
 * never makes text smaller, and (being aria-hidden and without links) it is not part of the content.
 * Each kind relates to the page it sits on: a resume and its result, a parcel and a phone, a stack of books, an envelope.
 */

export type SpotKind = "resume" | "parcel" | "books" | "envelope";

function Resume() {
  const ns = "spa";
  return (
    <>
      <Solid ns={ns} id="doc" x={24} y={26} w={86} h={112} d={9} tone="char" i={0}>
        <path className="sx-lt" d="M36 44h40" strokeWidth="5" />
        <path className="sx-lt sx-soft" d="M36 60h60M36 70h50M36 80h58M36 96h60M36 106h44" strokeWidth="2.4" />
        <Pop i={1}>
          <Block ns={ns} x={36} y={116} w={34} h={11} d={3} tone="vermilion" r={1.5} />
        </Pop>
      </Solid>
      <path className="sx-ink sx-soft" d="M130 112H146" strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
      <Solid ns={ns} id="card" x={150} y={58} w={112} h={80} d={8} tone="sand" i={2}>
        <path className="sx-ink" d="M164 76h46" strokeWidth="5" />
        <path className="sx-ink sx-soft" d="M164 90h84M164 99h66" strokeWidth="2.2" />
        <Pop i={3}>
          <Block ns={ns} x={164} y={110} w={22} h={16} d={3} tone="vermilion" r={2} />
          <Block ns={ns} x={192} y={110} w={22} h={16} d={3} tone="ivory" r={2} />
        </Pop>
      </Solid>
    </>
  );
}

function Parcel() {
  const ns = "spp";
  return (
    <>
      <Solid ns={ns} id="phone" x={26} y={22} w={64} h={116} d={8} tone="char" r={11} i={0}>
        <rect x="31" y="27" width="54" height="106" rx="7" fill="#fbf7ee" />
        <Pop i={1}>
          <Block ns={ns} x={36} y={34} w={44} h={40} d={3} tone="sand" r={3} />
          <circle cx="58" cy="53" r="5" fill="#ff593d" />
        </Pop>
        <path className="sx-ink sx-soft" d="M36 86h38M36 95h28" strokeWidth="2.4" />
        <Block ns={ns} x={36} y={106} w={44} h={14} d={3} tone="vermilion" r={2} />
      </Solid>
      <Solid ns={ns} id="box" x={128} y={84} w={74} h={54} d={14} tone="sand" i={2}>
        <path className="sx-ink sx-soft" d="M128 84H202" strokeWidth="0" />
        <rect x="157" y="84" width="16" height="54" fill="#ff593d" opacity="0.9" />
      </Solid>
      <Solid ns={ns} id="box2" x={212} y={102} w={44} h={36} d={10} tone="ivory" i={3}>
        <path className="sx-ink sx-soft" d="M222 116h24M222 124h16" strokeWidth="2" />
      </Solid>
    </>
  );
}

function Books() {
  const ns = "spb";
  return (
    <>
      <Solid ns={ns} id="b1" x={18} y={112} w={170} h={26} d={10} tone="char" i={0}>
        <path className="sx-lt sx-soft" d="M30 125h60" strokeWidth="2.4" />
        <rect x="150" y="112" width="6" height="26" fill="#ff593d" />
      </Solid>
      <Solid ns={ns} id="b2" x={30} y={86} w={144} h={26} d={10} tone="vermilion" i={1}>
        <path className="sx-ink sx-soft" d="M42 99h50" strokeWidth="2.4" />
      </Solid>
      <Solid ns={ns} id="b3" x={22} y={60} w={156} h={26} d={10} tone="sand" i={2}>
        <path className="sx-ink sx-soft" d="M34 73h70" strokeWidth="2.4" />
        <rect x="132" y="60" width="6" height="26" fill="#1c1a18" opacity="0.75" />
      </Solid>
      <Solid ns={ns} id="cap" x={56} y={48} w={84} h={8} d={10} tone="char" i={3} />
    </>
  );
}

function Envelope() {
  const ns = "spe";
  return (
    <>
      <Solid ns={ns} id="env" x={40} y={40} w={170} h={100} d={9} tone="sand" i={0}>
        <path className="sx-ink" d="M40 40 125 100 210 40" strokeWidth="1.3" opacity="0.55" strokeLinejoin="round" />
        <path className="sx-ink sx-soft" d="M40 140 108 90M210 140 142 90" strokeWidth="1" />
        <Pop i={2}>
          <circle cx="127" cy="102" r="11" fill="#000" opacity="0.25" />
          <circle cx="125" cy="100" r="11" fill="#ff593d" />
          <circle cx="125" cy="100" r="6.5" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
        </Pop>
        <Block ns={ns} x={180} y={48} w={20} h={24} d={3} tone="vermilion" r={1.5} />
      </Solid>
      <Solid ns={ns} id="slip" x={228} y={92} w={54} h={46} d={7} tone="ivory" i={3}>
        <path className="sx-ink sx-soft" d="M238 106h32M238 115h24M238 124h30" strokeWidth="2" />
      </Solid>
    </>
  );
}

/** `align` says which side of the free space the object stands on (the side the page's own content is not on). */
export default function Spot({ kind, align = "left", label }: { kind: SpotKind; align?: "left" | "right"; label?: string }) {
  return (
    <Write as="div" mode="fade" className="sp" dl={0} du={1700}>
      <svg
        className="sp-svg"
        viewBox="0 0 320 160"
        preserveAspectRatio={`${align === "left" ? "xMin" : "xMax"}YMax meet`}
        aria-hidden={label ? undefined : "true"}
        role={label ? "img" : undefined}
        aria-label={label}
        focusable="false"
      >
        <SolidDefs ns={{ resume: "spa", parcel: "spp", books: "spb", envelope: "spe" }[kind]} />
        {kind === "resume" && <Resume />}
        {kind === "parcel" && <Parcel />}
        {kind === "books" && <Books />}
        {kind === "envelope" && <Envelope />}
      </svg>
    </Write>
  );
}
