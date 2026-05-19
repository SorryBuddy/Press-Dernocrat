import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function GamePageShell({ title, description, children }: Props) {
  return (
    <div className="min-h-full bg-white text-neutral-900">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/games"
          className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-neutral-600 hover:text-[#c41230]"
        >
          <span aria-hidden>←</span> All Games
        </Link>

        <p className="mt-6 font-sans text-xs font-bold uppercase tracking-wide text-[#c41230]">
          Press Dernocrat Daily Arcade
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 font-sans text-base text-neutral-600">{description}</p>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
