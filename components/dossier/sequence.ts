/**
 * Plans the order in which the blocks on one half-page are revealed.
 *
 * Each call returns { s, d }: the reveal progress (0..1) at which a block starts appearing and how long
 * it takes. The reveal progress of a sheet follows the page turn that uncovers it, so everything is
 * readable well before the turn ends. The stagger is short and constant (it does not depend on how
 * much text there is), which keeps the reading order natural without making anyone wait.
 */
export type Seq = (length?: number | string) => { s: number; d: number };

export function sequence(): Seq {
  let i = 0;
  return () => {
    const s = Math.min(0.5, i * 0.05);
    i += 1;
    return { s, d: 0.28 };
  };
}
