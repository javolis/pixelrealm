import { CharacterDNA } from './CharacterDNA';
import { composeAllWalkFrames, composeCharacterFrame, SPRITE_W, SPRITE_H, WALK_FRAMES } from './LayerCompositor';

export { SPRITE_W, SPRITE_H, WALK_FRAMES };

export function renderCharacterPixels(
  dna: CharacterDNA,
  archetypeId: string,
  frame = 0
): Uint8ClampedArray {
  return composeCharacterFrame(dna, archetypeId, frame);
}

export function createCharacterCanvas(
  dna: CharacterDNA,
  archetypeId: string,
  frame = 0
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_W;
  canvas.height = SPRITE_H;
  const ctx = canvas.getContext('2d')!;
  const pixels = renderCharacterPixels(dna, archetypeId, frame);
  ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels), SPRITE_W, SPRITE_H), 0, 0);
  return canvas;
}

export function createWalkFrames(
  dna: CharacterDNA,
  archetypeId: string
): HTMLCanvasElement[] {
  const frameData = composeAllWalkFrames(dna, archetypeId);
  return frameData.map((pixels) => {
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_W;
    canvas.height = SPRITE_H;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels), SPRITE_W, SPRITE_H), 0, 0);
    return canvas;
  });
}
