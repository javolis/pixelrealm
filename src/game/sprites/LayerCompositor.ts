import { CharacterDNA } from './CharacterDNA';
import {
  SPRITE_W,
  SPRITE_H,
  WALK_FRAMES,
  getWalkPose,
  shadowLayer,
  legsLayer,
  bodyLayer,
  torsoLayer,
  armorLayer,
  beltLayer,
  headLayer,
  hairLayer,
  helmetLayer,
  capeBehindLayer,
  capeFrontLayer,
  weaponLayer,
  glowLayer,
} from './layers/LPCTemplates';
import { applyPalette, compositeLayers, paletteFromDNA } from './PaletteSwap';

/** LPC-inspired draw order (bottom → top) */
export function composeCharacterFrame(
  dna: CharacterDNA,
  archetypeId: string,
  frameIndex: number
): Uint8ClampedArray {
  const pose = getWalkPose(frameIndex);
  const hasArmor = dna.armorTier !== 'none' && dna.armorTier !== 'cloth';
  const hasGlow = dna.accessory === 'glow' || archetypeId === 'dark_mage' || archetypeId === 'mage';
  const race = dna.race;

  const palette = paletteFromDNA(dna);

  const layers = [
    capeBehindLayer(dna.hasCape, pose),
    shadowLayer(),
    legsLayer(dna.bodyType, pose),
    bodyLayer(dna.bodyType, race, pose),
    torsoLayer(dna.bodyType, pose, hasArmor),
    armorLayer(dna.bodyType, pose, dna.armorTier),
    beltLayer(dna.bodyType, pose),
    headLayer(dna.bodyType, race, pose),
    hairLayer(dna.hairStyle, pose, dna.helmet),
    helmetLayer(dna.helmet, pose),
    weaponLayer(dna.weapon, dna.bodyType, pose, frameIndex % 2 === 1),
    capeFrontLayer(dna.hasCape, pose),
    glowLayer(hasGlow, pose),
  ].map((mask) => applyPalette(mask, SPRITE_W, SPRITE_H, palette));

  return compositeLayers(layers, SPRITE_W, SPRITE_H);
}

export function composeAllWalkFrames(
  dna: CharacterDNA,
  archetypeId: string
): Uint8ClampedArray[] {
  return Array.from({ length: WALK_FRAMES }, (_, i) =>
    composeCharacterFrame(dna, archetypeId, i)
  );
}

export { SPRITE_W, SPRITE_H, WALK_FRAMES };
