import Phaser from 'phaser';

/**
 * Hybrid loader: drop LPC/Mana Seed PNG sheets into public/assets/sprites/
 * and they will be used instead of procedural sprites when available.
 *
 * Expected layout:
 *   public/assets/sprites/characters/{archetypeId}.png  — 16x16 frame strip or sheet
 *   public/assets/sprites/manifest.json                   — optional mapping file
 */

export interface SpriteManifestEntry {
  archetypeId: string;
  path: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
}

export interface SpriteManifest {
  characters: SpriteManifestEntry[];
}

const MANIFEST_PATH = '/assets/sprites/manifest.json';

export class ExternalAssetLoader {
  private static loaded = false;
  private static manifest: SpriteManifest | null = null;
  private static available = new Set<string>();

  static async tryLoad(scene: Phaser.Scene): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;

    try {
      const res = await fetch(MANIFEST_PATH);
      if (!res.ok) return;
      this.manifest = (await res.json()) as SpriteManifest;

      for (const entry of this.manifest.characters) {
        await new Promise<void>((resolve) => {
          const key = `ext_${entry.archetypeId}`;
          if (scene.textures.exists(key)) {
            this.available.add(entry.archetypeId);
            resolve();
            return;
          }
          scene.load.spritesheet(key, entry.path, {
            frameWidth: entry.frameWidth,
            frameHeight: entry.frameHeight,
          });
          scene.load.once('complete', () => {
            this.available.add(entry.archetypeId);
            resolve();
          });
          scene.load.once('loaderror', () => resolve());
          scene.load.start();
        });
      }
    } catch {
      // No external assets — procedural fallback
    }
  }

  static hasExternal(archetypeId: string): boolean {
    return this.available.has(archetypeId);
  }

  static getTextureKey(archetypeId: string): string | null {
    return this.hasExternal(archetypeId) ? `ext_${archetypeId}` : null;
  }

  static registerAnimations(scene: Phaser.Scene, archetypeId: string, frameCount: number): void {
    const key = `ext_${archetypeId}`;
    if (!scene.textures.exists(key)) return;

    const animKey = `${key}_walk`;
    if (scene.anims.exists(animKey)) return;

    scene.anims.create({
      key: animKey,
      frames: scene.anims.generateFrameNumbers(key, { start: 0, end: frameCount - 1 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
