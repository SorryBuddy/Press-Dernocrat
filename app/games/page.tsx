import { GameCard } from "@/components/GameCard";
import { SiteHeader } from "@/components/SiteHeader";
import { games } from "@/lib/games";
import { siteContainerClass } from "@/lib/site-layout";

export const metadata = {
  title: "Games | Press Dernocrat Daily",
  description: "Play tic-tac-toe, flip a coin, and solve sudoku on Press Dernocrat Daily.",
};

export default function GamesPage() {
  return (
    <div className="min-h-full bg-white text-neutral-900">
      <SiteHeader />

      <main className={`py-8 ${siteContainerClass}`}>
        <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#c41230]">
          Press Dernocrat Daily Arcade
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 sm:text-4xl">
          Games
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-base text-neutral-600">
          Pick a game below. Each opens its own page — perfect for a quick break
          between headlines.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </main>
    </div>
  );
}
