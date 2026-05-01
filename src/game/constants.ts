export const BOARD_SIZE = 10;
export const TOTAL_CELLS = 100;

// from -> to
export const SNAKES: Record<number, number> = {
  98: 78,
  95: 56,
  93: 73,
  87: 24,
  64: 60,
  62: 19,
  56: 53,
  49: 11,
  47: 26,
  16: 6,
};

export const LADDERS: Record<number, number> = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91,
};

export const PLAYER_COLORS = [
  { name: "Crimson", bg: "hsl(0 85% 60%)", ring: "hsl(0 85% 75%)" },
  { name: "Azure", bg: "hsl(210 90% 58%)", ring: "hsl(210 90% 75%)" },
  { name: "Emerald", bg: "hsl(150 75% 45%)", ring: "hsl(150 75% 65%)" },
  { name: "Amber", bg: "hsl(40 95% 55%)", ring: "hsl(40 95% 70%)" },
  { name: "Violet", bg: "hsl(280 75% 62%)", ring: "hsl(280 75% 78%)" },
  { name: "Coral", bg: "hsl(15 90% 60%)", ring: "hsl(15 90% 75%)" },
];

export interface Player {
  id: string;
  name: string;
  position: number; // 0 = not on board yet, 1-100 on board
  color: typeof PLAYER_COLORS[number];
  rolls: number;
  laddersClimbed: number;
  snakesBitten: number;
}

/** Convert a 1..100 cell number to its row/col on the visual grid (row 0 = top). */
export function cellToCoord(cell: number): { row: number; col: number } {
  const idx = cell - 1; // 0..99
  const rowFromBottom = Math.floor(idx / BOARD_SIZE);
  const row = BOARD_SIZE - 1 - rowFromBottom;
  const isLTR = rowFromBottom % 2 === 0;
  const colInRow = idx % BOARD_SIZE;
  const col = isLTR ? colInRow : BOARD_SIZE - 1 - colInRow;
  return { row, col };
}
