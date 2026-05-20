"use client";

import { useCoins } from "@/components/CoinsProvider";
import { formatCoinDelta, PLINKO_DROP_COST } from "@/lib/coins";
import { describeCoinEffect } from "@/lib/wheel-segments";
import {
  PLINKO_COLUMNS,
  PLINKO_ROWS,
  plinkoSlots,
  simulatePlinkoPath,
  type PlinkoSlot,
} from "@/lib/plinko";
import { useCallback, useState } from "react";

const STEP_MS = 280;

export function Plinko() {
  const { balance, trySpend, applyEffect } = useCoins();
  const [dropping, setDropping] = useState(false);
  const [ballCol, setBallCol] = useState(Math.floor(PLINKO_COLUMNS / 2));
  const [highlightRow, setHighlightRow] = useState(-1);
  const [result, setResult] = useState<PlinkoSlot | null>(null);
  const [coinMessage, setCoinMessage] = useState<string | null>(null);

  const canAfford = balance >= PLINKO_DROP_COST;

  const drop = useCallback(() => {
    if (dropping || !canAfford) return;
    if (!trySpend(PLINKO_DROP_COST)) return;

    const { column, steps } = simulatePlinkoPath();
    const slot = plinkoSlots[column];
    const before = balance;

    setDropping(true);
    setResult(null);
    setCoinMessage(null);
    setHighlightRow(-1);
    setBallCol(steps[0]);

    let row = 0;
    const tick = () => {
      if (row < PLINKO_ROWS) {
        setHighlightRow(row);
        setBallCol(steps[row + 1]);
        row += 1;
        setTimeout(tick, STEP_MS);
        return;
      }

      setBallCol(column);
      const after = applyEffect(slot.coinEffect);
      setDropping(false);
      setHighlightRow(-1);
      setResult(slot);
      setCoinMessage(formatCoinDelta(before - PLINKO_DROP_COST, after));
    };

    setTimeout(tick, STEP_MS);
  }, [dropping, canAfford, trySpend, balance, applyEffect]);

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#2a1528] to-[#120a14] p-6 shadow-2xl shadow-black/50">
      <p className="text-center font-sans text-sm text-amber-100/70">
        Drop the chip ({PLINKO_DROP_COST} coins). It bounces through the pegs and lands in a
        payout slot.
      </p>

      <div className="relative mx-auto mt-6 w-full max-w-md">
        <div
          className="relative overflow-hidden rounded-xl border-2 border-amber-600/50 bg-[#0d0610]/90 px-2 pb-2 pt-4"
          style={{ minHeight: "22rem" }}
        >
          {Array.from({ length: PLINKO_ROWS }).map((_, row) => {
            const pegCount = row + 4;
            return (
              <div key={row} className="relative flex h-8 justify-center gap-2 sm:h-9 sm:gap-3">
                {Array.from({ length: pegCount }).map((_, peg) => (
                  <span
                    key={peg}
                    className={`h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5 ${
                      highlightRow === row
                        ? "bg-amber-300 shadow-[0_0_6px_#fbbf24]"
                        : "bg-amber-600/70"
                    }`}
                  />
                ))}
              </div>
            );
          })}

          <div
            className="pointer-events-none absolute z-10 h-4 w-4 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] transition-all duration-200"
            style={{
              left: `${((ballCol + 0.5) / PLINKO_COLUMNS) * 100}%`,
              top: dropping
                ? `${Math.min(88, 12 + ((highlightRow + 1) / (PLINKO_ROWS + 1)) * 72)}%`
                : "4%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <div className="mt-2 grid grid-cols-9 gap-0.5">
          {plinkoSlots.map((slot, i) => (
            <div
              key={slot.id}
              className={`rounded-b px-0.5 py-2 text-center font-sans text-[7px] font-bold leading-tight text-white sm:text-[8px] ${
                result?.id === slot.id && !dropping ? "ring-2 ring-amber-300" : ""
              }`}
              style={{ background: slot.color }}
            >
              {slot.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={drop}
          disabled={dropping || !canAfford}
          className="rounded-full bg-gradient-to-b from-amber-400 to-amber-700 px-8 py-3 font-sans text-sm font-bold uppercase tracking-wider text-amber-950 shadow-lg transition hover:from-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {dropping
            ? "Dropping…"
            : canAfford
              ? `Drop (−${PLINKO_DROP_COST})`
              : `Need ${PLINKO_DROP_COST} coins`}
        </button>
      </div>

      {result && !dropping && (
        <div className="mt-6 rounded-xl border border-amber-500/50 bg-amber-950/50 p-4 text-center">
          <p className="font-serif text-lg font-bold text-amber-50">Landed on {result.label}</p>
          <p className="mt-1 font-sans text-sm text-amber-200">
            {describeCoinEffect(result.coinEffect)}
            {coinMessage ? ` (${coinMessage})` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
