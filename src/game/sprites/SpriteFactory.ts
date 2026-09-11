import Phaser from 'phaser';
import { CharacterRegistry } from './CharacterRegistry';
import { createWalkFrames, WALK_FRAMES } from './CharacterGenerator';
import { ExternalAssetLoader } from './ExternalAssetLoader';

export function registerCharacterTextures(
  scene: Phaser.Scene,
  seed: string,
  archetypeId: string
): string {
  const textureKey = `char_${archetypeId}_${seed.replace(/[^a-zA-Z0-9]/g, '_')}`;

  if (scene.textures.exists(`${textureKey}_0`)) {
    return textureKey;
  }

  const dna = CharacterRegistry.getInstance().getOrCreate(seed, archetypeId);
  const frames = createWalkFrames(dna, archetypeId);

  for (let i = 0; i < WALK_FRAMES; i++) {
    scene.textures.addCanvas(`${textureKey}_${i}`, frames[i]);
  }

  const animKey = `${textureKey}_walk`;
  if (!scene.anims.exists(animKey)) {
    scene.anims.create({
      key: animKey,
      frames: Array.from({ length: WALK_FRAMES }, (_, i) => ({
        key: `${textureKey}_${i}`,
        frame: 0,
      })),
      frameRate: 10,
      repeat: -1,
    });
  }

  return textureKey;
}

export function createCharacterSprite(
  scene: Phaser.Scene,
  x: number,
  y: number,
  seed: string,
  archetypeId: string
): Phaser.GameObjects.Sprite {
  // Hybrid: use external LPC sheet if available for this archetype
  const extKey = ExternalAssetLoader.getTextureKey(archetypeId);
  if (extKey && scene.textures.exists(extKey)) {
    ExternalAssetLoader.registerAnimations(scene, archetypeId, WALK_FRAMES);
    const sprite = scene.add.sprite(x, y, extKey, 0);
    sprite.setOrigin(0.5, 0.75);
    return sprite;
  }

  const textureKey = registerCharacterTextures(scene, seed, archetypeId);
  const sprite = scene.add.sprite(x, y, `${textureKey}_0`);
  sprite.setOrigin(0.5, 0.75);
  return sprite;
}

export function updateWalkAnimation(
  sprite: Phaser.GameObjects.Sprite,
  vx: number,
  vy: number,
  textureKey: string
): void {
  const moving = Math.abs(vx) > 1 || Math.abs(vy) > 1;
  const animKey = `${textureKey}_walk`;
  const extAnimKey = textureKey.startsWith('ext_') ? `${textureKey}_walk` : null;

  if (moving) {
    const key = extAnimKey && sprite.scene.anims.exists(extAnimKey) ? extAnimKey : animKey;
    if (sprite.scene.anims.exists(key)) {
      if (!sprite.anims.isPlaying || sprite.anims.currentAnim?.key !== key) {
        sprite.play(key);
      }
    }
    if (vx < 0) sprite.setFlipX(true);
    else if (vx > 0) sprite.setFlipX(false);
  } else {
    sprite.stop();
    if (textureKey.startsWith('ext_')) {
      sprite.setFrame(0);
    } else {
      sprite.setTexture(`${textureKey}_0`);
    }
  }
}

export { ExternalAssetLoader };
