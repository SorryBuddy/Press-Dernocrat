"use client";

import { useCoins } from "@/components/CoinsProvider";

function RedCoinIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0 drop-shadow-sm"
    >
      <circle cx="12" cy="12" r="10" fill="#c41230" stroke="#8b0e22" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="#fca5a5" strokeWidth="1" opacity="0.6" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="#fff"
        fontSize="11"
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
      >
        ¢
      </text>
    </svg>
  );
}

export function CoinBalance() {
  const { balance, ready } = useCoins();

  return (
    <div
      className="fixed top-2 right-2 z-[100] flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm"
      aria-label={`Coin balance: ${balance}`}
    >
      <RedCoinIcon />
      <span className="min-w-[2.5ch] font-sans text-base font-bold tabular-nums text-neutral-900">
        {ready ? balance : "…"}
      </span>
    </div>
  );
}
