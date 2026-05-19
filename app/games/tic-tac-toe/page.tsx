import { GamePageShell } from "@/components/GamePageShell";
import { TicTacToe } from "@/components/TicTacToe";

export const metadata = {
  title: "Tic-Tac-Toe | Press Dernocrat Daily",
  description: "Play tic-tac-toe against a robot or with a friend.",
};

export default function TicTacToePage() {
  return (
    <GamePageShell
      title="Tic-Tac-Toe"
      description="Challenge the robot or swap turns with a friend on the same device."
    >
      <TicTacToe />
    </GamePageShell>
  );
}
