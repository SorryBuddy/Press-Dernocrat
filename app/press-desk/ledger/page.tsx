import { AdminLedger } from "@/components/AdminLedger";
import { SiteHeader } from "@/components/SiteHeader";
import { siteContainerClass } from "@/lib/site-layout";

export const metadata = {
  title: "Desk Ledger | Press Dernocrat Daily",
  robots: { index: false, follow: false },
};

export default function AdminLedgerPage() {
  return (
    <div className="min-h-full bg-white text-neutral-900">
      <SiteHeader />

      <main className={`py-8 sm:py-12 ${siteContainerClass}`}>
        <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#c41230]">
          Internal
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-neutral-900">Desk Ledger</h2>
        <p className="mt-3 max-w-xl font-sans text-sm text-neutral-600">
          Coin adjustments for registered and guest accounts.
        </p>

        <div className="mt-10 max-w-lg">
          <AdminLedger />
        </div>
      </main>
    </div>
  );
}
