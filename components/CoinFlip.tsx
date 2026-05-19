"use client";

import { useState } from "react";

type Side = "heads" | "tails";

const FLIP_DURATION_MS = 1000;

export function CoinFlip() {
  const [result, setResult] = useState<Side | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [flipKey, setFlipKey] = useState(0);

  function flip() {
    const side: Side = Math.random() < 0.5 ? "heads" : "tails";
    setFlipping(true);
    setResult(null);
    setFlipKey((k) => k + 1);

    setTimeout(() => {
      setResult(side);
      setFlipping(false);
    }, FLIP_DURATION_MS);
  }

  const landedRotation = result === "tails" ? "rotateY(180deg)" : "rotateY(0deg)";

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="mt-2 font-sans text-sm text-neutral-600">
        Settle debates, pick teams, or decide who does the dishes.
      </p>

      <div className="coin-scene mx-auto mt-8 flex h-40 items-center justify-center">
        <div
          key={flipKey}
          className={`coin-3d relative h-32 w-32 ${flipping ? "coin-flip-animate" : ""}`}
          style={
            !flipping && result
              ? { transform: landedRotation }
              : flipping
                ? undefined
                : { transform: "rotateY(0deg)" }
          }
        >
          {/* Heads — warm gold, sun motif */}
          <div
            className="coin-face absolute inset-0 overflow-hidden rounded-full border-4 border-amber-700 shadow-lg"
            style={{
              transform: "rotateY(0deg) translateZ(6px)",
              background: "radial-gradient(circle at 35% 30%, #fde68a, #f59e0b 55%, #b45309)",
            }}
          >
            <div className="absolute inset-2 rounded-full border border-amber-800/30" />
            <svg
              className="absolute inset-0 m-auto h-14 w-14 text-amber-950/80"
              viewBox="0 0 64 64"
              aria-hidden
            >
              <circle cx="32" cy="32" r="14" fill="currentColor" opacity="0.25" />
              <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="32"
                  y1="32"
                  x2={32 + 22 * Math.cos((deg * Math.PI) / 180)}
                  y2={32 + 22 * Math.sin((deg * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
              ))}
            </svg>
            <span className="absolute bottom-3 left-0 right-0 text-center font-serif text-xs font-bold uppercase tracking-[0.2em] text-amber-950">
              Heads
            </span>
          </div>

          {/* Tails — cool silver, star motif */}
          <div
            className="coin-face absolute inset-0 overflow-hidden rounded-full border-4 border-slate-500 shadow-lg"
            style={{
              transform: "rotateY(180deg) translateZ(6px)",
              background: "radial-gradient(circle at 65% 35%, #f1f5f9, #94a3b8 50%, #475569)",
            }}
          >
            <div className="absolute inset-2 rounded-full border border-slate-600/40" />
            <svg
              className="absolute inset-0 m-auto h-12 w-12 text-slate-800"
              viewBox="0 0 64 64"
              aria-hidden
            >
              <polygon
                points="32,8 37,26 56,26 41,38 47,56 32,44 17,56 23,38 8,26 27,26"
                fill="currentColor"
                opacity="0.35"
              />
              <polygon
                points="32,14 36,28 50,28 39,37 43,50 32,42 21,50 25,37 14,28 28,28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="absolute bottom-3 left-0 right-0 text-center font-serif text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
              Tails
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 min-h-[1.25rem] text-center font-sans text-sm font-semibold text-neutral-700">
        {flipping && "Spinning…"}
        {!flipping && result && `It's ${result}!`}
        {!flipping && !result && "\u00a0"}
      </p>

      <button
        type="button"
        onClick={flip}
        disabled={flipping}
        className="mt-2 w-full bg-[#c41230] px-5 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a30f28] disabled:opacity-60"
      >
        {flipping ? "Flipping…" : "Flip Coin"}
      </button>
    </div>
  );
}
