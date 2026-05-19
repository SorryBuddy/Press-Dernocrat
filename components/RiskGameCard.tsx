import Link from "next/link";
import type { RiskGameInfo } from "@/lib/risk-games";

const decorations: Record<
  string,
  { icon: React.ReactNode; accent: string; pattern: string }
> = {
  slots: {
    accent: "from-amber-500/20 via-rose-500/10 to-transparent",
    pattern:
      "bg-[repeating-linear-gradient(45deg,#fbbf24_0,#fbbf24_2px,transparent_2px,transparent_10px)]",
    icon: (
      <span className="text-4xl" aria-hidden>
        🎰
      </span>
    ),
  },
  "wheel-of-misfortune": {
    accent: "from-purple-500/20 via-red-600/10 to-transparent",
    pattern:
      "bg-[radial-gradient(circle_at_50%_50%,#dc2626_2px,transparent_2px)] bg-[length:16px_16px]",
    icon: (
      <span className="text-4xl" aria-hidden>
        🎡
      </span>
    ),
  },
};

export function RiskGameCard({ game }: { game: RiskGameInfo }) {
  const deco = decorations[game.slug] ?? decorations.slots;

  return (
    <Link
      href={game.href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-amber-500/30 bg-[#1a0f1f]/90 p-6 shadow-lg shadow-black/40 backdrop-blur-sm transition-all hover:border-amber-400/60 hover:shadow-amber-500/10"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${deco.accent} opacity-70`}
      />
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 opacity-20 ${deco.pattern}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>{deco.icon}</div>
        <span className="rounded-full border border-amber-500/40 bg-black/40 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-amber-200">
          {game.tag}
        </span>
      </div>

      <h3 className="relative mt-5 font-serif text-2xl font-bold text-amber-50 group-hover:text-amber-300">
        {game.title}
      </h3>
      <p className="relative mt-2 flex-1 font-sans text-sm leading-relaxed text-amber-100/70">
        {game.description}
      </p>

      <span className="relative mt-5 inline-flex items-center gap-1 font-sans text-sm font-semibold text-amber-400">
        Play
        <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}
