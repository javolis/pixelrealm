/** Palette slot IDs used in LPC-style template masks */
export const PAL = {
  TRANSPARENT: 0,
  OUTLINE: 1,
  SKIN: 2,
  SKIN_SHADOW: 3,
  HAIR: 4,
  SHIRT: 5,
  SHIRT_SHADOW: 6,
  PANTS: 7,
  PANTS_SHADOW: 8,
  ARMOR: 9,
  ARMOR_SHADOW: 10,
  ACCENT: 11,
  METAL: 12,
  METAL_SHADOW: 13,
  CAPE: 14,
  GLOW: 15,
  EYE: 16,
} as const;

export type PaletteSlot = (typeof PAL)[keyof typeof PAL];

export interface CharacterPalette {
  outline: number;
  skin: number;
  skinShadow: number;
  hair: number;
  shirt: number;
  shirtShadow: number;
  pants: number;
  pantsShadow: number;
  armor: number;
  armorShadow: number;
  accent: number;
  metal: number;
  metalShadow: number;
  cape: number;
  glow: number;
  eye: number;
}

export function paletteFromDNA(dna: {
  skin: number;
  hair: number;
  shirt: number;
  pants: number;
  accent: number;
  armor: number;
  metal: number;
  cape: number;
}): CharacterPalette {
  return {
    outline: 0x1a1a1a,
    skin: dna.skin,
    skinShadow: darken(dna.skin, 35),
    hair: dna.hair,
    shirt: dna.shirt,
    shirtShadow: darken(dna.shirt, 30),
    pants: dna.pants,
    pantsShadow: darken(dna.pants, 35),
    armor: dna.armor,
    armorShadow: darken(dna.armor, 40),
    accent: dna.accent,
    metal: dna.metal,
    metalShadow: darken(dna.metal, 45),
    cape: dna.cape,
    glow: lighten(dna.accent, 40),
    eye: 0x111111,
  };
}

function slotToColor(slot: PaletteSlot, palette: CharacterPalette): number | null {
  switch (slot) {
    case PAL.TRANSPARENT:
      return null;
    case PAL.OUTLINE:
      return palette.outline;
    case PAL.SKIN:
      return palette.skin;
    case PAL.SKIN_SHADOW:
      return palette.skinShadow;
    case PAL.HAIR:
      return palette.hair;
    case PAL.SHIRT:
      return palette.shirt;
    case PAL.SHIRT_SHADOW:
      return palette.shirtShadow;
    case PAL.PANTS:
      return palette.pants;
    case PAL.PANTS_SHADOW:
      return palette.pantsShadow;
    case PAL.ARMOR:
      return palette.armor;
    case PAL.ARMOR_SHADOW:
      return palette.armorShadow;
    case PAL.ACCENT:
      return palette.accent;
    case PAL.METAL:
      return palette.metal;
    case PAL.METAL_SHADOW:
      return palette.metalShadow;
    case PAL.CAPE:
      return palette.cape;
    case PAL.GLOW:
      return palette.glow;
    case PAL.EYE:
      return palette.eye;
    default:
      return null;
  }
}

export function applyPalette(
  mask: PaletteSlot[],
  width: number,
  height: number,
  palette: CharacterPalette
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < mask.length; i++) {
    const color = slotToColor(mask[i], palette);
    const idx = i * 4;
    if (color === null) {
      data[idx + 3] = 0;
    } else {
      data[idx] = (color >> 16) & 0xff;
      data[idx + 1] = (color >> 8) & 0xff;
      data[idx + 2] = color & 0xff;
      data[idx + 3] = 255;
    }
  }
  return data;
}

export function compositeLayers(
  layers: Uint8ClampedArray[],
  width: number,
  height: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height * 4);
  for (const layer of layers) {
    for (let i = 0; i < layer.length; i += 4) {
      if (layer[i + 3] > 0) {
        out[i] = layer[i];
        out[i + 1] = layer[i + 1];
        out[i + 2] = layer[i + 2];
        out[i + 3] = layer[i + 3];
      }
    }
  }
  return out;
}

export function darken(color: number, amount: number): number {
  const r = Math.max(0, ((color >> 16) & 0xff) - amount);
  const g = Math.max(0, ((color >> 8) & 0xff) - amount);
  const b = Math.max(0, (color & 0xff) - amount);
  return (r << 16) | (g << 8) | b;
}

export function lighten(color: number, amount: number): number {
  const r = Math.min(255, ((color >> 16) & 0xff) + amount);
  const g = Math.min(255, ((color >> 8) & 0xff) + amount);
  const b = Math.min(255, (color & 0xff) + amount);
  return (r << 16) | (g << 8) | b;
}
