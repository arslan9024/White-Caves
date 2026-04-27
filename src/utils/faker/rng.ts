/**
 * Seeded PRNG — Deterministic random numbers from a seed.
 * Produces same data on every run, making snapshots + tests stable.
 */
export function createRng(seed = 42) {
  let s = seed;
  return {
    /** Returns a float in [0, 1) */
    next(): number {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    },
    /** Returns an int in [min, max] inclusive */
    int(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    /** Pick a random element from an array */
    pick<T>(arr: readonly T[]): T {
      return arr[this.int(0, arr.length - 1)];
    },
    /** Pick N unique elements from an array */
    pickN<T>(arr: readonly T[], n: number): T[] {
      const copy = [...arr];
      const result: T[] = [];
      const count = Math.min(n, copy.length);
      for (let i = 0; i < count; i++) {
        const idx = this.int(0, copy.length - 1);
        result.push(copy[idx]);
        copy.splice(idx, 1);
      }
      return result;
    },
    /** Returns true with probability p */
    chance(p: number): boolean {
      return this.next() < p;
    },
  };
}

export type Rng = ReturnType<typeof createRng>;
