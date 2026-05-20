import { Plinko } from "@/components/Plinko";
import { RiskTakingPageShell } from "@/components/RiskTakingPageShell";

export const metadata = {
  title: "Plinko | Press Dernocrat Daily",
  description: "Drop the chip and chase the payout slots.",
};

export default function PlinkoPage() {
  return (
    <RiskTakingPageShell
      title="Plinko"
      description="Eight rows of pegs, one glowing chip, and slots that rewrite your balance."
    >
      <Plinko />
    </RiskTakingPageShell>
  );
}
