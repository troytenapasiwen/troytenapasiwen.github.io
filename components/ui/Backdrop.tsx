/**
 * The desk the folder sits on: a fixed, purely decorative layer behind everything.
 *
 * It is one lit scene with the folder, not a wallpaper. The light comes from the top left (the folder, its pages and
 * every shadow here agree on that), and nothing on the desk moves on its own. What it does is answer to the folder:
 * the engine writes the folder's pose (0 closed and lying down, 1 open) to `--pose` on this element, and the pool of
 * light and the loose paper shift a few pixels with it, by transform only. While a leaf is in the air the desk is still.
 *
 *   table   the warm worktable: tonal surface, a pool of light, fibre grain, a soft vignette
 *   grid    a drafting grid laid on the table, seen at a slant, fading toward the far edge
 *   ruler   a real object: a boxwood-coloured ruler with a bevelled edge, ticks and a contact shadow
 *   piles   two small stacks of paper with visible thickness and contact shadows
 *   reg     orange registration marks in the corners (the same orange as the folder's tab)
 *
 * It never takes part in layout or interaction (pointer-events: none, aria-hidden).
 */
export default function Backdrop() {
  return (
    <div className="bd" aria-hidden="true">
      <div className="bd-table" />
      <div className="bd-pool" />
      <div className="bd-plane">
        <div className="bd-grid" />
      </div>
      <div className="bd-ruler">
        <i />
      </div>
      <div className="bd-pile bd-pile-a">
        <b />
        <b />
        <b />
      </div>
      <div className="bd-pile bd-pile-b">
        <b />
        <b />
      </div>
      <i className="bd-reg bd-reg-tl" />
      <i className="bd-reg bd-reg-tr" />
      <i className="bd-reg bd-reg-bl" />
      <i className="bd-reg bd-reg-br" />
      <div className="bd-grain" />
      <div className="bd-vignette" />
    </div>
  );
}
