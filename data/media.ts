/** Shared shapes for the images and short notes that sit beside projects (used by the folder and the plain edition). */

export type Figure = {
  /** Browser path (files live in public/images). Keep the exact capitalisation: some hosts are case sensitive. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Short label printed under the image. */
  caption: string;
};

/**
 * A short, quiet note printed with the evidence.
 *   internal  company systems: only a login screen can be shown
 *   status    where a project currently stands
 *   scope     who or where a project was built for
 */
export type Note = {
  tone: "internal" | "status" | "scope";
  label: string;
  text: string;
};

/** Technologies grouped the way the portfolio presents them. A group that is left out is not shown. */
export type TechStack = {
  frontend?: string[];
  backend?: string[];
  /** Where it is hosted. `scope` says which part is hosted there, when it is only a part (e.g. "Backend"). */
  deployment?: { name: string; scope?: string }[];
};

/** Every technology name in a stack, once, in display order. */
export function stackNames(stack: TechStack): string[] {
  return Array.from(new Set([...(stack.frontend ?? []), ...(stack.backend ?? []), ...(stack.deployment ?? []).map((d) => d.name)]));
}

/** A company or school mark. `crop` zooms into part of a larger picture instead of squeezing it (no distortion). */
export type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: { cx: number; cy: number; size: number };
};
