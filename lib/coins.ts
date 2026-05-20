export const DEFAULT_COIN_BALANCE = 200;
export const COIN_STORAGE_KEY = "pdd-coin-balance";
export const SLOT_SPIN_COST = 5;
export const SLOT_JACKPOT_AMOUNT = 1000;
export const SLOT_JACKPOT_CHANCE = 0.02;
export const WHEEL_JACKPOT_AMOUNT = 1000;
export const PLINKO_DROP_COST = 8;

export type CoinEffect =
  | { type: "multiply"; factor: number }
  | { type: "add"; amount: number }
  | { type: "jackpot"; amount: number };

export function applyCoinEffect(balance: number, effect: CoinEffect): number {
  switch (effect.type) {
    case "multiply":
      return Math.max(0, Math.floor(balance * effect.factor));
    case "add":
      return Math.max(0, balance + effect.amount);
    case "jackpot":
      return balance + effect.amount;
  }
}

export function formatCoinDelta(before: number, after: number): string {
  const diff = after - before;
  if (diff > 0) return `+${diff} coins`;
  if (diff < 0) return `${diff} coins`;
  return "No change";
}

export function readStoredBalance(): number {
  if (typeof window === "undefined") return DEFAULT_COIN_BALANCE;
  try {
    const raw = localStorage.getItem(COIN_STORAGE_KEY);
    if (raw === null) return DEFAULT_COIN_BALANCE;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_COIN_BALANCE;
  } catch {
    return DEFAULT_COIN_BALANCE;
  }
}

export function writeStoredBalance(balance: number): void {
  try {
    localStorage.setItem(COIN_STORAGE_KEY, String(Math.max(0, balance)));
  } catch {
    /* ignore quota / private mode */
  }
}
