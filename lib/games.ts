export type GameInfo = {
  slug: string;
  href: string;
  title: string;
  description: string;
  tag: string;
};

export const games: GameInfo[] = [
  {
    slug: "tic-tac-toe",
    href: "/games/tic-tac-toe",
    title: "Tic-Tac-Toe",
    description: "Battle the robot or pass the phone for local two-player.",
    tag: "Classic",
  },
  {
    slug: "coin-flip",
    href: "/games/coin-flip",
    title: "Coin Flip",
    description: "Flip a coin with a satisfying spin and a clear result.",
    tag: "Chance",
  },
  {
    slug: "sudoku",
    href: "/games/sudoku",
    title: "Sudoku",
    description: "Fill the grid — one number per row, column, and box.",
    tag: "Puzzle",
  },
  {
    slug: "reaction-time",
    href: "/games/reaction-time",
    title: "Reaction Time Test",
    description: "Wait for green, then tap — see how fast your reflexes are.",
    tag: "Reflex",
  },
];
