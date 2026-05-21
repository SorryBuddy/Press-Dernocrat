import type { CoinEffect } from "@/lib/coins";
import { WHEEL_JACKPOT_AMOUNT } from "@/lib/coins";

export type WheelSegment = {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  type: "punishment" | "reward" | "neutral";
  weight: number;
  coinEffect: CoinEffect;
};

/**
 * Wheel weights — heavily biased toward common outcomes.
 *
 * Mega-rewards (×10, JACKPOT) are intentionally rare (<1% combined). Modest
 * trims and bumps dominate so the game feels noisy but not punishing.
 */
export const wheelSegments: WheelSegment[] = [
  {
    id: "half",
    label: "Half your coins — the house takes a cut",
    shortLabel: "×0.5",
    color: "#7f1d1d",
    type: "punishment",
    weight: 22,
    coinEffect: { type: "multiply", factor: 0.5 },
  },
  {
    id: "quarter",
    label: "Lose three quarters of your stack",
    shortLabel: "×0.25",
    color: "#450a0a",
    type: "punishment",
    weight: 10,
    coinEffect: { type: "multiply", factor: 0.25 },
  },
  {
    id: "minus-40",
    label: "Flat −40 coins. Ouch.",
    shortLabel: "−40",
    color: "#1c1917",
    type: "punishment",
    weight: 18,
    coinEffect: { type: "add", amount: -40 },
  },
  {
    id: "minus-20",
    label: "−20 coins to the house tip jar",
    shortLabel: "−20",
    color: "#44403c",
    type: "punishment",
    weight: 22,
    coinEffect: { type: "add", amount: -20 },
  },
  {
    id: "times-1-25",
    label: "×1.25 — a modest bump",
    shortLabel: "×1.25",
    color: "#854d0e",
    type: "reward",
    weight: 18,
    coinEffect: { type: "multiply", factor: 1.25 },
  },
  {
    id: "times-1-5",
    label: "×1.5 multiplier!",
    shortLabel: "×1.5",
    color: "#a16207",
    type: "reward",
    weight: 12,
    coinEffect: { type: "multiply", factor: 1.5 },
  },
  {
    id: "double",
    label: "Double your coins!",
    shortLabel: "×2",
    color: "#14532d",
    type: "reward",
    weight: 6,
    coinEffect: { type: "multiply", factor: 2 },
  },
  {
    id: "triple",
    label: "Triple it — rare luck",
    shortLabel: "×3",
    color: "#065f46",
    type: "reward",
    weight: 2,
    coinEffect: { type: "multiply", factor: 3 },
  },
  {
    id: "times-5",
    label: "×5 — the reels are jealous",
    shortLabel: "×5",
    color: "#0e7490",
    type: "reward",
    weight: 1,
    coinEffect: { type: "multiply", factor: 5 },
  },
  {
    id: "plus-15",
    label: "+15 coins. Baby steps.",
    shortLabel: "+15",
    color: "#312e81",
    type: "reward",
    weight: 20,
    coinEffect: { type: "add", amount: 15 },
  },
  {
    id: "plus-50",
    label: "+50 coins from the couch cushions",
    shortLabel: "+50",
    color: "#4c1d95",
    type: "reward",
    weight: 5,
    coinEffect: { type: "add", amount: 50 },
  },
  {
    id: "break-even",
    label: "Break even — nothing happens",
    shortLabel: "×1",
    color: "#57534e",
    type: "neutral",
    weight: 16,
    coinEffect: { type: "multiply", factor: 1 },
  },
  {
    id: "times-0-75",
    label: "×0.75 — a gentle trim",
    shortLabel: "×0.75",
    color: "#831843",
    type: "punishment",
    weight: 22,
    coinEffect: { type: "multiply", factor: 0.75 },
  },
  {
    id: "minus-75",
    label: "−75 coins. The house cackles.",
    shortLabel: "−75",
    color: "#581c87",
    type: "punishment",
    weight: 3,
    coinEffect: { type: "add", amount: -75 },
  },
  {
    id: "times-10",
    label: "×10 — extremely rare windfall",
    shortLabel: "×10",
    color: "#b45309",
    type: "reward",
    weight: 0.5,
    coinEffect: { type: "multiply", factor: 10 },
  },
  {
    id: "jackpot",
    label: `JACKPOT! +${WHEEL_JACKPOT_AMOUNT} coins`,
    shortLabel: "JACKPOT",
    color: "#fbbf24",
    type: "reward",
    weight: 0.5,
    coinEffect: { type: "jackpot", amount: WHEEL_JACKPOT_AMOUNT },
  },
];

export function pickWeightedSegment(): WheelSegment {
  const total = wheelSegments.reduce((sum, s) => sum + s.weight, 0);
  let r = Math.random() * total;
  for (const seg of wheelSegments) {
    r -= seg.weight;
    if (r <= 0) return seg;
  }
  return wheelSegments[0];
}

export function describeCoinEffect(effect: CoinEffect): string {
  switch (effect.type) {
    case "multiply":
      return effect.factor === 1 ? "No change" : `Balance ×${effect.factor}`;
    case "add":
      return effect.amount >= 0 ? `+${effect.amount} coins` : `${effect.amount} coins`;
    case "jackpot":
      return `+${effect.amount} coins (jackpot!)`;
  }
}
