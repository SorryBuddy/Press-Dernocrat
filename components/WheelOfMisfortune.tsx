"use client";

import { useCoins } from "@/components/CoinsProvider";
import { formatCoinDelta } from "@/lib/coins";
import {
  describeCoinEffect,
  pickWeightedSegment,
  wheelSegments,
  type WheelSegment,
} from "@/lib/wheel-segments";
import { useCallback, useMemo, useState } from "react";

const SPIN_DURATION_MS = 4500;
const FULL_ROTATIONS = 5;

export function WheelOfMisfortune() {
  const { balance, applyEffect } = useCoins();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [coinMessage, setCoinMessage] = useState<string | null>(null);

  const segmentAngle = 360 / wheelSegments.length;

  const conicGradient = useMemo(() => {
    const stops = wheelSegments
      .map((seg, i) => {
        const start = (i / wheelSegments.length) * 100;
        const end = ((i + 1) / wheelSegments.length) * 100;
        return `${seg.color} ${start}% ${end}%`;
      })
      .join(", ");
    return `conic-gradient(from -90deg, ${stops})`;
  }, []);

  const spin = useCallback(() => {
    if (spinning) return;

    const landed = pickWeightedSegment();
    const index = wheelSegments.findIndex((s) => s.id === landed.id);
    const segmentCenter = index * segmentAngle + segmentAngle / 2;

    const before = balance;
    setSpinning(true);
    setResult(null);
    setCoinMessage(null);
    setRotation((prev) => {
      const currentMod = ((prev % 360) + 360) % 360;
      const targetMod = (360 - segmentCenter + 360) % 360;
      let delta = targetMod - currentMod;
      if (delta <= 0) delta += 360;
      return prev + FULL_ROTATIONS * 360 + delta;
    });

    setTimeout(() => {
      const after = applyEffect(landed.coinEffect);
      setSpinning(false);
      setResult(landed);
      setCoinMessage(formatCoinDelta(before, after));
    }, SPIN_DURATION_MS);
  }, [spinning, segmentAngle, balance, applyEffect]);

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#2a1528] to-[#120a14] p-6 shadow-2xl shadow-black/50">
      <p className="text-center font-sans text-sm text-amber-100/70">
        Spin to multiply, lose, or hit the rare jackpot. Your coin balance updates
        instantly.
      </p>

      <div className="relative mx-auto mt-8 flex w-full max-w-sm flex-col items-center">
        <div
          className="pointer-events-none absolute -top-1 z-20 h-0 w-0 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          aria-hidden
        />

        <div className="relative rounded-full border-4 border-amber-500/80 p-2 shadow-[0_0_40px_rgba(251,191,36,0.25)]">
          <div
            className="wheel-spin relative h-72 w-72 rounded-full sm:h-80 sm:w-80"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.15, 0.85, 0.2, 1)`
                : "none",
              background: conicGradient,
            }}
          >
            {wheelSegments.map((seg, i) => {
              const angle = i * segmentAngle + segmentAngle / 2;
              return (
                <span
                  key={seg.id}
                  className="absolute left-1/2 top-1/2 w-[42%] origin-left -translate-y-1/2 text-center font-sans text-[8px] font-bold leading-tight text-white drop-shadow-md sm:text-[9px]"
                  style={{
                    transform: `rotate(${angle}deg) translateX(18%)`,
                  }}
                >
                  {seg.shortLabel}
                </span>
              );
            })}
          </div>

          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-300 bg-gradient-to-b from-amber-500 to-amber-800 font-sans text-xs font-bold uppercase tracking-wide text-amber-950 shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 sm:h-20 sm:w-20 sm:text-sm"
          >
            {spinning ? "…" : "Spin"}
          </button>
        </div>
      </div>

      {result && !spinning && (
        <div
          className={`mt-8 rounded-xl border p-5 text-center ${
            result.id === "jackpot"
              ? "border-amber-300/80 bg-amber-950/60 shadow-[0_0_24px_rgba(251,191,36,0.35)]"
              : result.type === "reward"
                ? "border-emerald-500/50 bg-emerald-950/40"
                : result.type === "punishment"
                  ? "border-red-500/50 bg-red-950/40"
                  : "border-amber-500/50 bg-amber-950/40"
          }`}
        >
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-amber-300">
            {result.id === "jackpot"
              ? "Jackpot!"
              : result.type === "reward"
                ? "Coins gained"
                : result.type === "punishment"
                  ? "Coins lost"
                  : "No change"}
          </p>
          <p className="mt-2 font-serif text-xl font-bold text-amber-50">{result.label}</p>
          <p className="mt-2 font-sans text-sm font-semibold text-amber-200">
            {describeCoinEffect(result.coinEffect)}
            {coinMessage ? ` (${coinMessage})` : ""}
          </p>
        </div>
      )}

      <div className="mt-8">
        <p className="font-sans text-xs font-bold uppercase tracking-wider text-amber-400/80">
          Payouts (weighted)
        </p>
        <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto font-sans text-xs text-amber-100/60">
          {wheelSegments.map((s) => (
            <li key={s.id} className="flex gap-2">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span>
                {s.shortLabel}: {describeCoinEffect(s.coinEffect)}
                {s.id === "jackpot" ? " ★ rare" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
