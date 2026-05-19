"use client";

import { useCoins } from "@/components/CoinsProvider";
import {
  SLOT_JACKPOT_AMOUNT,
  SLOT_JACKPOT_CHANCE,
  SLOT_SPIN_COST,
} from "@/lib/coins";
import { useCallback, useState } from "react";

const SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣", "💎"] as const;
const SPIN_MS = 2200;
const REEL_STAGGER_MS = 200;

type ReelState = {
  spinning: boolean;
  display: string;
  final: string;
};

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function pickOutcome(): { reels: [string, string, string]; jackpot: boolean } {
  if (Math.random() < SLOT_JACKPOT_CHANCE) {
    return { reels: ["7️⃣", "7️⃣", "7️⃣"], jackpot: true };
  }

  let a = randomSymbol();
  let b = randomSymbol();
  let c = randomSymbol();
  while (a === b && b === c) {
    c = randomSymbol();
  }
  return { reels: [a, b, c], jackpot: false };
}

export function SlotMachine() {
  const { balance, trySpend, addCoins } = useCoins();
  const [reels, setReels] = useState<ReelState[]>([
    { spinning: false, display: "🍒", final: "🍒" },
    { spinning: false, display: "🍋", final: "🍋" },
    { spinning: false, display: "🔔", final: "🔔" },
  ]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [winFlash, setWinFlash] = useState(false);

  const canAfford = balance >= SLOT_SPIN_COST;

  const spin = useCallback(() => {
    if (spinning || !canAfford) return;
    if (!trySpend(SLOT_SPIN_COST)) return;

    const { reels: finalReels, jackpot } = pickOutcome();
    const [f0, f1, f2] = finalReels;

    setSpinning(true);
    setMessage(null);
    setWinFlash(false);

    setReels([
      { spinning: true, display: randomSymbol(), final: f0 },
      { spinning: true, display: randomSymbol(), final: f1 },
      { spinning: true, display: randomSymbol(), final: f2 },
    ]);

    const interval = setInterval(() => {
      setReels((prev) =>
        prev.map((r) => (r.spinning ? { ...r, display: randomSymbol() } : r)),
      );
    }, 80);

    [0, 1, 2].forEach((i) => {
      setTimeout(() => {
        setReels((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], spinning: false, display: next[i].final };
          return next;
        });
      }, SPIN_MS + i * REEL_STAGGER_MS);
    });

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);

      if (jackpot) {
        addCoins(SLOT_JACKPOT_AMOUNT);
        setMessage(`JACKPOT! +${SLOT_JACKPOT_AMOUNT} coins!`);
        setWinFlash(true);
      } else {
        setMessage(`No jackpot. −${SLOT_SPIN_COST} coins for the spin.`);
      }
    }, SPIN_MS + 2 * REEL_STAGGER_MS + 100);
  }, [spinning, canAfford, trySpend, addCoins]);

  return (
    <div
      className={`rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#2a1528] to-[#120a14] p-6 shadow-2xl shadow-black/50 ${
        winFlash ? "slot-win-pulse" : ""
      }`}
    >
      <p className="text-center font-sans text-sm text-amber-100/70">
        Each pull costs <strong className="text-amber-300">{SLOT_SPIN_COST} coins</strong>.
        Jackpot pays <strong className="text-amber-300">{SLOT_JACKPOT_AMOUNT} coins</strong>{" "}
        (~{Math.round(SLOT_JACKPOT_CHANCE * 100)}% chance).
      </p>

      <div className="slot-machine-frame mx-auto mt-6 max-w-md rounded-xl border-4 border-amber-600/80 bg-[#0d0610] p-4 shadow-[inset_0_0_40px_rgba(251,191,36,0.15)]">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          <span className="font-serif text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
            Lucky Lede
          </span>
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-black/60 p-3">
          {reels.map((reel, i) => (
            <div
              key={i}
              className="slot-reel-window relative overflow-hidden rounded-md border-2 border-amber-700/50 bg-gradient-to-b from-neutral-900 to-black"
            >
              <div
                className={`flex h-24 items-center justify-center text-5xl ${
                  reel.spinning ? "slot-reel-spin" : "slot-reel-land"
                }`}
              >
                {reel.display}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={spin}
            disabled={spinning || !canAfford}
            className="slot-lever relative rounded-full bg-gradient-to-b from-amber-400 to-amber-700 px-8 py-3 font-sans text-sm font-bold uppercase tracking-wider text-amber-950 shadow-lg transition hover:from-amber-300 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {spinning
              ? "Spinning…"
              : canAfford
                ? `Pull Lever (−${SLOT_SPIN_COST})`
                : `Need ${SLOT_SPIN_COST} coins`}
          </button>
          {!canAfford && !spinning && (
            <p className="font-sans text-xs text-red-300/90">
              Not enough coins — try the wheel or earn more elsewhere.
            </p>
          )}
        </div>
      </div>

      {message && (
        <p
          className={`mt-6 text-center font-sans text-sm font-semibold ${
            winFlash ? "text-amber-300" : "text-amber-100/80"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
