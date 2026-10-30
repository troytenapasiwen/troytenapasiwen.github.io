import type { CSSProperties, ReactNode } from "react";
import Write from "./Write";
import type { Seq } from "./sequence";

/**
 * Plates: the drawings on the divider and role-introduction spreads.
 *
 * Each one is a printed plate, a black panel with an ivory margin like the folder's own cover, holding a single
 * line drawing in the folder's ink, ivory and one orange. They are drawings of the kind of work (a design canvas,
 * a code editor, a content calendar), not pictures of any real product, and they carry no text claims.
 *
 * Motion follows the same rule as the rest of the dossier: nothing moves while a leaf is turning. The lines are drawn
 * while the sheet is being written (data-rv="running"), and the quiet ambient loops start only once it is done and on
 * show. The styles live in flow.css; the markup only names the parts (fx-draw, fx-pop, fx-loop-*).
 */

const at = (n: number) => ({ "--i": n }) as CSSProperties;

/** Marks at the four corners of a plate, like crop marks on a printer's proof. */
function CropMarks() {
  return (
    <g className="fx-crop" fill="none" strokeWidth="1">
      <path d="M10 22V10h12M338 10h12v12M10 418v12h12M350 418v12h-12" />
    </g>
  );
}

function DotGrid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="currentColor" opacity="0.2" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="360" height="440" fill={`url(#${id})`} />
    </>
  );
}

/** A selection box with its eight handles. */
function Handles({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const xs = [x, x + w / 2, x + w];
  const ys = [y, y + h / 2, y + h];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="fx-acc" fill="none" strokeWidth="1.2" />
      {ys.flatMap((py, r) =>
        xs.map((px, c) =>
          r === 1 && c === 1 ? null : <rect key={`${r}${c}`} x={px - 2.5} y={py - 2.5} width="5" height="5" className="fx-handle" />,
        ),
      )}
    </g>
  );
}

function Cursor({ className = "" }: { className?: string }) {
  return (
    <path
      className={`fx-cursor ${className}`.trim()}
      d="M0 0 0 15.5 3.7 12.2 6.4 18.2 9 17 6.4 11.2 11.4 11Z"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  );
}

/** The plate itself: the figure that is uncovered when the sheet is drawn, and its caption. */
export function Plate({
  q,
  label,
  fig,
  caption,
  children,
}: {
  q: Seq;
  label: string;
  fig: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <Write as="figure" mode="image" className="fx-plate" {...q(120)}>
      <svg className="fx" viewBox="0 0 360 440" role="img" aria-label={label} focusable="false">
        {children}
      </svg>
      <figcaption className="fx-cap">
        <span>{fig}</span>
        <span>{caption}</span>
      </figcaption>
    </Write>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* 02 Experience: a design canvas. A wireframe is laid out, a selection moves across it, and a path    */
/* with anchor points is drawn beneath, the way a route is plotted in a vector editor.                */
/* ------------------------------------------------------------------------------------------------ */
export function ExperienceArt() {
  return (
    <>
      <DotGrid id="fx-grid-exp" />
      <CropMarks />
      {/* guides */}
      <g className="fx-guide" strokeWidth="1" strokeDasharray="3 4">
        <path className="fx-pop" style={at(0)} d="M28 36V404" />
        <path className="fx-pop" style={at(1)} d="M332 36V404" />
        <path className="fx-pop" style={at(2)} d="M16 292H344" />
      </g>

      {/* the artboard */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(1)} x="44" y="52" width="272" height="196" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(3)} d="M44 78H316" />
        <circle cx="56" cy="65" r="2.6" className="fx-pop" style={at(4)} />
        <circle cx="66" cy="65" r="2.6" className="fx-pop" style={at(5)} />
        <circle cx="76" cy="65" r="2.6" className="fx-pop" style={at(6)} />
        <rect className="fx-draw" pathLength="1" style={at(4)} x="56" y="92" width="50" height="144" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(6)} d="M64 106h34M64 118h26M64 130h30M64 142h22" />
        <path className="fx-draw" pathLength="1" style={at(5)} d="M120 96h92" strokeWidth="5" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(7)} d="M120 112h130M120 120h96" />
        <rect className="fx-draw" pathLength="1" style={at(7)} x="120" y="136" width="56" height="46" />
        <rect className="fx-draw" pathLength="1" style={at(8)} x="182" y="136" width="56" height="46" />
        <rect className="fx-draw" pathLength="1" style={at(9)} x="244" y="136" width="56" height="46" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(9)} d="M128 168h30M190 168h30M252 168h30" />
        <path className="fx-draw" pathLength="1" style={at(10)} d="M120 196h180M120 206h180M120 216h120" strokeWidth="1" opacity="0.5" />
        <rect className="fx-draw" pathLength="1" style={at(11)} x="120" y="222" width="52" height="14" rx="1" />
      </g>

      {/* spacing marks between the cards */}
      <g className="fx-pop fx-acc" style={at(11)} fill="none" strokeWidth="1">
        <path d="M176 126v6M182 126v6M176 129h6" />
        <path d="M238 126v6M244 126v6M238 129h6" />
        <text x="179" y="122" className="fx-mono fx-accf" textAnchor="middle" stroke="none">
          6
        </text>
      </g>

      {/* the selection that travels across the cards, and the pointer that carries it */}
      <g className="fx-pop" style={at(12)}>
        <g className="fx-loop-sel">
          <Handles x={118} y={134} w={60} h={50} />
          <g transform="translate(166 172)">
            <Cursor />
          </g>
        </g>
      </g>

      {/* the route: a path with anchor points and a handle, drawn below the board */}
      <g fill="none" strokeWidth="1.6">
        <path
          className="fx-draw fx-acc"
          pathLength="1"
          style={at(10)}
          d="M44 372C96 372 100 318 158 332S244 384 316 322"
        />
      </g>
      <g className="fx-guide" fill="none" strokeWidth="1">
        <path className="fx-pop" style={at(13)} d="M96 372 120 372M158 332 134 322M158 332 182 342M244 384 268 378" />
        <circle className="fx-pop" style={at(13)} cx="120" cy="372" r="2.4" />
        <circle className="fx-pop" style={at(13)} cx="134" cy="322" r="2.4" />
        <circle className="fx-pop" style={at(13)} cx="182" cy="342" r="2.4" />
        <circle className="fx-pop" style={at(13)} cx="268" cy="378" r="2.4" />
      </g>
      {[
        [44, 372],
        [158, 332],
        [244, 384],
        [316, 322],
      ].map(([x, y], n) => (
        <g key={n} className="fx-pop" style={at(11 + n)}>
          <circle className={`fx-pulse fx-pulse-${n}`} cx={x} cy={y} r="9" fill="none" strokeWidth="1" />
          <rect x={x - 4} y={y - 4} width="8" height="8" className="fx-anchor" />
        </g>
      ))}

      {/* palette and type specimen */}
      <g className="fx-pop" style={at(14)}>
        <circle cx="52" cy="410" r="7" className="fx-sw-ivory" />
        <circle cx="70" cy="410" r="7" className="fx-sw-vermilion" />
        <circle cx="88" cy="410" r="7" className="fx-sw-line" fill="none" strokeWidth="1.2" />
        <text x="316" y="416" textAnchor="end" className="fx-aa">
          Aa
        </text>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* 03 Projects: artboards. A phone and a browser, a small component library, and a component that is    */
/* picked up and set into place, with its layer highlighted in the stack below.                       */
/* ------------------------------------------------------------------------------------------------ */
export function ProjectsArt() {
  return (
    <>
      <DotGrid id="fx-grid-proj" />
      <CropMarks />
      <g className="fx-guide" strokeWidth="1" strokeDasharray="3 4">
        <path className="fx-pop" style={at(0)} d="M28 36V404" />
        <path className="fx-pop" style={at(1)} d="M332 36V404" />
        <path className="fx-pop" style={at(2)} d="M16 300H344" />
      </g>

      {/* phone artboard */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(1)} x="44" y="50" width="112" height="224" rx="14" />
        <path className="fx-draw" pathLength="1" style={at(3)} d="M80 60h40" strokeWidth="3" />
        <rect className="fx-draw" pathLength="1" style={at(4)} x="56" y="78" width="88" height="46" rx="3" />
        <path className="fx-draw" pathLength="1" style={at(5)} d="M56 138h60" strokeWidth="4" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(6)} d="M56 150h88M56 158h70" />
        <rect className="fx-draw" pathLength="1" style={at(7)} x="56" y="172" width="88" height="22" rx="2" />
        <rect className="fx-draw" pathLength="1" style={at(8)} x="56" y="200" width="88" height="22" rx="2" />
        {/* the empty slot a component will be set into */}
        <rect className="fx-draw fx-slot" pathLength="1" style={at(9)} x="56" y="232" width="88" height="26" rx="2" />
      </g>
      <rect className="fx-snap" x="56" y="232" width="88" height="26" rx="2" />

      {/* browser artboard */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(2)} x="176" y="50" width="140" height="104" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(4)} d="M176 70H316" />
        <circle cx="185" cy="60" r="2.2" className="fx-pop" style={at(5)} />
        <circle cx="193" cy="60" r="2.2" className="fx-pop" style={at(6)} />
        <path className="fx-draw" pathLength="1" style={at(6)} d="M188 88h56" strokeWidth="4" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(7)} d="M188 100h108M188 108h84" />
        <rect className="fx-draw" pathLength="1" style={at(8)} x="188" y="120" width="40" height="24" />
        <rect className="fx-draw" pathLength="1" style={at(9)} x="236" y="120" width="40" height="24" />
        <rect className="fx-draw" pathLength="1" style={at(10)} x="284" y="120" width="20" height="24" />
      </g>

      {/* component library */}
      <g className="fx-ink" fill="none" strokeWidth="1.2">
        <rect className="fx-draw" pathLength="1" style={at(9)} x="176" y="170" width="66" height="46" rx="2" />
        <rect className="fx-draw" pathLength="1" style={at(10)} x="250" y="170" width="66" height="46" rx="2" />
        <rect className="fx-draw" pathLength="1" style={at(11)} x="176" y="226" width="66" height="46" rx="2" />
        <rect className="fx-draw" pathLength="1" style={at(12)} x="250" y="226" width="66" height="46" rx="2" />
        {/* button */}
        <rect className="fx-pop fx-accfill" style={at(12)} x="186" y="184" width="46" height="18" rx="2" stroke="none" />
        {/* toggle */}
        <g className="fx-pop" style={at(13)}>
          <rect x="264" y="187" width="34" height="16" rx="8" />
          <circle cx="290" cy="195" r="5" className="fx-solid" />
        </g>
        {/* input */}
        <g className="fx-pop" style={at(14)}>
          <rect x="186" y="241" width="46" height="16" rx="2" />
          <path d="M191 249h16" strokeWidth="1" />
        </g>
        {/* avatar */}
        <g className="fx-pop" style={at(15)}>
          <circle cx="283" cy="244" r="7" />
          <path d="M270 262c2-7 6-9 13-9s11 2 13 9" />
        </g>
      </g>

      {/* the component that is picked up from the library and set into the slot */}
      <g className="fx-pop" style={at(16)}>
        <g className="fx-loop-drag">
          <rect x="0" y="0" width="46" height="18" rx="2" className="fx-ghost" />
          <g transform="translate(30 10)">
            <Cursor />
          </g>
        </g>
      </g>

      {/* distance marks */}
      <g className="fx-pop fx-acc" style={at(15)} fill="none" strokeWidth="1">
        <path d="M100 222v10M96 222h8M96 232h8" />
        <text x="110" y="230" className="fx-mono fx-accf" stroke="none">
          10
        </text>
      </g>

      {/* the layer stack */}
      <g fill="none" strokeWidth="1.2">
        {[0, 1, 2].map((n) => (
          <g key={n} className="fx-pop" style={at(14 + n)}>
            <rect x="44" y={312 + n * 30} width="272" height="22" rx="2" className={`fx-layer fx-layer-${n}`} />
            <rect x="54" y={319 + n * 30} width="8" height="8" className="fx-ink" />
            <path d={`M72 ${323 + n * 30}h${[110, 82, 128][n]}`} className="fx-ink fx-soft" strokeWidth="3" />
            <circle cx="298" cy={323 + n * 30} r="3.6" className="fx-ink" />
          </g>
        ))}
      </g>
      <path className="fx-draw fx-guide" pathLength="1" style={at(17)} d="M44 418H316" strokeWidth="1" />
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Software Developer Intern: an editor with code being set line by line, an interface wireframe, a   */
/* data store, and a short run of checks that tick off. (Build, interface, data, testing.)           */
/* ------------------------------------------------------------------------------------------------ */
export function SoftwareArt() {
  const lines: Array<[number, number, boolean]> = [
    [0, 74, false],
    [14, 120, true],
    [14, 96, false],
    [28, 140, false],
    [28, 84, true],
    [14, 110, false],
    [0, 30, false],
    [0, 92, false],
    [14, 128, true],
    [14, 70, false],
  ];
  return (
    <>
      <DotGrid id="fx-grid-sw" />
      <CropMarks />
      {/* editor */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(0)} x="36" y="44" width="288" height="206" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(1)} d="M36 68H324M92 44v24" />
        <path className="fx-draw fx-acc" pathLength="1" style={at(2)} d="M36 68h56" strokeWidth="2" />
        <path className="fx-draw" pathLength="1" style={at(2)} d="M70 78V244" opacity="0.4" />
      </g>
      <g className="fx-ink fx-soft" fill="none" strokeWidth="3">
        <path className="fx-pop" style={at(3)} d="M48 56h30M104 56h40" />
      </g>
      {lines.map(([indent, len, hot], n) => (
        <g key={n}>
          <path className="fx-pop fx-ink fx-soft" style={at(3 + n)} d={`M48 ${86 + n * 15.5}h14`} strokeWidth="2" />
          <path
            className={`fx-type ${hot ? "fx-acc" : "fx-ink"}`}
            style={at(4 + n)}
            d={`M${82 + indent} ${86 + n * 15.5}h${len}`}
            strokeWidth={hot ? 3 : 2.6}
            strokeLinecap="butt"
            fill="none"
          />
        </g>
      ))}
      <rect className="fx-caret" x="170" y="219.5" width="5" height="11" />

      {/* the interface */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(8)} x="36" y="268" width="150" height="148" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(9)} d="M36 290H186" />
        <path className="fx-draw" pathLength="1" style={at(10)} d="M48 306h60" strokeWidth="4" />
        <rect className="fx-draw" pathLength="1" style={at(11)} x="48" y="318" width="126" height="18" rx="2" />
        <rect className="fx-draw" pathLength="1" style={at(12)} x="48" y="344" width="126" height="18" rx="2" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(13)} d="M48 376h96M48 384h70" />
      </g>
      <rect className="fx-pop fx-accfill" style={at(14)} x="48" y="394" width="52" height="14" rx="2" />
      <g transform="translate(78 322)" className="fx-pop" style={at(15)}>
        <Cursor className="fx-loop-point" />
      </g>

      {/* data store, and the flow from it to the interface */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <ellipse className="fx-draw" pathLength="1" style={at(9)} cx="252" cy="294" rx="30" ry="9" />
        <path className="fx-draw" pathLength="1" style={at(10)} d="M222 294v34c0 5 13.4 9 30 9s30-4 30-9v-34M222 311c0 5 13.4 9 30 9s30-4 30-9" />
      </g>
      <path className="fx-draw fx-guide" pathLength="1" style={at(12)} d="M222 316H198" strokeWidth="1.2" />
      <circle className="fx-flow" cx="222" cy="316" r="3" />

      {/* checks */}
      <g fill="none" strokeWidth="1.3">
        {[0, 1, 2].map((n) => (
          <g key={n} className="fx-pop" style={at(12 + n)}>
            <rect x="214" y={352 + n * 21} width="14" height="14" rx="2" className="fx-ink" />
            <path
              className={`fx-tick fx-tick-${n} fx-acc`}
              pathLength="1"
              d={`m217.5 ${359 + n * 21} 3 3 5-6`}
              strokeWidth="2"
            />
            <path className="fx-ink fx-soft" d={`M238 ${359 + n * 21}h${[64, 46, 56][n]}`} strokeWidth="3" />
          </g>
        ))}
      </g>
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* IT & Digital Marketing Intern: a poster laid out on a canvas, a content calendar filling in, a     */
/* small site window with a publish mark, and a process flow with a marker travelling along it.      */
/* ------------------------------------------------------------------------------------------------ */
export function MarketingArt() {
  const cells = Array.from({ length: 21 }, (_, n) => n);
  const hot = new Set([2, 5, 9, 12, 16, 19]);
  return (
    <>
      <DotGrid id="fx-grid-mk" />
      <CropMarks />
      {/* the poster on its canvas */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(0)} x="40" y="46" width="146" height="206" rx="2" />
        <rect className="fx-draw" pathLength="1" style={at(2)} x="52" y="58" width="122" height="82" />
        <path className="fx-draw" pathLength="1" style={at(4)} d="m52 128 32-32 24 22 18-14 48 24" />
        <circle className="fx-pop fx-solid" style={at(5)} cx="150" cy="80" r="8" />
        <path className="fx-draw" pathLength="1" style={at(6)} d="M52 158h96" strokeWidth="6" />
        <path className="fx-draw" pathLength="1" style={at(7)} d="M52 174h72" strokeWidth="6" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(8)} d="M52 192h110M52 202h86" />
      </g>
      <rect className="fx-pop fx-accfill" style={at(9)} x="52" y="220" width="58" height="18" rx="2" />
      <g className="fx-pop" style={at(10)}>
        <g className="fx-loop-sel-mk">
          <Handles x={50} y={56} w={126} h={86} />
        </g>
      </g>

      {/* the content calendar */}
      <g className="fx-ink" fill="none" strokeWidth="1.2">
        <rect className="fx-draw" pathLength="1" style={at(3)} x="204" y="46" width="120" height="104" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(5)} d="M204 66H324" />
      </g>
      {cells.map((n) => {
        const col = n % 7;
        const row = (n / 7) | 0;
        return (
          <rect
            key={n}
            x={209 + col * 16.2}
            y={72 + row * 24}
            width="12"
            height="18"
            rx="1.5"
            className={hot.has(n) ? `fx-cell fx-cell-hot fx-cell-${[...hot].indexOf(n)}` : "fx-cell fx-ink"}
            style={at(6 + (n % 7))}
          />
        );
      })}

      {/* the process flow */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(8)} x="204" y="172" width="34" height="22" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(10)} d="m281 168 19 15-19 15-19-15Z" />
        <rect className="fx-draw" pathLength="1" style={at(12)} x="290" y="226" width="34" height="22" rx="2" />
        <path className="fx-draw fx-guide" pathLength="1" style={at(9)} d="M238 183h24" />
        <path className="fx-draw fx-guide" pathLength="1" style={at(11)} d="M300 183h6a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-9a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h8" />
      </g>
      <circle className="fx-flow-mk" cx="238" cy="183" r="3.4" />

      {/* a small site window, and the publish mark */}
      <g className="fx-ink" fill="none" strokeWidth="1.3">
        <rect className="fx-draw" pathLength="1" style={at(9)} x="40" y="276" width="200" height="140" rx="2" />
        <path className="fx-draw" pathLength="1" style={at(11)} d="M40 298H240" />
        <circle cx="52" cy="287" r="2.4" className="fx-pop" style={at(12)} />
        <circle cx="62" cy="287" r="2.4" className="fx-pop" style={at(13)} />
        <rect className="fx-draw" pathLength="1" style={at(12)} x="54" y="312" width="96" height="62" />
        <path className="fx-draw" pathLength="1" style={at(13)} d="M160 316h66" strokeWidth="5" />
        <path className="fx-draw fx-soft" pathLength="1" style={at(14)} d="M160 330h66M160 339h52M160 348h60M54 386h172M54 395h138" />
      </g>
      <g className="fx-pop" style={at(15)}>
        <g className="fx-loop-publish fx-acc" fill="none" strokeWidth="1.6">
          <circle cx="288" cy="346" r="22" className="fx-publish-ring" />
          <path d="M288 356V337M279 345l9-9 9 9" />
        </g>
        <path className="fx-guide" d="M244 346h18" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
      </g>
    </>
  );
}
