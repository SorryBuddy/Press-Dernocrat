/** 81-char strings: 0 = empty cell */
export const sudokuPuzzles = [
  {
    id: "easy-1",
    label: "Easy",
    puzzle:
      "530070000600195000098000060000680000000419000000005280000000094000261750710000000",
    solution:
      "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  },
  {
    id: "medium-1",
    label: "Medium",
    puzzle:
      "000260701680070090190004500500100607009080300600700005004000019040050036702510000",
    solution:
      "435269781682571493197834562524196837369485271876713925251947368948352617713628459",
  },
];

export type Grid = number[][];

export function parsePuzzleString(str: string): Grid {
  const nums = str.split("").map((c) => parseInt(c, 10) || 0);
  return Array.from({ length: 9 }, (_, r) => nums.slice(r * 9, r * 9 + 9));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

export function gridsEqual(a: Grid, b: Grid): boolean {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}
