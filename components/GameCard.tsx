import Link from "next/link";
import type { GameInfo } from "@/lib/games";

const decorations: Record<
  string,
  { icon: React.ReactNode; accent: string; pattern: string }
> = {
  "tic-tac-toe": {
    accent: "from-[#c41230]/10 to-transparent",
    pattern:
      "bg-[radial-gradient(circle_at_80%_20%,#c41230_1px,transparent_1px)] bg-[length:12px_12px]",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line x1="18" y1="4" x2="18" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="30" y1="4" x2="30" y2="44" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2" />
        <text x="11" y="17" fontSize="10" fontWeight="bold" fill="currentColor">
          X
        </text>
        <text x="35" y="35" fontSize="10" fontWeight="bold" fill="currentColor">
          O
        </text>
      </svg>
    ),
  },
  "coin-flip": {
    accent: "from-amber-100/80 to-transparent",
    pattern:
      "bg-[radial-gradient(circle_at_20%_80%,#d97706_1.5px,transparent_1.5px)] bg-[length:14px_14px]",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <ellipse
          cx="24"
          cy="24"
          rx="18"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">
          ¢
        </text>
      </svg>
    ),
  },
  sudoku: {
    accent: "from-slate-200/80 to-transparent",
    pattern:
      "bg-[linear-gradient(90deg,#94a3b8_1px,transparent_1px),linear-gradient(#94a3b8_1px,transparent_1px)] bg-[size:10px_10px]",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden>
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line x1="18" y1="6" x2="18" y2="42" stroke="currentColor" strokeWidth="2.5" />
        <line x1="30" y1="6" x2="30" y2="42" stroke="currentColor" strokeWidth="2.5" />
        <line x1="6" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="2.5" />
        <line x1="6" y1="30" x2="42" y2="30" stroke="currentColor" strokeWidth="2.5" />
        <text x="11" y="16" fontSize="8" fill="currentColor">
          9
        </text>
        <text x="33" y="38" fontSize="8" fill="currentColor">
          4
        </text>
      </svg>
    ),
  },
};

export function GameCard({ game }: { game: GameInfo }) {
  const deco = decorations[game.slug] ?? decorations.sudoku;

  return (
    <Link
      href={game.href}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${deco.accent} opacity-60`}
      />
      <div
        className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24 opacity-30 ${deco.pattern}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="text-[#c41230]">{deco.icon}</div>
        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
          {game.tag}
        </span>
      </div>

      <h3 className="relative mt-5 font-serif text-2xl font-bold text-neutral-900 group-hover:text-[#c41230]">
        {game.title}
      </h3>
      <p className="relative mt-2 flex-1 font-sans text-sm leading-relaxed text-neutral-600">
        {game.description}
      </p>

      <span className="relative mt-5 inline-flex items-center gap-1 font-sans text-sm font-semibold text-[#c41230]">
        Play
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}
