export type TileType = 'T' | 'G' | 'W' | 'P' | 'B';

export const MAP_COLS = 32;
export const MAP_ROWS = 24;
export const PLAYER_START = { row: 23, col: 25 };

// Water tiles — used for biome/encounter detection only
const waterTiles = new Set([
  // Central lake
  '16,11','16,12','16,13','16,14','16,15','16,16','16,17','16,18',
  '17,11','17,12','17,13','17,14','17,15','17,16','17,17','17,18',
  '18,11','18,12','18,13','18,14','18,15','18,16','18,17','18,18',
  '19,11','19,12','19,13','19,14','19,15','19,16','19,17','19,18',
  '20,11','20,12','20,13','20,14','20,15','20,16','20,17','20,18',
  '21,11','21,12','21,13','21,14','21,15','21,16','21,17','21,18',
  '22,11','22,12','22,13','22,14','22,15','22,16','22,17','22,18',
  '23,11','23,12','23,13','23,14','23,15','23,16','23,17','23,18',

  // Upper-right pond
  '0,24','0,25','0,26',
  '1,25',
  '4,24','4,25',
  '5,24','5,25','5,26',
  '6,24','6,25','6,26',
  '7,24','7,25','7,26','7,27','7,28',
  '8,24','8,25','8,26','8,27','8,28','8,29','8,30','8,31',
  '9,29','9,30','9,31',
  '10,31',
  '11,31',
]);

// Explicit forest tiles — biome override regardless of adjacency
const forestTiles = new Set([
  '0,2','0,3','0,4','0,5','0,6','0,7',
  '1,2','1,3','1,4','1,5','1,6','1,7',
]);

// Blocked tiles — player cannot walk here
const blockedTiles = new Set([
  // Top-left house
  '2,2','2,3','2,4','2,5',
  '3,2','3,3','3,4','3,5',
  '4,2','4,3','4,4','4,5',
  '5,3','5,4','5,5',
  '6,3','6,4','6,5',
  '7,3','7,4','7,5',

  // Middle-right house
  '3,16','3,17','3,18','3,19',
  '4,16','4,17','4,18','4,19',
  '5,16','5,17','5,18','5,19',
  '6,16','6,17','6,18','6,19',
  '7,15','7,16','7,17','7,18',
  '8,15','8,16','8,17','8,18','8,19',
  '9,15','9,16','9,17','9,18',
  '10,16','10,17','10,18',

  // Bottom-left house
  '12,4','12,5','12,6','12,7',
  '13,4','13,5','13,6','13,7',
  '14,4','14,5','14,6','14,7',
  '15,4','15,5','15,6','15,7',
  '16,4','16,5','16,6','16,7',
  '17,4','17,5','17,6','17,7',
  '18,4','18,5','18,6',

  // Upper-right blocked area
  '9,26','9,27',
  '10,25','10,26','10,27','10,28','10,29',
  '11,25','11,26','11,27','11,28','11,29',

  // Right-side house
  '12,26','12,27','12,28','12,29',
  '13,25','13,26','13,27','13,28','13,29',
  '14,25','14,26','14,27','14,28','14,29',
  '15,26','15,27','15,28',
  '16,26','16,27','16,28',

  // Top structure
  '0,11','0,12','0,13',
  '1,11','1,12','1,13',

  // Gym trainer NPC
  '2,11','2,12',

  // Large building (rows 19-23)
  '19,6','19,7','19,8','19,9',
  '20,6','20,7','20,8','20,9',
  '21,6','21,7','21,8','21,9',
  '22,6','22,7','22,8','22,9',
  '23,6','23,7','23,8','23,9',
]);

// MAP_GRID is used only for biome detection (W = water, P = everything else)
export const MAP_GRID: TileType[][] = Array.from({ length: MAP_ROWS }, (_, row) =>
  Array.from({ length: MAP_COLS }, (_, col) =>
    waterTiles.has(`${row},${col}`) ? 'W' : 'P'
  )
);

export type Biome = 'grass' | 'forest' | 'water' | 'none';

export function getBiome(row: number, col: number): Biome {
  if (waterTiles.has(`${row},${col}`)) return 'water';
  // Near water → water biome
  const adj = [`${row-1},${col}`,`${row+1},${col}`,`${row},${col-1}`,`${row},${col+1}`];
  if (adj.some(k => waterTiles.has(k))) return 'water';
  // Top-left forest zone (rows 0–1, cols 2–7)
  if (row <= 1 && col >= 2 && col <= 7) return 'forest';
  // Top-right forest zone (rows 1–5 cols 27–31, row 6 cols 28–31)
  if (row >= 1 && row <= 5 && col >= 27 && col <= 31) return 'forest';
  if (row === 6 && col >= 28 && col <= 31) return 'forest';
  // Mid-left forest zone (rows 13–18, cols 8–9)
  if (row >= 13 && row <= 18 && col >= 8 && col <= 9) return 'forest';
  // Near a blocked tile → forest
  const adjBlocked = [
    [row-1,col],[row+1,col],[row,col-1],[row,col+1],
  ];
  if (adjBlocked.some(([r,c]) => blockedTiles.has(`${r},${c}`))) return 'forest';
  return 'grass';
}

export function isWalkable(row: number, col: number): boolean {
  if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return false;
  return !blockedTiles.has(`${row},${col}`);
}

export function isOnWater(row: number, col: number): boolean {
  return waterTiles.has(`${row},${col}`);
}
