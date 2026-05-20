import type { CoinEffect } from "@/lib/coins";

export type PlinkoSlot = {
  id: string;
  label: string;
  color: string;
  coinEffect: CoinEffect;
};

export const PLINKO_ROWS = 8;
export const PLINKO_COLUMNS = 9;

/** Bottom slots — index matches final column (0 = left). */
export const plinkoSlots: PlinkoSlot[] = [
  { id: "p0", label: "−25", color: "#450a0a", coinEffect: { type: "add", amount: -25 } },
  { id: "p1", label: "×0.5", color: "#7f1d1d", coinEffect: { type: "multiply", factor: 0.5 } },
  { id: "p2", label: "−10", color: "#44403c", coinEffect: { type: "add", amount: -10 } },
  { id: "p3", label: "+10", color: "#312e81", coinEffect: { type: "add", amount: 10 } },
  { id: "p4", label: "×2", color: "#14532d", coinEffect: { type: "multiply", factor: 2 } },
  { id: "p5", label: "+25", color: "#854d0e", coinEffect: { type: "add", amount: 25 } },
  { id: "p6", label: "×1.5", color: "#a16207", coinEffect: { type: "multiply", factor: 1.5 } },
  { id: "p7", label: "+50", color: "#4c1d95", coinEffect: { type: "add", amount: 50 } },
  { id: "p8", label: "×3", color: "#065f46", coinEffect: { type: "multiply", factor: 3 } },
];

/** Random walk from center; returns final column 0..8. */
export function simulatePlinkoPath(): { column: number; steps: number[] } {
  let column = Math.floor(PLINKO_COLUMNS / 2);
  const steps: number[] = [column];

  for (let row = 0; row < PLINKO_ROWS; row++) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    column = Math.max(0, Math.min(PLINKO_COLUMNS - 1, column + dir));
    steps.push(column);
  }

  return { column, steps };
}
