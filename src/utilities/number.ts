import { toArray } from './iterable';

/**
 * Generates a random number between a min an a max.
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Clamps a value between a min and a max, preventing getting out of bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function* genRange(from: number, to: number, step = 1): Generator<number> {
  let i = from;

  while (i < to) {
    yield i;
    i += step;
  }
}

/**
 * Generates a range of numbers.
 */
export function range(from: number, to: number, step?: number): number[] {
  if (to <= from) return [];
  return toArray(genRange(from, to, step));
}
