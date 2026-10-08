/**
 * Plans the order in which the items on one page get "written".
 *
 * Each call returns { s, d }: the page progress (0..1) at which an item starts
 * being written, and how long the writing takes. Longer text takes a little longer,
 * and the next item starts before the previous one is finished so the page is
 * authored in one flowing motion rather than item by item.
 */
export type Seq = (length: number | string) => { s: number; d: number };

export function sequence(start = 0.06, overlap = 0.5, pace = 1.3): Seq {
  let cursor = start;
  return (length) => {
    const n = typeof length === "string" ? length.length : length;
    // `pace` stretches the whole page: short pages use a larger value so they still take a moment to write.
    const d = Math.min(0.26, (0.03 + n / 4200) * pace);
    const s = cursor;
    cursor = s + d * (1 - overlap);
    return { s, d };
  };
}
