import { RiskTakingPageShell } from "@/components/RiskTakingPageShell";
import { SlotMachine } from "@/components/SlotMachine";

export const metadata = {
  title: "Slots | Risk Taking | Press Dernocrat Daily",
  description: "Spin the reels at the Press Dernocrat Daily casino lounge.",
};

export default function SlotsPage() {
  return (
    <RiskTakingPageShell
      title="Slots"
      description="Three reels. One lever. Infinite regret."
    >
      <SlotMachine />
    </RiskTakingPageShell>
  );
}
