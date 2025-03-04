import {
  GRID_ROWS,
  GRID_COLS,
  BIAS_PERCENTAGE,
} from "../constants/grid.constants";

/**
 * Generates a random lowercase letter
 */
export const randomLetter = (): string =>
  String.fromCharCode(97 + Math.floor(Math.random() * 26));

/**
 * Counts occurrences of a character in a grid
 */
export const countOccurrences = (grid: string[][], char: string): number =>
  grid.reduce(
    (count, row) => count + row.filter((cell) => cell === char).length,
    0
  );

/**
 * Reduces a number to a single digit
 */
export const reduceToSingleDigit = (value: number): number => {
  while (value > 9) value = Math.floor(value / 2);
  return value;
};

/**
 * Generates a grid with optional bias towards a specific character
 */
export const generateGrid = (bias?: string): string[][] => {
  if (bias && !/^[a-z]$/i.test(bias)) {
    throw new Error("Bias must be a single letter.");
  }
  const totalCells = GRID_ROWS * GRID_COLS;
  const biasedCells = bias ? Math.floor(totalCells * BIAS_PERCENTAGE) : 0;
  const grid = Array.from({ length: GRID_ROWS }, () =>
    Array(GRID_COLS).fill(null).map(randomLetter)
  );

  if (bias && biasedCells > 0) {
    const lowerBias = bias.toLowerCase();
    for (let i = 0; i < biasedCells; i++) {
      const row = Math.floor(Math.random() * GRID_ROWS);
      const col = Math.floor(Math.random() * GRID_COLS);
      grid[row][col] = lowerBias;
    }
  }
  return grid;
};

/**
 * Generates a code based on the grid
 */
export const generateCode = (grid: string[][]): number => {
  const seconds = new Date().getSeconds();
  const digit1 = Math.floor(seconds / 10);
  const digit2 = seconds % 10;

  const char1 = grid[digit1][digit2];
  const char2 = grid[digit2][digit1];

  const count1 = reduceToSingleDigit(countOccurrences(grid, char1));
  const count2 = reduceToSingleDigit(countOccurrences(grid, char2));

  return Number(`${count1}${count2}`);
};
