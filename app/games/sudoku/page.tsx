import { GamePageShell } from "@/components/GamePageShell";
import { Sudoku } from "@/components/Sudoku";

export const metadata = {
  title: "Sudoku | Press Dernocrat Daily",
  description: "Solve an easy or medium sudoku puzzle.",
};

export default function SudokuPage() {
  return (
    <GamePageShell
      title="Sudoku"
      description="Fill every row, column, and 3×3 box with digits 1–9."
    >
      <Sudoku />
    </GamePageShell>
  );
}
