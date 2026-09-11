import { PAL, PaletteSlot } from '../PaletteSwap';
import { BodyType, HairStyle, HelmetType, WeaponType } from '../CharacterDNA';

export const SPRITE_W = 16;
export const SPRITE_H = 16;
export const WALK_FRAMES = 6;

type Mask = PaletteSlot[];

function grid(): Mask {
  return new Array(SPRITE_W * SPRITE_H).fill(PAL.TRANSPARENT);
}

function idx(x: number, y: number): number {
  return y * SPRITE_W + x;
}

function rect(m: Mask, x: number, y: number, w: number, h: number, slot: PaletteSlot): void {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      if (px >= 0 && px < SPRITE_W && py >= 0 && py < SPRITE_H) m[idx(px, py)] = slot;
    }
  }
}

function bodyW(type: BodyType): number {
  if (type === 'slim') return 6;
  if (type === 'stocky') return 8;
  return 7;
}

/** Walk pose: -1 left leg forward, 0 neutral, 1 right leg forward */
export interface WalkPose {
  frame: number;
  legOffset: number;
  bodyBob: number;
  armSwing: number;
}

export function getWalkPose(frame: number): WalkPose {
  const poses: WalkPose[] = [
    { frame: 0, legOffset: 0, bodyBob: 0, armSwing: 0 },
    { frame: 1, legOffset: -1, bodyBob: -1, armSwing: 1 },
    { frame: 2, legOffset: 0, bodyBob: 0, armSwing: 0 },
    { frame: 3, legOffset: 1, bodyBob: -1, armSwing: -1 },
    { frame: 4, legOffset: 0, bodyBob: 0, armSwing: 0 },
    { frame: 5, legOffset: -1, bodyBob: 0, armSwing: 1 },
  ];
  return poses[frame % WALK_FRAMES];
}

export function shadowLayer(): Mask {
  const m = grid();
  rect(m, 4, 14, 8, 1, PAL.OUTLINE);
  return m;
}

export function legsLayer(bodyType: BodyType, pose: WalkPose): Mask {
  const m = grid();
  const bw = bodyW(bodyType);
  const bx = Math.floor((SPRITE_W - bw) / 2);
  const lo = pose.legOffset;

  // Left leg
  rect(m, bx + 1 + (lo < 0 ? -1 : 0), 11 + pose.bodyBob, 2, 3, PAL.PANTS);
  rect(m, bx + 1 + (lo < 0 ? -1 : 0), 13 + pose.bodyBob, 2, 1, PAL.PANTS_SHADOW);
  // Right leg
  rect(m, bx + bw - 3 + (lo > 0 ? 1 : 0), 11 + pose.bodyBob, 2, 3, PAL.PANTS);
  rect(m, bx + bw - 3 + (lo > 0 ? 1 : 0), 13 + pose.bodyBob, 2, 1, PAL.PANTS_SHADOW);
  // Boots
  setBoots(m, bx, bw, lo, pose.bodyBob);
  return m;
}

function setBoots(m: Mask, bx: number, bw: number, lo: number, bob: number): void {
  rect(m, bx + 1 + (lo < 0 ? -1 : 0), 14 + bob, 2, 1, PAL.OUTLINE);
  rect(m, bx + bw - 3 + (lo > 0 ? 1 : 0), 14 + bob, 2, 1, PAL.OUTLINE);
}

export function bodyLayer(bodyType: BodyType, race: string, pose: WalkPose): Mask {
  const m = grid();
  const bw = bodyW(bodyType);
  const bx = Math.floor((SPRITE_W - bw) / 2);
  const bob = pose.bodyBob;

  // Neck
  rect(m, 7, 6 + bob, 2, 1, PAL.SKIN);
  // Arms
  const armY = 8 + bob + pose.armSwing;
  rect(m, bx - 1, armY, 1, 3, PAL.SKIN);
  rect(m, bx + bw, armY, 1, 3, PAL.SKIN);

  if (race === 'goblin') {
    // Pointy ears
    m[idx(4, 3 + bob)] = PAL.SKIN;
    m[idx(11, 3 + bob)] = PAL.SKIN;
  } else if (race === 'elf') {
    m[idx(4, 2 + bob)] = PAL.SKIN;
    m[idx(4, 3 + bob)] = PAL.SKIN;
    m[idx(11, 2 + bob)] = PAL.SKIN;
    m[idx(11, 3 + bob)] = PAL.SKIN;
  } else if (race === 'dwarf') {
    // Shorter, wider head drawn in head layer
  } else if (race === 'undead') {
    // Bone hands tint handled via palette
  }

  return m;
}

export function torsoLayer(bodyType: BodyType, pose: WalkPose, hasArmor: boolean): Mask {
  const m = grid();
  const bw = bodyW(bodyType);
  const bx = Math.floor((SPRITE_W - bw) / 2);
  const bob = pose.bodyBob;

  if (!hasArmor) {
    rect(m, bx, 7 + bob, bw, 4, PAL.SHIRT);
    rect(m, bx, 7 + bob, bw, 1, PAL.SHIRT_SHADOW);
  }
  return m;
}

export function armorLayer(bodyType: BodyType, pose: WalkPose, tier: string): Mask {
  const m = grid();
  if (tier === 'none' || tier === 'cloth') return m;

  const bw = bodyW(bodyType);
  const bx = Math.floor((SPRITE_W - bw) / 2);
  const bob = pose.bodyBob;

  if (tier === 'leather') {
    rect(m, bx, 7 + bob, bw, 4, PAL.ARMOR);
    rect(m, bx, 7 + bob, bw, 1, PAL.ARMOR_SHADOW);
    rect(m, bx, 10 + bob, bw, 1, PAL.ACCENT);
  } else if (tier === 'chain') {
    rect(m, bx - 1, 6 + bob, bw + 2, 5, PAL.ARMOR);
    // Chain texture dots
    m[idx(bx + 1, 8 + bob)] = PAL.ARMOR_SHADOW;
    m[idx(bx + 3, 9 + bob)] = PAL.ARMOR_SHADOW;
    m[idx(bx + 5, 8 + bob)] = PAL.ARMOR_SHADOW;
  } else if (tier === 'plate') {
    rect(m, bx - 1, 6 + bob, bw + 2, 5, PAL.ARMOR);
    rect(m, bx, 6 + bob, bw, 1, PAL.METAL);
    rect(m, bx, 7 + bob, bw, 3, PAL.ARMOR_SHADOW);
    rect(m, bx + 1, 9 + bob, bw - 2, 1, PAL.METAL_SHADOW);
    rect(m, bx, 10 + bob, bw, 1, PAL.ACCENT);
  }
  return m;
}

export function beltLayer(bodyType: BodyType, pose: WalkPose): Mask {
  const m = grid();
  const bw = bodyW(bodyType);
  const bx = Math.floor((SPRITE_W - bw) / 2);
  rect(m, bx, 10 + pose.bodyBob, bw, 1, PAL.ACCENT);
  m[idx(bx + Math.floor(bw / 2), 10 + pose.bodyBob)] = PAL.METAL;
  return m;
}

export function headLayer(_bodyType: BodyType, race: string, pose: WalkPose): Mask {
  const m = grid();
  const bob = pose.bodyBob;
  let hx = 5;
  let hy = 2 + bob;
  let hw = 6;
  let hh = 5;

  if (race === 'dwarf') {
    hx = 4;
    hw = 8;
    hh = 4;
    hy = 3 + bob;
  } else if (race === 'goblin') {
    hx = 5;
    hw = 6;
    hh = 4;
    hy = 3 + bob;
  }

  rect(m, hx, hy, hw, hh, race === 'undead' ? PAL.ARMOR : PAL.SKIN);
  rect(m, hx, hy, hw, 1, PAL.SKIN_SHADOW);

  // Eyes
  m[idx(hx + 1, hy + 2)] = race === 'undead' ? PAL.GLOW : PAL.EYE;
  m[idx(hx + hw - 2, hy + 2)] = race === 'undead' ? PAL.GLOW : PAL.EYE;

  if (race === 'undead') {
    m[idx(hx + 2, hy + 3)] = PAL.OUTLINE;
    m[idx(hx + 3, hy + 3)] = PAL.OUTLINE;
  } else if (race === 'goblin') {
    m[idx(hx + 2, hy + 3)] = PAL.EYE;
    m[idx(hx + 3, hy + 3)] = PAL.EYE;
  }

  return m;
}

export function hairLayer(hairStyle: HairStyle, pose: WalkPose, helmet: HelmetType): Mask {
  const m = grid();
  if (helmet !== 'none' && helmet !== 'hood') return m;
  const bob = pose.bodyBob;

  if (hairStyle === 'bald') return m;

  if (hairStyle === 'short') {
    rect(m, 5, 1 + bob, 6, 2, PAL.HAIR);
    m[idx(4, 3 + bob)] = PAL.HAIR;
    m[idx(11, 3 + bob)] = PAL.HAIR;
  } else if (hairStyle === 'long') {
    rect(m, 5, 1 + bob, 6, 2, PAL.HAIR);
    m[idx(4, 3 + bob)] = PAL.HAIR;
    m[idx(4, 4 + bob)] = PAL.HAIR;
    m[idx(4, 5 + bob)] = PAL.HAIR;
    m[idx(11, 3 + bob)] = PAL.HAIR;
    m[idx(11, 4 + bob)] = PAL.HAIR;
    m[idx(11, 5 + bob)] = PAL.HAIR;
  } else if (hairStyle === 'spiky') {
    m[idx(5, 0 + bob)] = PAL.HAIR;
    m[idx(7, 0 + bob)] = PAL.HAIR;
    m[idx(10, 0 + bob)] = PAL.HAIR;
    rect(m, 5, 1 + bob, 6, 2, PAL.HAIR);
  }
  return m;
}

export function helmetLayer(helmet: HelmetType, pose: WalkPose): Mask {
  const m = grid();
  const bob = pose.bodyBob;
  if (helmet === 'none') return m;

  if (helmet === 'hood') {
    rect(m, 4, 0 + bob, 8, 5, PAL.ARMOR);
    rect(m, 5, 0 + bob, 6, 1, PAL.ARMOR_SHADOW);
    m[idx(6, 4 + bob)] = PAL.SKIN;
    m[idx(9, 4 + bob)] = PAL.SKIN;
  } else if (helmet === 'helm') {
    rect(m, 4, 1 + bob, 8, 3, PAL.METAL);
    rect(m, 5, 0 + bob, 6, 2, PAL.METAL);
    rect(m, 5, 1 + bob, 6, 1, PAL.METAL_SHADOW);
    m[idx(6, 4 + bob)] = PAL.SKIN;
    m[idx(9, 4 + bob)] = PAL.SKIN;
  } else if (helmet === 'crown') {
    rect(m, 5, 0 + bob, 6, 1, PAL.METAL);
    m[idx(5, 0 + bob)] = PAL.ACCENT;
    m[idx(8, 0 + bob)] = PAL.ACCENT;
    m[idx(10, 0 + bob)] = PAL.ACCENT;
    rect(m, 5, 1 + bob, 6, 2, PAL.HAIR);
  } else if (helmet === 'mage_hat') {
    rect(m, 6, 0 + bob, 4, 2, PAL.ARMOR);
    m[idx(7, 0 + bob)] = PAL.ACCENT;
    m[idx(8, 0 + bob)] = PAL.ACCENT;
    rect(m, 5, 2 + bob, 6, 2, PAL.ARMOR_SHADOW);
  }
  return m;
}

export function capeBehindLayer(hasCape: boolean, pose: WalkPose): Mask {
  const m = grid();
  if (!hasCape) return m;
  const bob = pose.bodyBob;
  rect(m, 3, 6 + bob, 2, 7, PAL.CAPE);
  m[idx(3, 12 + bob)] = PAL.ARMOR_SHADOW;
  return m;
}

export function capeFrontLayer(hasCape: boolean, pose: WalkPose): Mask {
  const m = grid();
  if (!hasCape) return m;
  const bob = pose.bodyBob;
  rect(m, 11, 8 + bob, 2, 4, PAL.CAPE);
  m[idx(11, 8 + bob)] = PAL.ARMOR_SHADOW;
  return m;
}

export function weaponLayer(
  weapon: WeaponType,
  bodyType: BodyType,
  pose: WalkPose,
  flipSide: boolean
): Mask {
  const m = grid();
  const bw = bodyW(bodyType);
  const bx = Math.floor((SPRITE_W - bw) / 2);
  const bob = pose.bodyBob;
  const side = flipSide ? -1 : 1;
  const wx = side > 0 ? bx + bw : bx - 2;

  if (weapon === 'none') return m;

  if (weapon === 'sword') {
    rect(m, wx, 4 + bob, 1, 6, PAL.METAL);
    m[idx(wx, 3 + bob)] = PAL.ACCENT;
    m[idx(wx, 10 + bob)] = PAL.METAL_SHADOW;
  } else if (weapon === 'axe') {
    rect(m, wx, 5 + bob, 1, 5, PAL.METAL_SHADOW);
    rect(m, wx + side, 4 + bob, 2, 3, PAL.METAL);
    m[idx(wx + side, 3 + bob)] = PAL.METAL;
  } else if (weapon === 'staff') {
    rect(m, wx, 2 + bob, 1, 9, PAL.ARMOR_SHADOW);
    m[idx(wx, 1 + bob)] = PAL.GLOW;
    m[idx(wx + side, 2 + bob)] = PAL.GLOW;
    m[idx(wx - side, 3 + bob)] = PAL.ACCENT;
  } else if (weapon === 'bow') {
    m[idx(bx - 3, 7 + bob)] = PAL.ARMOR;
    m[idx(bx - 2, 6 + bob)] = PAL.ARMOR;
    m[idx(bx - 2, 7 + bob)] = PAL.ACCENT;
    m[idx(bx - 2, 8 + bob)] = PAL.ARMOR;
    m[idx(bx - 1, 7 + bob)] = PAL.ARMOR_SHADOW;
  } else if (weapon === 'dagger') {
    rect(m, wx, 7 + bob + pose.armSwing, 1, 3, PAL.METAL);
    m[idx(wx, 6 + bob + pose.armSwing)] = PAL.ACCENT;
  } else if (weapon === 'club') {
    rect(m, wx, 6 + bob, 2, 2, PAL.ARMOR_SHADOW);
    rect(m, wx, 4 + bob, 2, 3, PAL.ARMOR);
  }
  return m;
}

export function glowLayer(hasGlow: boolean, pose: WalkPose): Mask {
  const m = grid();
  if (!hasGlow) return m;
  const bob = pose.bodyBob;
  m[idx(2, 7 + bob)] = PAL.GLOW;
  m[idx(13, 7 + bob)] = PAL.GLOW;
  m[idx(7, 0 + bob)] = PAL.GLOW;
  m[idx(3, 9 + bob)] = PAL.ACCENT;
  m[idx(12, 9 + bob)] = PAL.ACCENT;
  return m;
}
