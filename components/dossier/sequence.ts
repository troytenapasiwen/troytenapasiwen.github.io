/**
 * Plans the order in which the blocks on one half-page are revealed.
 *
 * Each call returns { dl, du }: the delay (ms) after which a block starts to be drawn, and how long the drawing takes.
 * The clock for these numbers starts only when the page has finished turning and settled (see Dossier.tsx), so nothing
 * here can ever show while a leaf is still moving.
 *
 * Blocks are drawn top to bottom in the order they are requested. A block starts while the one before it is still
 * being drawn (a gentle overlap, so it reads as one hand uncovering the page rather than a list of pop-ins), longer
 * text takes a little longer, and the delay is capped so a very full page never makes anyone wait.
 */
export type Seq = (length?: number) => { dl: number; du: number };

const MAX_DELAY = 900;

export function sequence(): Seq {
  let cursor = 0;
  return (length = 40) => {
    const du = Math.round(Math.min(900, Math.max(520, 460 + length * 1.3)));
    const dl = Math.round(Math.min(cursor, MAX_DELAY));
    cursor += Math.min(du * 0.42, 330);
    return { dl, du };
  };
}
