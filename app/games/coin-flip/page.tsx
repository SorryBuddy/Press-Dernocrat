import { CoinFlip } from "@/components/CoinFlip";
import { GamePageShell } from "@/components/GamePageShell";

export const metadata = {
  title: "Coin Flip | Press Dernocrat Daily",
  description: "Flip a coin with a 3D animation.",
};

export default function CoinFlipPage() {
  return (
    <GamePageShell
      title="Coin Flip"
      description="Heads or tails — let the coin decide."
    >
      <CoinFlip />
    </GamePageShell>
  );
}
