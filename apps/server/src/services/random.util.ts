// Shared randomness primitives. Injecting a RandomSource (instead of calling
// Math.random directly) keeps question generation and CPU behaviour
// deterministically testable.

export type RandomSource = () => number;

/** Uniform integer in the inclusive range [min, max]. */
export function randomInt(min: number, max: number, rng: RandomSource): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
