import Phaser from 'phaser';
import { TILES } from '../world/TileTypes';
import { TILE_SIZE } from '../config';
import { ExternalAssetLoader } from '../sprites/SpriteFactory';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.json('sprite_manifest', '/assets/sprites/manifest.json');
  }

  async create(): Promise<void> {
    this.generateTextures();
    await ExternalAssetLoader.tryLoad(this);
    this.scene.start('MenuScene');
  }

  private generateTextures(): void {
    for (const [id, def] of Object.entries(TILES)) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(def.color);
      g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

      if (def.accent) {
        g.fillStyle(def.accent);
        if (id === 'tree') {
          g.fillRect(4, 8, 8, 8);
          g.fillStyle(def.color);
          g.fillRect(2, 0, 12, 10);
        } else if (id === 'grass') {
          g.fillRect(2, 2, 2, 2);
          g.fillRect(10, 6, 2, 2);
          g.fillRect(6, 11, 2, 2);
        } else if (id === 'water') {
          g.fillRect(3, 5, 10, 2);
          g.fillRect(1, 11, 8, 2);
        } else if (id === 'rock' || id === 'copper' || id === 'iron') {
          g.fillRect(3, 3, 10, 10);
        } else if (id === 'wall') {
          g.fillRect(0, 0, TILE_SIZE, 3);
          g.fillRect(0, 8, TILE_SIZE, 3);
        }
      }

      g.generateTexture(`tile_${id}`, TILE_SIZE, TILE_SIZE);
      g.destroy();
    }

    const fx = this.make.graphics({ x: 0, y: 0 });
    fx.fillStyle(0xffffff, 0.8);
    fx.fillCircle(8, 8, 8);
    fx.generateTexture('attack_fx', 16, 16);
    fx.destroy();

    const p = this.make.graphics({ x: 0, y: 0 });
    p.fillStyle(0xffff00);
    p.fillRect(0, 0, 4, 4);
    p.generateTexture('particle', 4, 4);
    p.destroy();
  }
}
