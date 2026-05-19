import { CasinoPageWrapper } from "@/components/CasinoPageWrapper";
import { RiskGameCard } from "@/components/RiskGameCard";
import { SiteHeader } from "@/components/SiteHeader";
import { riskGames } from "@/lib/risk-games";
import { siteContainerClass } from "@/lib/site-layout";

export const metadata = {
  title: "Risk Taking | Press Dernocrat Daily",
  description: "Casino-style games for the bold and slightly unwise.",
};

export default function RiskTakingPage() {
  return (
    <CasinoPageWrapper>
      <SiteHeader />

      <main className={`relative py-8 ${siteContainerClass}`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="casino-spotlight absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-3xl" />
          <div className="casino-spotlight absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-rose-600/15 blur-3xl" />
          <div className="casino-spotlight absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <p className="relative font-sans text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
          Press Dernocrat Daily · Risk Taking Lounge
        </p>
        <h2 className="relative mt-2 font-serif text-3xl font-bold text-amber-50 sm:text-5xl">
          Risk Taking
        </h2>
        <p className="relative mt-3 max-w-2xl font-sans text-base text-amber-100/75">
          Neon lights, velvet ropes, and decisions you can explain to your group chat.
          Pick a game — the house always has opinions.
        </p>

        <div className="relative mt-10 grid gap-6 sm:grid-cols-2">
          {riskGames.map((game) => (
            <RiskGameCard key={game.slug} game={game} />
          ))}
        </div>

        <p className="relative mt-12 max-w-xl font-sans text-xs leading-relaxed text-amber-200/50">
          Parody only. Outcomes are suggestions, not medical, legal, or homework advice.
          Play responsibly among friends who consented to chaos.
        </p>
      </main>
    </CasinoPageWrapper>
  );
}
