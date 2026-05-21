/**
 * Plinko config — Stake-style.
 *
 * Multiplier tables match the standard public Stake Originals plinko payouts
 * for 8 / 12 / 16 rows at Low / Medium / High risk. Each row of pegs ends in
 * `rows + 1` slots, with multipliers symmetric around the center.
 *
 * House edge comes from the fact that, under a true binomial distribution
 * (50/50 left/right at each peg), the expected return is < 1× the bet.
 */

export const PLINKO_RISKS = ["low", "medium", "high"] as const;
export type PlinkoRisk = (typeof PLINKO_RISKS)[number];

export const PLINKO_ROW_OPTIONS = [8, 12, 16] as const;
export type PlinkoRows = (typeof PLINKO_ROW_OPTIONS)[number];

export const PLINKO_MIN_BET = 1;
export const PLINKO_MAX_BET = 500;
export const PLINKO_DEFAULT_BET = 10;

/** Legacy export — single-drop cost used by older UI. Kept for compatibility. */
export const PLINKO_DROP_COST = PLINKO_DEFAULT_BET;

const TABLES: Record<PlinkoRows, Record<PlinkoRisk, number[]>> = {
  8: {
    low: [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
    medium: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    high: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  },
  12: {
    low: [10, 3, 1.6, 1.4, 1.1, 1.0, 0.5, 1.0, 1.1, 1.4, 1.6, 3, 10],
    medium: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    high: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
  },
  16: {
    low: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1.0, 0.5, 1.0, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
    medium: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    high: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
  },
};

export function getPlinkoMultipliers(rows: PlinkoRows, risk: PlinkoRisk): number[] {
  return TABLES[rows][risk];
}

/**
 * Slot color follows the canonical Stake palette: hot reds/oranges on the
 * extreme outer slots (rare, big multipliers) cooling toward yellow as the
 * multiplier drops, with the worst (sub-1×) slots using a muted amber/yellow.
 */
export function plinkoSlotColor(multiplier: number): string {
  if (multiplier >= 50) return "#7f1d1d";
  if (multiplier >= 20) return "#b91c1c";
  if (multiplier >= 10) return "#dc2626";
  if (multiplier >= 5) return "#ea580c";
  if (multiplier >= 2) return "#f97316";
  if (multiplier >= 1.3) return "#fb923c";
  if (multiplier >= 1.0) return "#fbbf24";
  if (multiplier >= 0.5) return "#f59e0b";
  return "#b45309";
}

export function formatMultiplier(m: number): string {
  if (m >= 100) return `${Math.round(m)}×`;
  if (m >= 10) return `${m.toFixed(0)}×`;
  return `${m.toFixed(m % 1 === 0 ? 0 : m < 1 ? 1 : 1)}×`;
}

/* ---------- Physics tuning ---------- */

/**
 * Tuned to feel close to the Stake Plinko engine: gravity dominates, peg
 * collisions lose ~half their energy and add a small random kick so the
 * outcome distribution looks roughly binomial but no two drops are identical.
 */
export const PLINKO_PHYSICS = {
  gravity: 0.16,
  airFriction: 0.999,
  restitution: 0.55,
  /** Small horizontal kick added on every peg hit (rad/frame-ish). */
  pegJitter: 0.55,
  /** Max horizontal speed clamp so balls don't fly off the rails. */
  maxVx: 4.5,
  /** Random horizontal velocity given at spawn so the first peg is non-deterministic. */
  spawnVx: 0.6,
  /** Sub-steps per animation frame for stable collisions. */
  subSteps: 4,
} as const;
