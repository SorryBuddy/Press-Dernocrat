"use client";

import { useEffect, useRef, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];
type Mode = "robot" | "local";

const ROBOT_DELAY_MS = { min: 350, max: 650 };

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board: Board): Player | "draw" | null {
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

function robotMove(board: Board): number {
  const empty = board
    .map((cell, i) => (cell ? -1 : i))
    .filter((i) => i >= 0) as number[];

  const tryMove = (player: Player) => {
    for (const i of empty) {
      const next = [...board];
      next[i] = player;
      if (getWinner(next) === player) return i;
    }
    return -1;
  };

  const win = tryMove("O");
  if (win >= 0) return win;

  const block = tryMove("X");
  if (block >= 0) return block;

  if (board[4] === null) return 4;

  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return empty[Math.floor(Math.random() * empty.length)];
}

function randomRobotDelay() {
  return (
    ROBOT_DELAY_MS.min +
    Math.random() * (ROBOT_DELAY_MS.max - ROBOT_DELAY_MS.min)
  );
}

export function TicTacToe() {
  const [mode, setMode] = useState<Mode>("robot");
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [thinking, setThinking] = useState(false);
  const robotTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const winner = getWinner(board);
  const activePlayer = mode === "local" ? currentPlayer : "X";

  useEffect(() => {
    return () => {
      if (robotTimeoutRef.current) clearTimeout(robotTimeoutRef.current);
    };
  }, []);

  function clearRobotTimeout() {
    if (robotTimeoutRef.current) {
      clearTimeout(robotTimeoutRef.current);
      robotTimeoutRef.current = null;
    }
  }

  function resetGame() {
    clearRobotTimeout();
    setThinking(false);
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetGame();
  }

  const status = (() => {
    if (thinking) return "Robot is thinking…";
    if (winner === "draw") return "Draw — nobody wins, everybody snacks.";
    if (winner === "X") {
      return mode === "local" ? "Player X wins!" : "You win! The robot demands a rematch.";
    }
    if (winner === "O") {
      return mode === "local" ? "Player O wins!" : "Robot wins. It did not gloat (much).";
    }
    if (mode === "local") return `Player ${currentPlayer}'s turn`;
    return "Your turn — you are X.";
  })();

  function handleClick(index: number) {
    if (board[index] || winner || thinking) return;

    if (mode === "local") {
      const next = [...board];
      next[index] = currentPlayer;
      setBoard(next);
      if (!getWinner(next)) {
        setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
      }
      return;
    }

    const next = [...board];
    next[index] = "X";
    const afterPlayer = getWinner(next);
    if (afterPlayer) {
      setBoard(next);
      return;
    }

    setBoard(next);
    setThinking(true);

    robotTimeoutRef.current = setTimeout(() => {
      const robotIndex = robotMove(next);
      const afterRobot = [...next];
      afterRobot[robotIndex] = "O";
      setBoard(afterRobot);
      setThinking(false);
      robotTimeoutRef.current = null;
    }, randomRobotDelay());
  }

  const disabled = Boolean(winner) || thinking;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <ModeButton
          active={mode === "robot"}
          onClick={() => switchMode("robot")}
          label="Vs. Robot"
        />
        <ModeButton
          active={mode === "local"}
          onClick={() => switchMode("local")}
          label="Local 2-Player"
        />
      </div>

      <p
        className={`mt-4 font-sans text-sm text-neutral-600 ${thinking ? "animate-pulse" : ""}`}
      >
        {status}
      </p>

      <div className="mx-auto mt-6 grid w-full max-w-[280px] grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            disabled={disabled || Boolean(cell)}
            onClick={() => handleClick(i)}
            className="flex aspect-square items-center justify-center border border-neutral-300 bg-neutral-50 font-sans text-3xl font-bold hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label={`Cell ${i + 1}, ${cell ?? "empty"}`}
          >
            <span
              className={`transition-opacity duration-150 ${
                thinking && !cell ? "opacity-40" : ""
              } ${cell === "X" ? "text-[#c41230]" : cell === "O" ? "text-neutral-800" : ""}`}
            >
              {cell}
            </span>
          </button>
        ))}
      </div>

      {mode === "local" && !winner && (
        <p className="mt-4 text-center font-sans text-xs text-neutral-500">
          Playing as{" "}
          <span className={activePlayer === "X" ? "font-bold text-[#c41230]" : ""}>
            X
          </span>{" "}
          and{" "}
          <span className={activePlayer === "O" ? "font-bold text-neutral-900" : ""}>
            O
          </span>{" "}
          — pass the device each turn.
        </p>
      )}

      <button
        type="button"
        onClick={resetGame}
        className="mt-6 bg-[#c41230] px-5 py-2 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a30f28]"
      >
        New Game
      </button>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-colors ${
        active
          ? "border-[#c41230] bg-[#c41230] text-white"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
      }`}
    >
      {label}
    </button>
  );
}
