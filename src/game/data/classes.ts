export type CharacterClass = 'warrior' | 'mage' | 'archer';

export interface ClassDef {
  id: CharacterClass;
  name: string;
  description: string;
  color: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  startingHp: number;
  startingMana: number;
  attackType: 'melee' | 'magic' | 'ranged';
  attackDamage: number;
}

export const CLASSES: Record<CharacterClass, ClassDef> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    description: 'Heavy melee fighter. High STR and CON.',
    color: 0xcc3333,
    stats: { str: 16, dex: 10, con: 14, int: 8, wis: 10, cha: 10 },
    startingHp: 120,
    startingMana: 20,
    attackType: 'melee',
    attackDamage: 12,
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    description: 'Arcane spellcaster. High INT and WIS.',
    color: 0x3366cc,
    stats: { str: 8, dex: 10, con: 10, int: 16, wis: 14, cha: 12 },
    startingHp: 70,
    startingMana: 100,
    attackType: 'magic',
    attackDamage: 18,
  },
  archer: {
    id: 'archer',
    name: 'Archer',
    description: 'Ranged DPS. High DEX and moderate WIS.',
    color: 0x33aa33,
    stats: { str: 10, dex: 16, con: 12, int: 10, wis: 12, cha: 10 },
    startingHp: 90,
    startingMana: 40,
    attackType: 'ranged',
    attackDamage: 10,
  },
};

export type SkillName =
  | 'attack'
  | 'defence'
  | 'mining'
  | 'woodcutting'
  | 'magic'
  | 'ranged'
  | 'hitpoints';

export interface SkillDef {
  id: SkillName;
  name: string;
  color: number;
}

export const SKILLS: Record<SkillName, SkillDef> = {
  attack: { id: 'attack', name: 'Attack', color: 0xcc4444 },
  defence: { id: 'defence', name: 'Defence', color: 0x4444cc },
  mining: { id: 'mining', name: 'Mining', color: 0x888888 },
  woodcutting: { id: 'woodcutting', name: 'Woodcutting', color: 0x44aa44 },
  magic: { id: 'magic', name: 'Magic', color: 0x6644cc },
  ranged: { id: 'ranged', name: 'Ranged', color: 0x44aa44 },
  hitpoints: { id: 'hitpoints', name: 'Hitpoints', color: 0xcc4444 },
};

export function xpForLevel(level: number): number {
  return Math.floor(level * level * 83 + level * 100);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level)) {
    level++;
  }
  return level;
}
