"use client";

import { useCoins } from "@/components/CoinsProvider";
import { formatCoinDelta } from "@/lib/coins";
import {
  describeCoinEffect,
  pickWeightedSegment,
  wheelSegments,
  type WheelSegment,
} from "@/lib/wheel-segments";
import { useCallback, useMemo, useRef, useState } from "react";

const SPIN_DURATION_MS = 4500;
const FULL_ROTATIONS = 5;

/**
 * Geometry conventions used throughout this component:
 *
 *  - The conic gradient is the DEFAULT (no `from` offset), so it starts at the
 *    top (12 o'clock) and proceeds clockwise. Segment `i` occupies the wedge
 *    [i * segAng, (i+1) * segAng] measured clockwise from the top.
 *  - The pointer is fixed at the top, pointing down at the wheel.
 *  - Wheel rotation `R` (in degrees, clockwise positive) means that the
 *    segment whose original center sat at angle `θ` clockwise from top now
 *    sits at angle `(θ + R) mod 360`.
 *  - Therefore the segment currently under the pointer is the one whose
 *    rotated center is closest to 0 (mod 360).
 *  - For CSS `transform: rotate(deg)`, 0deg means no rotation, and a label
 *    positioned with `transform-origin: left` initially extends to the right
 *    (3 o'clock = 90° clockwise from top). So to make a label extend toward
 *    angle θ clockwise from top, we rotate it by (θ - 90)°.
 */

function modAngle(deg: number): number {
  const m = deg % 360;
  return m < 0 ? m + 360 : m;
}

/** Given a final rotation in degrees, return the segment index under the pointer. */
function segmentAtPointer(rotationDeg: number, segments: WheelSegment[]): number {
  const segAng = 360 / segments.length;
  // In the wheel's local frame, the pointer (world top) is at angle (-R) cw from local top.
  const localAngle = modAngle(-rotationDeg);
  let idx = Math.floor(localAngle / segAng);
  if (idx < 0) idx = 0;
  if (idx >= segments.length) idx = segments.length - 1;
  return idx;
}

export function WheelOfMisfortune() {
  const { balance, applyEffect } = useCoins();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [coinMessage, setCoinMessage] = useState<string | null>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const segmentAngle = 360 / wheelSegments.length;

  const conicGradient = useMemo(() => {
    const stops = wheelSegments
      .map((seg, i) => {
        const start = (i / wheelSegments.length) * 100;
        const end = ((i + 1) / wheelSegments.length) * 100;
        return `${seg.color} ${start}% ${end}%`;
      })
      .join(", ");
    // Default conic-gradient starts at the top and goes clockwise.
    return `conic-gradient(${stops})`;
  }, []);

  const spin = useCallback(() => {
    if (spinning) return;

    const landed = pickWeightedSegment();
    const index = wheelSegments.findIndex((s) => s.id === landed.id);

    // Small random offset inside the segment (clamped so it stays inside),
    // makes the wheel feel less robotic without changing which segment wins.
    const offsetWithinSegment = (Math.random() - 0.5) * (segmentAngle * 0.7);
    const segmentCenter = index * segmentAngle + segmentAngle / 2;
    const targetCenter = segmentCenter + offsetWithinSegment;

    // Rotation needed so that the pointer (at top, world angle 0) lines up
    // with the (rotated) segment center: targetCenter + R ≡ 0 (mod 360)
    // ⇒ R ≡ -targetCenter (mod 360).
    const targetMod = modAngle(-targetCenter);

    setSpinning(true);
    setResult(null);
    setCoinMessage(null);

    const before = balance;
    const currentMod = modAngle(rotation);
    let delta = targetMod - currentMod;
    if (delta <= 0) delta += 360;
    const finalRotation = rotation + FULL_ROTATIONS * 360 + delta;
    setRotation(finalRotation);

    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => {
      // Read the segment currently under the pointer from the actual rotation
      // we just animated to. This guarantees the visible segment IS the prize.
      const actualIndex = segmentAtPointer(finalRotation, wheelSegments);
      const actualSegment = wheelSegments[actualIndex] ?? landed;
      const after = applyEffect(actualSegment.coinEffect);
      setSpinning(false);
      setResult(actualSegment);
      setCoinMessage(formatCoinDelta(before, after));
    }, SPIN_DURATION_MS);
  }, [spinning, segmentAngle, balance, rotation, applyEffect]);

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
              const centerAngle = i * segmentAngle + segmentAngle / 2;
              // CSS rotate(0) makes the label extend to the right (3 o'clock,
              // which is 90° cw from top). To extend toward `centerAngle` cw
              // from top we subtract 90°.
              const labelRot = centerAngle - 90;
              return (
                <span
                  key={seg.id}
                  className="pointer-events-none absolute left-1/2 top-1/2 w-[44%] origin-left -translate-y-1/2 pr-2 text-right font-sans text-[8px] font-bold uppercase leading-tight tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:text-[9px]"
                  style={{
                    transform: `rotate(${labelRot}deg)`,
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
                {s.id === "jackpot" || s.id === "times-10" ? " ★ very rare" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
