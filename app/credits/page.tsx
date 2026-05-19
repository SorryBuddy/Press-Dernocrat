import { CreditCard } from "@/components/CreditCard";
import { SiteHeader } from "@/components/SiteHeader";
import { creditTeam } from "@/lib/credits";
import { siteContainerClass } from "@/lib/site-layout";

export const metadata = {
  title: "Credits | Press Dernocrat Daily",
  description: "Meet the team behind Press Dernocrat Daily.",
};

export default function CreditsPage() {
  return (
    <div className="min-h-full bg-white text-neutral-900">
      <SiteHeader />

      <main className={`py-8 sm:py-12 ${siteContainerClass}`}>
        <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#c41230]">
          Masthead
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900 sm:text-4xl">
          Credits
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-neutral-600">
          Press Dernocrat Daily is brought to you by humans, one chatbot correspondent,
          and a steady diet of fake-but-funny news meant to make you laugh.
        </p>

        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {creditTeam.map((person) => (
            <CreditCard key={person.id} person={person} />
          ))}
        </div>

        <p className="mt-16 border-t border-neutral-200 pt-8 text-center font-sans text-xs text-neutral-500">
          No actual democrats or presses were harmed in the making of this
          publication.
        </p>
      </main>
    </div>
  );
}
