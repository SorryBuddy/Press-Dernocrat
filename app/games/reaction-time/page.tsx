import { GamePageShell } from "@/components/GamePageShell";
import { ReactionTimeTest } from "@/components/ReactionTimeTest";

export const metadata = {
  title: "Reaction Time Test | Press Dernocrat Daily",
  description: "Wait for green, then tap as fast as you can.",
};

export default function ReactionTimePage() {
  return (
    <GamePageShell
      title="Reaction Time Test"
      description="Wait for the green flash—then click. Your time is measured in milliseconds."
    >
      <ReactionTimeTest />
    </GamePageShell>
  );
}
