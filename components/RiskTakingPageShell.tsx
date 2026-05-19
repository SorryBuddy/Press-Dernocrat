import { CasinoPageWrapper } from "@/components/CasinoPageWrapper";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { siteContainerClass } from "@/lib/site-layout";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function RiskTakingPageShell({ title, description, children }: Props) {
  return (
    <CasinoPageWrapper>
      <SiteHeader />

      <main className={`relative mx-auto max-w-3xl py-8 ${siteContainerClass}`}>
        <Link
          href="/risk-taking"
          className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-amber-200/80 hover:text-amber-300"
        >
          <span aria-hidden>←</span> Risk Taking Lounge
        </Link>

        <p className="mt-6 font-sans text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
          Press Dernocrat Daily · High Stakes Desk
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-amber-50 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 font-sans text-base text-amber-100/70">{description}</p>

        <div className="mt-8">{children}</div>
      </main>
    </CasinoPageWrapper>
  );
}
