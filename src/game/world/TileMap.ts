import { TileType, TILES } from '../world/TileTypes';
import { MAP_WIDTH, MAP_HEIGHT } from '../config';

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export class TileMap {
  readonly width = MAP_WIDTH;
  readonly height = MAP_HEIGHT;
  private tiles: TileType[][];

  constructor(seed = 42) {
    this.tiles = this.generate(seed);
  }

  private generate(seed: number): TileType[][] {
    const rand = seededRandom(seed);
    const map: TileType[][] = [];

    for (let y = 0; y < this.height; y++) {
      map[y] = [];
      for (let x = 0; x < this.width; x++) {
        const noise = rand();
        const distFromCenter = Math.hypot(x - this.width / 2, y - this.height / 2);

        if (distFromCenter > 28 && noise < 0.3) {
          map[y][x] = 'water';
        } else if (noise < 0.05) {
          map[y][x] = 'tree';
        } else if (noise < 0.08) {
          map[y][x] = 'rock';
        } else if (noise < 0.1) {
          map[y][x] = 'copper';
        } else if (noise < 0.11) {
          map[y][x] = 'iron';
        } else if (noise < 0.15) {
          map[y][x] = 'dirt';
        } else if (noise < 0.18) {
          map[y][x] = 'sand';
        } else {
          map[y][x] = 'grass';
        }
      }
    }

    // Village center
    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        if (Math.abs(dx) + Math.abs(dy) <= 5) {
          map[cy + dy][cx + dx] = 'path';
        }
      }
    }

    // Village walls
    for (let dy = -5; dy <= 5; dy++) {
      for (let dx = -5; dx <= 5; dx++) {
        if (Math.abs(dx) === 5 || Math.abs(dy) === 5) {
          if (Math.abs(dx) + Math.abs(dy) <= 6) {
            map[cy + dy][cx + dx] = 'wall';
          }
        }
      }
    }

    // Gate opening
    map[cy + 5][cx] = 'path';
    map[cy + 5][cx - 1] = 'path';
    map[cy + 5][cx + 1] = 'path';

    return map;
  }

  getTile(x: number, y: number): TileType {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return 'water';
    }
    return this.tiles[y][x];
  }

  setTile(x: number, y: number, type: TileType): void {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      this.tiles[y][x] = type;
    }
  }

  isWalkable(x: number, y: number): boolean {
    return TILES[this.getTile(x, y)].walkable;
  }

  isMineable(x: number, y: number): boolean {
    return TILES[this.getTile(x, y)].mineable;
  }

  getTileDef(x: number, y: number) {
    return TILES[this.getTile(x, y)];
  }

  getAllTiles(): TileType[][] {
    return this.tiles;
  }
}
