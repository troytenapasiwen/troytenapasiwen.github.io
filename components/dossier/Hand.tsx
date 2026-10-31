/**
 * A waving hand, drawn for this page (not an emoji): four fingers and a thumb as round-capped strokes over a palm,
 * built from one shape drawn three times (a dark extrusion, a shaded middle layer and the lit ivory front) with
 * highlights on the lit edges and a vermilion cuff, so it reads as a small solid object under the same light as the
 * illustrations (top left). The wave is a short rotation about the wrist; IntroPage.css plays it once when the page is
 * drawn. Decorative: the greeting is the text next to it.
 */
export default function Hand() {
  return (
    <svg className="ip-hand" viewBox="0 0 80 84" aria-hidden="true" focusable="false">
      <defs>
        <g id="ip-hand-shape" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8.4">
          <path d="M31 41 29 17" />
          <path d="M40 38 40 11" />
          <path d="M49 39 51 15" />
          <path d="M57 44 62 26" />
          <path d="M30 52 15 41" />
          <path d="M31 42H55V58Q55 67 43 67Q31 67 31 58Z" />
        </g>
      </defs>
      <ellipse cx="42" cy="79" rx="21" ry="3" fill="#000" opacity="0.5" />
      <g className="ip-hand-wave">
        <use href="#ip-hand-shape" fill="#5f584c" stroke="#5f584c" transform="translate(3 3.4)" />
        <use href="#ip-hand-shape" fill="#d3cab6" stroke="#d3cab6" transform="translate(1.3 1.6)" />
        <use href="#ip-hand-shape" fill="#fbf7ee" stroke="#fbf7ee" />
        <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="1.5" opacity="0.9">
          <path d="M27.6 37 26.2 19" />
          <path d="M37.4 34 37.4 13" />
          <path d="M46.6 35 48 17" />
          <path d="M54.6 40 59 27" />
          <path d="M28 47 17.5 40" />
        </g>
        <g fill="none" stroke="#b9b09f" strokeLinecap="round" strokeWidth="1.2">
          <path d="M35.5 53Q43 56.5 51 53" />
          <path d="M34 59Q43 63 53 59" opacity="0.6" />
        </g>
      </g>
      <g transform="rotate(-4 43 72)">
        <rect x="29" y="68" width="28" height="11" rx="2.5" fill="#a8321b" transform="translate(1.2 1.6)" />
        <rect x="29" y="68" width="28" height="11" rx="2.5" fill="#ff593d" />
        <path d="M31 69.6H55" stroke="#ff9a85" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
