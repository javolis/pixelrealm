export type TileType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'water'
  | 'sand'
  | 'tree'
  | 'rock'
  | 'copper'
  | 'iron'
  | 'path'
  | 'wall';

export interface TileDef {
  id: TileType;
  name: string;
  color: number;
  accent?: number;
  walkable: boolean;
  mineable: boolean;
  skill?: 'mining' | 'woodcutting';
  xp?: number;
  drop?: string;
}

export const TILES: Record<TileType, TileDef> = {
  grass: { id: 'grass', name: 'Grass', color: 0x3d8b37, accent: 0x2d6b27, walkable: true, mineable: false },
  dirt: { id: 'dirt', name: 'Dirt', color: 0x8b6914, accent: 0x6b4914, walkable: true, mineable: false },
  stone: { id: 'stone', name: 'Stone', color: 0x666666, accent: 0x444444, walkable: true, mineable: false },
  water: { id: 'water', name: 'Water', color: 0x2266aa, accent: 0x114488, walkable: false, mineable: false },
  sand: { id: 'sand', name: 'Sand', color: 0xc2b280, accent: 0xa29260, walkable: true, mineable: false },
  tree: { id: 'tree', name: 'Oak Tree', color: 0x2d5016, accent: 0x5c4033, walkable: false, mineable: true, skill: 'woodcutting', xp: 25, drop: 'logs' },
  rock: { id: 'rock', name: 'Rock', color: 0x555555, accent: 0x333333, walkable: false, mineable: true, skill: 'mining', xp: 17, drop: 'stone' },
  copper: { id: 'copper', name: 'Copper Ore', color: 0xb87333, accent: 0x555555, walkable: false, mineable: true, skill: 'mining', xp: 35, drop: 'copper_ore' },
  iron: { id: 'iron', name: 'Iron Ore', color: 0xaaaaaa, accent: 0x555555, walkable: false, mineable: true, skill: 'mining', xp: 55, drop: 'iron_ore' },
  path: { id: 'path', name: 'Path', color: 0x9b7653, accent: 0x7b5633, walkable: true, mineable: false },
  wall: { id: 'wall', name: 'Wall', color: 0x4a3728, accent: 0x2a1708, walkable: false, mineable: false },
};

export const TILE_COLORS: Record<TileType, number> = Object.fromEntries(
  Object.entries(TILES).map(([k, v]) => [k, v.color])
) as Record<TileType, number>;
