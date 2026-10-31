import type { CSSProperties, ReactNode } from "react";

/**
 * The dimensional illustration system.
 *
 * Every drawing on a divider or role-introduction plate is assembled from the same few parts, so they share one
 * light, one projection and one way of arriving:
 *
 *   light      from the top left. Front faces are lit, top faces brightest, right-hand faces darkest.
 *   projection a shallow oblique one: depth runs up and to the right (dx = d, dy = -0.55 d).
 *   Solid      a slab with a front, a top and a right face, a bevel line, and a contact shadow on the floor.
 *   Block      the same slab without shadow or rise, for parts that sit ON another solid (cards on a board).
 *   Cyl        a cylinder (data store, coins).
 *   Rise       what makes an object come up out of the page: a clip along its ground line, a shadow that appears
 *              first, then the body travelling up through the clip. flow.css drives it from the sheet's data-rv.
 *   Pop        a smaller part that settles onto its parent a moment after the parent has risen.
 *
 * Nothing here moves by itself: the markup only names the parts (sx-shadow, sx-rise, sx-pop) and their order (--i).
 * Ids are namespaced per drawing (ns) because several plates can be in the document at once.
 */

export type Tone = "ivory" | "sand" | "char" | "vermilion";

const TONES: Record<Tone, { f: [string, string]; t: [string, string]; s: [string, string]; edge: number }> = {
  ivory: { f: ["#fbf7ee", "#e6decc"], t: ["#fffdf8", "#f1eadb"], s: ["#b9b09f", "#6f675b"], edge: 0.9 },
  sand: { f: ["#eee7d7", "#d3cab6"], t: ["#f7f2e6", "#e5ddcc"], s: ["#a39a89", "#5f584c"], edge: 0.8 },
  char: { f: ["#37332e", "#1d1b19"], t: ["#4d4841", "#37332e"], s: ["#171513", "#050505"], edge: 0.2 },
  vermilion: { f: ["#ff6c50", "#f24b2d"], t: ["#ff9078", "#ff6c50"], s: ["#bd3b20", "#7a2412"], edge: 0.5 },
};

const at = (n: number) => ({ "--i": n }) as CSSProperties;
const K = 0.55; // depth foreshortening

/** Gradients and the lit floor, once per drawing. */
export function SolidDefs({ ns }: { ns: string }) {
  return (
    <defs>
      {(Object.keys(TONES) as Tone[]).map((tone) => {
        const c = TONES[tone];
        return (
          <g key={tone}>
            <linearGradient id={`${ns}-f-${tone}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={c.f[0]} />
              <stop offset="1" stopColor={c.f[1]} />
            </linearGradient>
            <linearGradient id={`${ns}-t-${tone}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={c.t[1]} />
              <stop offset="1" stopColor={c.t[0]} />
            </linearGradient>
            <linearGradient id={`${ns}-s-${tone}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={c.s[0]} />
              <stop offset="1" stopColor={c.s[1]} />
            </linearGradient>
          </g>
        );
      })}
      <linearGradient id={`${ns}-sh`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.62" />
        <stop offset="0.7" stopColor="#000" stopOpacity="0.32" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${ns}-floor`} cx="0.46" cy="0.5" r="0.7">
        <stop offset="0" stopColor="#34302a" />
        <stop offset="0.55" stopColor="#1d1a17" />
        <stop offset="1" stopColor="#0f0e0d" />
      </radialGradient>
    </defs>
  );
}

/** The warm pool of light the objects stand in (it is what lets their shadows read on the black plate). */
export function Floor({ ns }: { ns: string }) {
  return <rect x="0" y="0" width="360" height="440" fill={`url(#${ns}-floor)`} />;
}

/** A small part that settles onto its parent after the parent has risen. */
export function Pop({ i = 0, children }: { i?: number; children: ReactNode }) {
  return (
    <g className="sx-pop" style={at(i)}>
      {children}
    </g>
  );
}

/**
 * Rise: the clip along the ground line, the contact shadow, and the group that travels up through the clip.
 * `box` is [left, top, right, ground]; the ground line is where the object meets the page.
 */
export function Rise({
  ns,
  id,
  box,
  i = 0,
  shadow = true,
  children,
}: {
  ns: string;
  id: string;
  box: [number, number, number, number];
  i?: number;
  shadow?: boolean;
  children: ReactNode;
}) {
  const [x0, y0, x1, ground] = box;
  const clip = `${ns}-c-${id}`;
  return (
    <g className="sx" style={{ "--i": i, "--h": ground - y0 + 6 } as CSSProperties}>
      {shadow && (
        <g className="sx-shadow">
          <rect x={x0 + 8} y={ground - 3} width={x1 - x0 + 8} height="15" rx="7.5" fill={`url(#${ns}-sh)`} />
          <rect x={x0 + 4} y={ground - 1.5} width={x1 - x0 - 6} height="3.4" rx="1.7" fill="#000" opacity="0.6" />
        </g>
      )}
      <clipPath id={clip}>
        <rect x={x0} y={y0} width={x1 - x0} height={ground - y0} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <g className="sx-rise">{children}</g>
      </g>
    </g>
  );
}

/** The three visible faces of a slab, and its bevel. Children are drawn on the front face, in absolute coordinates. */
function Faces({
  ns,
  x,
  y,
  w,
  h,
  d,
  tone,
  r,
  children,
}: {
  ns: string;
  x: number;
  y: number;
  w: number;
  h: number;
  d: number;
  tone: Tone;
  r: number;
  children?: ReactNode;
}) {
  const k = d * K;
  return (
    <>
      {d > 0 && (
        <>
          <polygon points={`${x + w},${y + r * 0.4} ${x + w + d},${y - k + r * 0.4} ${x + w + d},${y + h - k} ${x + w},${y + h}`} fill={`url(#${ns}-s-${tone})`} />
          <polygon points={`${x + r * 0.4},${y} ${x + d + r * 0.4},${y - k} ${x + w + d},${y - k} ${x + w},${y}`} fill={`url(#${ns}-t-${tone})`} />
          <path d={`M${x + w + d} ${y - k}V${y + h - k}`} stroke="#000" strokeOpacity="0.35" strokeWidth="0.8" fill="none" />
        </>
      )}
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${ns}-f-${tone})`} />
      <path
        d={`M${x + 0.5} ${y + h - r}V${y + r}Q${x + 0.5} ${y + 0.5} ${x + r} ${y + 0.5}H${x + w - r}`}
        fill="none"
        stroke="#fff"
        strokeOpacity={TONES[tone].edge * 0.7}
        strokeWidth="1"
      />
      {children}
    </>
  );
}

/** A slab that rises out of the page and carries its contents with it. */
export function Solid({
  ns,
  id,
  x,
  y,
  w,
  h,
  d = 10,
  tone = "ivory",
  r = 2,
  i = 0,
  children,
}: {
  ns: string;
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  d?: number;
  tone?: Tone;
  r?: number;
  i?: number;
  children?: ReactNode;
}) {
  return (
    <Rise ns={ns} id={id} i={i} box={[x - 4, y - d * K - 8, x + w + d + 4, y + h]}>
      <Faces ns={ns} x={x} y={y} w={w} h={h} d={d} tone={tone} r={r}>
        {children}
      </Faces>
    </Rise>
  );
}

/** A slab that sits on another solid: no ground line of its own, a small shadow cast to the right and down. */
export function Block({
  ns,
  x,
  y,
  w,
  h,
  d = 4,
  tone = "sand",
  r = 1.5,
  children,
}: {
  ns: string;
  x: number;
  y: number;
  w: number;
  h: number;
  d?: number;
  tone?: Tone;
  r?: number;
  children?: ReactNode;
}) {
  return (
    <g>
      <rect x={x + 2} y={y + 3} width={w + d} height={h} rx={r} fill="#000" opacity="0.16" />
      <Faces ns={ns} x={x} y={y} w={w} h={h} d={d} tone={tone} r={r}>
        {children}
      </Faces>
    </g>
  );
}

/** A cylinder standing on the page: `top` is the centre of its upper ellipse. */
export function Cyl({
  ns,
  id,
  cx,
  top,
  rx,
  ry,
  hgt,
  tone = "sand",
  bands = [],
  i = 0,
}: {
  ns: string;
  id: string;
  cx: number;
  top: number;
  rx: number;
  ry: number;
  hgt: number;
  tone?: Tone;
  bands?: number[];
  i?: number;
}) {
  const bottom = top + hgt;
  return (
    <Rise ns={ns} id={id} i={i} box={[cx - rx - 4, top - ry - 8, cx + rx + 6, bottom + ry]}>
      <linearGradient id={`${ns}-cy-${id}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={TONES[tone].f[0]} />
        <stop offset="0.55" stopColor={TONES[tone].f[1]} />
        <stop offset="1" stopColor={TONES[tone].s[1]} />
      </linearGradient>
      <path d={`M${cx - rx} ${top}V${bottom}A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom}V${top}Z`} fill={`url(#${ns}-cy-${id})`} />
      {bands.map((b) => (
        <path key={b} d={`M${cx - rx} ${top + b}A${rx} ${ry} 0 0 0 ${cx + rx} ${top + b}`} fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1" />
      ))}
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill={`url(#${ns}-t-${tone})`} stroke="#fff" strokeOpacity="0.6" strokeWidth="0.8" />
    </Rise>
  );
}
