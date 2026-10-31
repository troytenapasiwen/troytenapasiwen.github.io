import type { CSSProperties, ReactNode } from "react";
import Write from "./Write";
import type { Seq } from "./sequence";
import { Block, Cyl, Floor, Pop, Solid, SolidDefs } from "./solids";

/**
 * Plates: the drawings on the divider and role-introduction spreads.
 *
 * Each one is a printed plate (a black panel with an ivory margin, like the folder's own cover) holding a small
 * group of SOLID objects (see solids.tsx): a design canvas, a code editor, a content calendar. They are drawings of the
 * kind of work, not pictures of any real product, and they carry no text claims. The objects come up out of the plate when
 * the sheet is written (data-rv="running"); the quiet ambient loops start only once it is done and on show. The styles live
 * in flow.css; the markup only names the parts.
 *
 * The geometry of the moving parts (selection box, cursor, flow dots, publish mark) is the same as it always was, so the
 * keyframes in flow.css still line up with them.
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

/** The plate itself: the figure the objects stand on, and its caption. */
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
    <Write as="figure" mode="fade" className="fx-plate" {...q(120)}>
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
/* 02 Experience: a design canvas. A board with cards set into it and a selection moving across them,  */
/* and below it a route plotted with anchor points, the way it is drawn in a vector editor.           */
/* ------------------------------------------------------------------------------------------------ */
export function ExperienceArt() {
  const ns = "sxe";
  const anchors = [
    [44, 372],
    [158, 332],
    [244, 384],
    [316, 322],
  ];
  return (
    <>
      <SolidDefs ns={ns} />
      <Floor ns={ns} />
      <DotGrid id="fx-grid-exp" />
      <CropMarks />
      <g className="fx-guide" strokeWidth="1" strokeDasharray="3 4">
        <path d="M28 36V404M332 36V404M16 292H344" />
      </g>

      {/* the board */}
      <Solid ns={ns} id="board" x={44} y={52} w={272} h={196} d={12} tone="ivory" i={0}>
        <rect x="44" y="52" width="272" height="26" fill="#26231f" />
        <circle cx="56" cy="65" r="2.6" fill="#ff593d" />
        <circle cx="66" cy="65" r="2.6" fill="#f6f1e7" opacity="0.7" />
        <circle cx="76" cy="65" r="2.6" fill="#f6f1e7" opacity="0.4" />
        <Pop i={1}>
          <Block ns={ns} x={56} y={92} w={50} h={144} d={5} tone="sand" />
          <path className="sx-ink sx-soft" d="M64 106h34M64 118h26M64 130h30M64 142h22" strokeWidth="2.2" />
        </Pop>
        <Pop i={2}>
          <path className="sx-ink" d="M120 100h92" strokeWidth="6" />
          <path className="sx-ink sx-soft" d="M120 114h130M120 123h96" strokeWidth="2.2" />
        </Pop>
        {[120, 182, 244].map((cx, n) => (
          <Pop key={cx} i={3 + n}>
            <Block ns={ns} x={cx} y={136} w={56} h={46} d={6} tone="sand">
              <path className="sx-ink sx-soft" d={`M${cx + 8} 168h30`} strokeWidth="2.4" />
              <rect x={cx + 8} y={144} width="16" height="10" rx="1.5" fill="#1c1a18" opacity="0.18" />
            </Block>
          </Pop>
        ))}
        <Pop i={6}>
          <path className="sx-ink sx-soft" d="M120 198h180M120 207h180M120 216h120" strokeWidth="2" />
          <Block ns={ns} x={120} y={222} w={52} h={14} d={3} tone="vermilion" r={1.5} />
        </Pop>
        {/* spacing marks between the cards */}
        <g className="sx-acc" strokeWidth="1">
          <path d="M176 126v6M182 126v6M176 129h6M238 126v6M244 126v6M238 129h6" />
          <text x="179" y="122" className="fx-mono sx-accf" textAnchor="middle" stroke="none">
            6
          </text>
        </g>
        {/* the selection that travels across the cards, and the pointer that carries it */}
        <g className="fx-loop-sel">
          <Handles x={118} y={134} w={60} h={50} />
          <g transform="translate(166 172)">
            <Cursor />
          </g>
        </g>
      </Solid>

      {/* the route: a ribbon with anchor points and handles, laid on the page below the board */}
      <g fill="none" strokeLinecap="round">
        <path className="sx-draw" pathLength="1" style={at(6)} d="M44 372C96 372 100 318 158 332S244 384 316 322" stroke="#000" strokeOpacity="0.5" strokeWidth="5" transform="translate(3 5)" />
        <path className="sx-draw" pathLength="1" style={at(6)} d="M44 372C96 372 100 318 158 332S244 384 316 322" stroke="#ff593d" strokeWidth="4" />
        <path className="sx-draw" pathLength="1" style={at(6)} d="M44 372C96 372 100 318 158 332S244 384 316 322" stroke="#ffa592" strokeOpacity="0.8" strokeWidth="1" transform="translate(-0.6 -1.2)" />
      </g>
      <g className="fx-guide sx-pop" style={at(9)} fill="none" strokeWidth="1">
        <path d="M96 372 120 372M158 332 134 322M158 332 182 342M244 384 268 378" />
        <circle cx="120" cy="372" r="2.4" />
        <circle cx="134" cy="322" r="2.4" />
        <circle cx="182" cy="342" r="2.4" />
        <circle cx="268" cy="378" r="2.4" />
      </g>
      {anchors.map(([x, y], n) => (
        <g key={n}>
          <circle className={`fx-pulse fx-pulse-${n}`} cx={x} cy={y} r="9" fill="none" strokeWidth="1" />
          <Solid ns={ns} id={`a${n}`} x={x - 4} y={y - 4} w={8} h={8} d={3} tone="ivory" i={7 + n} r={1} />
        </g>
      ))}

      {/* palette (three coins) and a type specimen in extruded letters */}
      <Cyl ns={ns} id="c1" cx={52} top={404} rx={8} ry={3.2} hgt={4} tone="ivory" i={9} />
      <Cyl ns={ns} id="c2" cx={70} top={404} rx={8} ry={3.2} hgt={4} tone="vermilion" i={10} />
      <Cyl ns={ns} id="c3" cx={88} top={404} rx={8} ry={3.2} hgt={4} tone="char" i={11} />
      <g className="sx-pop" style={at(11)}>
        {[5, 4, 3, 2, 1].map((o) => (
          <text key={o} x={316 + o * 0.8} y={416 - o * 0.45} textAnchor="end" className="fx-aa" fill="#6f675b">
            Aa
          </text>
        ))}
        <text x="316" y="416" textAnchor="end" className="fx-aa" fill="#f6f1e7">
          Aa
        </text>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* 03 Projects: a phone and a browser standing side by side, a small component library set out in      */
/* front of them, and the stack of layers beneath. One component is picked up and set into its slot.   */
/* ------------------------------------------------------------------------------------------------ */
export function ProjectsArt() {
  const ns = "sxp";
  return (
    <>
      <SolidDefs ns={ns} />
      <Floor ns={ns} />
      <DotGrid id="fx-grid-proj" />
      <CropMarks />
      <g className="fx-guide" strokeWidth="1" strokeDasharray="3 4">
        <path d="M28 36V404M332 36V404M16 300H344" />
      </g>

      {/* phone */}
      <Solid ns={ns} id="phone" x={44} y={50} w={112} h={224} d={10} tone="char" r={14} i={0}>
        <rect x="52" y="58" width="96" height="208" rx="9" fill="#fbf7ee" />
        <path className="sx-ink" d="M80 66h40" strokeWidth="3" />
        <Pop i={1}>
          <Block ns={ns} x={58} y={78} w={84} h={46} d={4} tone="char" r={3}>
            <path d="M58 118 78 98l14 12 12-9 38 17" fill="none" stroke="#f6f1e7" strokeOpacity="0.55" strokeWidth="1.4" />
          </Block>
          <path className="sx-ink" d="M58 138h58" strokeWidth="4.5" />
          <path className="sx-ink sx-soft" d="M58 150h84M58 158h66" strokeWidth="2.2" />
        </Pop>
        <Pop i={2}>
          <Block ns={ns} x={58} y={172} w={84} h={22} d={3} tone="sand" r={2} />
          <Block ns={ns} x={58} y={200} w={84} h={22} d={3} tone="sand" r={2} />
        </Pop>
        {/* the empty slot a component will be set into */}
        <rect className="fx-slot" x="58" y="232" width="84" height="26" rx="2" fill="none" strokeWidth="1.3" strokeDasharray="4 3" />
        <rect className="fx-snap" x="58" y="232" width="84" height="26" rx="2" />
        <g className="sx-acc" fill="none" strokeWidth="1">
          <path d="M104 222v10M100 222h8M100 232h8" />
          <text x="112" y="230" className="fx-mono sx-accf" stroke="none">
            10
          </text>
        </g>
      </Solid>

      {/* browser */}
      <Solid ns={ns} id="browser" x={176} y={50} w={140} h={104} d={9} tone="ivory" i={1}>
        <rect x="176" y="50" width="140" height="20" fill="#26231f" />
        <circle cx="186" cy="60" r="2.2" fill="#ff593d" />
        <circle cx="194" cy="60" r="2.2" fill="#f6f1e7" opacity="0.6" />
        <path className="sx-ink" d="M188 88h56" strokeWidth="4.5" />
        <path className="sx-ink sx-soft" d="M188 100h108M188 108h84" strokeWidth="2.2" />
        {[188, 236, 284].map((bx, n) => (
          <Pop key={bx} i={2 + n}>
            <Block ns={ns} x={bx} y={120} w={n === 2 ? 20 : 40} h={24} d={4} tone="sand" />
          </Pop>
        ))}
      </Solid>

      {/* component library */}
      <Solid ns={ns} id="t1" x={176} y={170} w={66} h={46} d={6} tone="sand" i={3}>
        <Block ns={ns} x={186} y={184} w={46} h={18} d={3} tone="vermilion" r={2} />
      </Solid>
      <Solid ns={ns} id="t2" x={250} y={170} w={66} h={46} d={6} tone="sand" i={4}>
        <rect x="264" y="187" width="34" height="16" rx="8" fill="#1c1a18" opacity="0.8" />
        <circle cx="290" cy="195" r="5" fill="#fbf7ee" />
      </Solid>
      <Solid ns={ns} id="t3" x={176} y={226} w={66} h={46} d={6} tone="sand" i={5}>
        <rect x="186" y="241" width="46" height="16" rx="2" fill="#fbf7ee" stroke="#1c1a18" strokeOpacity="0.55" />
        <path className="sx-ink" d="M191 249h16" strokeWidth="1.2" />
      </Solid>
      <Solid ns={ns} id="t4" x={250} y={226} w={66} h={46} d={6} tone="sand" i={6}>
        <circle cx="283" cy="244" r="7" fill="none" className="sx-ink" strokeWidth="1.4" />
        <path className="sx-ink" fill="none" d="M270 262c2-7 6-9 13-9s11 2 13 9" strokeWidth="1.4" />
      </Solid>

      {/* the component that is picked up from the library and set into the slot */}
      <g className="sx-pop" style={at(10)}>
        <g className="fx-loop-drag">
          <rect x="0" y="0" width="46" height="18" rx="2" className="fx-ghost" />
          <g transform="translate(30 10)">
            <Cursor />
          </g>
        </g>
      </g>

      {/* the layer stack: three slabs, one above the next, the middle one picked out */}
      {[0, 1, 2].map((n) => (
        <Solid key={n} ns={ns} id={`l${n}`} x={44} y={312 + n * 30} w={272} h={22} d={5} tone="sand" i={7 + n}>
          <rect x={54} y={319 + n * 30} width="8" height="8" className="sx-ink" fill="none" strokeWidth="1.2" />
          <path d={`M72 ${323 + n * 30}h${[110, 82, 128][n]}`} className="sx-ink sx-soft" strokeWidth="3" />
          <circle cx="298" cy={323 + n * 30} r="3.6" className="sx-ink" fill="none" strokeWidth="1.2" />
          {n === 1 && <rect className="fx-layer fx-layer-1" x="44" y="342" width="272" height="22" rx="2" />}
        </Solid>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* Software Developer Intern: an editor with code being set line by line, an interface, a data store   */
/* and a short run of checks that tick off. (Build, interface, data, testing.)                        */
/* ------------------------------------------------------------------------------------------------ */
export function SoftwareArt() {
  const ns = "sxs";
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
      <SolidDefs ns={ns} />
      <Floor ns={ns} />
      <DotGrid id="fx-grid-sw" />
      <CropMarks />

      {/* editor */}
      <Solid ns={ns} id="editor" x={36} y={44} w={288} h={206} d={12} tone="char" i={0}>
        <rect x="36" y="44" width="288" height="24" fill="#141210" />
        <path className="sx-acc" d="M36 68h56" strokeWidth="2.2" />
        <path className="sx-lt sx-soft" d="M48 56h30M104 56h40" strokeWidth="3" />
        <path className="sx-lt" d="M70 78V244" opacity="0.18" />
        {lines.map(([indent, len, hot], n) => (
          <g key={n}>
            <path className="sx-lt sx-soft" d={`M48 ${86 + n * 15.5}h14`} strokeWidth="2" />
            <path
              className={`fx-type ${hot ? "sx-acc" : "sx-lt"}`}
              style={at(4 + n)}
              d={`M${82 + indent} ${86 + n * 15.5}h${len}`}
              strokeWidth={hot ? 3 : 2.6}
              strokeLinecap="butt"
              fill="none"
            />
          </g>
        ))}
        <rect className="fx-caret" x="170" y="219.5" width="5" height="11" />
      </Solid>

      {/* the interface */}
      <Solid ns={ns} id="ui" x={36} y={268} w={150} h={148} d={10} tone="ivory" i={1}>
        <rect x="36" y="268" width="150" height="22" fill="#26231f" />
        <circle cx="47" cy="279" r="2.2" fill="#ff593d" />
        <path className="sx-ink" d="M48 306h60" strokeWidth="4.5" />
        <Pop i={2}>
          <Block ns={ns} x={48} y={318} w={126} h={18} d={3} tone="sand" />
          <Block ns={ns} x={48} y={344} w={126} h={18} d={3} tone="sand" />
        </Pop>
        <path className="sx-ink sx-soft" d="M48 376h96M48 384h70" strokeWidth="2.2" />
        <Pop i={3}>
          <Block ns={ns} x={48} y={394} w={52} h={14} d={3} tone="vermilion" />
        </Pop>
        <g transform="translate(78 322)">
          <Cursor className="fx-loop-point" />
        </g>
      </Solid>

      {/* data store, and the flow from it to the interface */}
      <Cyl ns={ns} id="db" cx={252} top={294} rx={30} ry={9} hgt={43} tone="sand" bands={[17]} i={2} />
      <path className="fx-guide sx-draw" pathLength="1" style={at(6)} d="M222 316H198" strokeWidth="1.2" fill="none" />
      <circle className="fx-flow" cx="222" cy="316" r="3" />

      {/* checks */}
      {[0, 1, 2].map((n) => (
        <g key={n}>
          <Solid ns={ns} id={`k${n}`} x={214} y={352 + n * 21} w={14} h={14} d={3} tone="ivory" i={4 + n} r={2}>
            <path className={`fx-tick fx-tick-${n} sx-acc`} pathLength="1" d={`m217.5 ${359 + n * 21} 3 3 5-6`} strokeWidth="2" fill="none" />
          </Solid>
          <path className="sx-lt sx-soft sx-pop" style={at(5 + n)} d={`M238 ${359 + n * 21}h${[64, 46, 56][n]}`} strokeWidth="3" />
        </g>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ */
/* IT & Digital Marketing Intern: a poster on its canvas, a content calendar filling in, a site        */
/* window, a process flow with a marker travelling along it, and a publish button.                    */
/* ------------------------------------------------------------------------------------------------ */
export function MarketingArt() {
  const ns = "sxm";
  const cells = Array.from({ length: 21 }, (_, n) => n);
  const hot = new Set([2, 5, 9, 12, 16, 19]);
  return (
    <>
      <SolidDefs ns={ns} />
      <Floor ns={ns} />
      <DotGrid id="fx-grid-mk" />
      <CropMarks />

      {/* the poster on its canvas */}
      <Solid ns={ns} id="poster" x={40} y={46} w={146} h={206} d={9} tone="ivory" i={0}>
        <Pop i={1}>
          <Block ns={ns} x={52} y={58} w={122} h={82} d={4} tone="char">
            <path d="m52 128 32-32 24 22 18-14 48 24" fill="none" stroke="#f6f1e7" strokeOpacity="0.6" strokeWidth="1.4" />
            <circle cx="150" cy="80" r="8" fill="#ff593d" />
          </Block>
        </Pop>
        <path className="sx-ink" d="M52 158h96M52 174h72" strokeWidth="6" />
        <path className="sx-ink sx-soft" d="M52 192h110M52 202h86" strokeWidth="2.2" />
        <Pop i={3}>
          <Block ns={ns} x={52} y={220} w={58} h={18} d={3} tone="vermilion" r={2} />
        </Pop>
        <g className="fx-loop-sel-mk">
          <Handles x={50} y={56} w={126} h={86} />
        </g>
      </Solid>

      {/* the content calendar */}
      <Solid ns={ns} id="cal" x={204} y={46} w={120} h={104} d={8} tone="sand" i={1}>
        <rect x="204" y="46" width="120" height="20" fill="#26231f" />
        {cells.map((n) => {
          const col = n % 7;
          const row = (n / 7) | 0;
          const x = 209 + col * 16.2;
          const y = 72 + row * 24;
          return hot.has(n) ? (
            <rect key={n} x={x} y={y} width="12" height="18" rx="1.5" className={`fx-cell-hot fx-cell-${[...hot].indexOf(n)}`} />
          ) : (
            <rect key={n} x={x} y={y} width="12" height="18" rx="1.5" fill="#1c1a18" opacity="0.12" />
          );
        })}
      </Solid>

      {/* the process flow */}
      <Solid ns={ns} id="n1" x={204} y={172} w={34} h={22} d={5} tone="ivory" i={3} r={2} />
      <g className="sx-pop" style={at(4)}>
        <path d="m285 172 19 15-19 15-19-15Z" fill="#000" opacity="0.4" />
        <path d="m281 168 19 15-19 15-19-15Z" fill="url(#sxm-f-ivory)" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.8" />
      </g>
      <Solid ns={ns} id="n3" x={290} y={226} w={34} h={22} d={5} tone="ivory" i={5} r={2} />
      <g className="fx-guide" fill="none" strokeWidth="1.2">
        <path className="sx-draw" pathLength="1" style={at(4)} d="M238 183h24" />
        <path className="sx-draw" pathLength="1" style={at(5)} d="M300 183h6a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-9a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h8" />
      </g>
      <circle className="fx-flow-mk" cx="238" cy="183" r="3.4" />

      {/* a small site window */}
      <Solid ns={ns} id="site" x={40} y={276} w={200} h={140} d={10} tone="ivory" i={2}>
        <rect x="40" y="276" width="200" height="22" fill="#26231f" />
        <circle cx="52" cy="287" r="2.4" fill="#ff593d" />
        <circle cx="62" cy="287" r="2.4" fill="#f6f1e7" opacity="0.6" />
        <Pop i={3}>
          <Block ns={ns} x={54} y={312} w={96} h={62} d={4} tone="char" />
        </Pop>
        <path className="sx-ink" d="M160 318h66" strokeWidth="5" />
        <path className="sx-ink sx-soft" d="M160 330h66M160 339h52M160 348h60M54 386h172M54 395h138" strokeWidth="2.2" />
      </Solid>

      {/* the publish button */}
      <circle className="fx-publish-ring sx-pop fx-acc" style={at(8)} cx="288" cy="346" r="31" fill="none" strokeWidth="1.2" />
      <path className="fx-guide sx-pop" style={at(7)} d="M244 346h12" strokeWidth="1.2" fill="none" strokeDasharray="3 3" />
      <Solid ns={ns} id="pub" x={266} y={324} w={44} h={44} d={9} tone="vermilion" r={10} i={6}>
        <g className="fx-loop-publish" fill="none" stroke="#1c1a18" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M288 358V337M279 345l9-9 9 9" />
        </g>
      </Solid>
    </>
  );
}
