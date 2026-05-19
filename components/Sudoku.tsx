"use client";

import { useMemo, useState } from "react";
import {
  cloneGrid,
  gridsEqual,
  parsePuzzleString,
  sudokuPuzzles,
  type Grid,
} from "@/lib/sudoku-puzzles";

type CellPos = { row: number; col: number } | null;

function boxIndex(row: number, col: number) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function hasConflict(grid: Grid, row: number, col: number, value: number): boolean {
  if (value === 0) return false;
  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === value) return true;
    if (i !== row && grid[i][col] === value) return true;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if ((r !== row || c !== col) && grid[r][c] === value) return true;
    }
  }
  return false;
}

function gridHasAnyConflict(grid: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c];
      if (v && hasConflict(grid, r, c, v)) return true;
    }
  }
  return false;
}

export function Sudoku() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzleDef = sudokuPuzzles[puzzleIndex];

  const initial = useMemo(
    () => parsePuzzleString(puzzleDef.puzzle),
    [puzzleDef.puzzle],
  );
  const solution = useMemo(
    () => parsePuzzleString(puzzleDef.solution),
    [puzzleDef.solution],
  );

  const [grid, setGrid] = useState<Grid>(() => cloneGrid(initial));
  const [selected, setSelected] = useState<CellPos>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fixed = useMemo(() => {
    return initial.map((row) => row.map((v) => v !== 0));
  }, [initial]);

  function loadPuzzle(index: number) {
    const def = sudokuPuzzles[index];
    const nextInitial = parsePuzzleString(def.puzzle);
    setPuzzleIndex(index);
    setGrid(cloneGrid(nextInitial));
    setSelected(null);
    setMessage(null);
  }

  function resetPuzzle() {
    setGrid(cloneGrid(initial));
    setSelected(null);
    setMessage(null);
  }

  function selectCell(row: number, col: number) {
    if (fixed[row][col]) return;
    setSelected({ row, col });
    setMessage(null);
  }

  function placeNumber(num: number) {
    if (!selected) return;
    const { row, col } = selected;
    if (fixed[row][col]) return;

    const next = cloneGrid(grid);
    next[row][col] = num;
    setGrid(next);
    setMessage(null);
  }

  function clearCell() {
    if (!selected) return;
    const { row, col } = selected;
    if (fixed[row][col]) return;
    const next = cloneGrid(grid);
    next[row][col] = 0;
    setGrid(next);
  }

  function checkSolution() {
    if (gridHasAnyConflict(grid)) {
      setMessage("Something conflicts — check the highlighted cells.");
      return;
    }
    const filled = grid.every((row) => row.every((v) => v !== 0));
    if (!filled) {
      setMessage("Keep going — not every cell is filled yet.");
      return;
    }
    if (gridsEqual(grid, solution)) {
      setMessage("Solved! You cracked it.");
    } else {
      setMessage("Filled in, but not quite right. Keep trying.");
    }
  }

  const completed = gridsEqual(grid, solution);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {sudokuPuzzles.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPuzzle(i)}
              className={`rounded-full border px-3 py-1 font-sans text-sm font-semibold ${
                puzzleIndex === i
                  ? "border-[#c41230] bg-[#c41230] text-white"
                  : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetPuzzle}
            className="rounded border border-neutral-300 px-3 py-1.5 font-sans text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={checkSolution}
            className="rounded bg-[#c41230] px-3 py-1.5 font-sans text-sm font-semibold text-white hover:bg-[#a30f28]"
          >
            Check
          </button>
        </div>
      </div>

      <p
        className={`mt-4 min-h-[1.25rem] font-sans text-sm ${
          completed ? "font-semibold text-green-700" : "text-neutral-600"
        }`}
      >
        {message ?? (completed ? "Puzzle complete!" : "Tap a cell, then pick a number.")}
      </p>

      <div className="mx-auto mt-4 w-fit max-w-full overflow-x-auto">
        <div className="inline-grid grid-cols-9 border-2 border-neutral-900">
          {grid.map((row, r) =>
            row.map((value, c) => {
              const isFixed = fixed[r][c];
              const isSelected = selected?.row === r && selected?.col === c;
              const conflict = value !== 0 && hasConflict(grid, r, c, value);
              const thickRight = c === 2 || c === 5;
              const thickBottom = r === 2 || r === 5;
              const highlightBox =
                selected &&
                boxIndex(selected.row, selected.col) === boxIndex(r, c);

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => selectCell(r, c)}
                  className={[
                    "flex h-9 w-9 items-center justify-center border border-neutral-300 font-sans text-lg sm:h-10 sm:w-10",
                    thickRight ? "border-r-2 border-r-neutral-900" : "",
                    thickBottom ? "border-b-2 border-b-neutral-900" : "",
                    isFixed ? "bg-neutral-100 font-bold text-neutral-900" : "bg-white",
                    isSelected ? "bg-[#c41230]/15 ring-2 ring-inset ring-[#c41230]" : "",
                    !isSelected && highlightBox ? "bg-neutral-50" : "",
                    conflict ? "text-[#c41230]" : "text-neutral-800",
                  ].join(" ")}
                >
                  {value || ""}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-xs grid-cols-5 gap-2 sm:max-w-sm">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => placeNumber(n)}
            disabled={!selected || completed}
            className="flex h-11 items-center justify-center rounded border border-neutral-300 bg-neutral-50 font-sans text-lg font-semibold hover:bg-neutral-100 disabled:opacity-40"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={clearCell}
          disabled={!selected || completed}
          className="col-span-5 h-11 rounded border border-neutral-300 font-sans text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
        >
          Clear cell
        </button>
      </div>
    </div>
  );
}
