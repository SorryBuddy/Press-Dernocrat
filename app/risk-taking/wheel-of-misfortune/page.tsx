import { RiskTakingPageShell } from "@/components/RiskTakingPageShell";
import { WheelOfMisfortune } from "@/components/WheelOfMisfortune";

export const metadata = {
  title: "Wheel of Misfortune | Risk Taking | Press Dernocrat Daily",
  description: "Spin the wheel. Accept your fate. Blame the house.",
};

export default function WheelPage() {
  return (
    <RiskTakingPageShell
      title="Wheel of Misfortune"
      description="Weighted toward punishments. Rewards are real but rare — like parking in Sebastopol."
    >
      <WheelOfMisfortune />
    </RiskTakingPageShell>
  );
}
