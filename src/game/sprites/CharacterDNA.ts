export type BodyType = 'slim' | 'medium' | 'stocky';
export type HairStyle = 'short' | 'long' | 'bald' | 'spiky' | 'hood';
export type Accessory = 'none' | 'cape' | 'belt' | 'glow';
export type Race = 'human' | 'elf' | 'dwarf' | 'goblin' | 'undead';
export type ArmorTier = 'none' | 'cloth' | 'leather' | 'chain' | 'plate';
export type HelmetType = 'none' | 'hood' | 'helm' | 'crown' | 'mage_hat';
export type WeaponType = 'none' | 'sword' | 'axe' | 'staff' | 'bow' | 'dagger' | 'club';

export interface CharacterDNA {
  seed: string;
  race: Race;
  skin: number;
  hair: number;
  shirt: number;
  pants: number;
  accent: number;
  armor: number;
  metal: number;
  cape: number;
  bodyType: BodyType;
  hairStyle: HairStyle;
  accessory: Accessory;
  armorTier: ArmorTier;
  helmet: HelmetType;
  weapon: WeaponType;
  hasCape: boolean;
  mutation: number;
}

export interface CharacterArchetype {
  id: string;
  label: string;
  defaultRace: Race;
  palette: {
    skin: number[];
    hair: number[];
    shirt: number[];
    pants: number[];
    accent: number[];
    armor: number[];
    metal: number[];
    cape: number[];
  };
  bodyTypes: BodyType[];
  hairStyles: HairStyle[];
  accessories: Accessory[];
  armorTiers: ArmorTier[];
  helmets: HelmetType[];
  weapons: WeaponType[];
  capes: boolean[];
}

export interface EquipmentPreset {
  race: Race;
  armorTier: ArmorTier;
  helmet: HelmetType;
  weapon: WeaponType;
  hasCape: boolean;
  hairStyle?: HairStyle;
  accessory?: Accessory;
}

/** Class/archetype default loadouts — hybrid LPC-style equipment slots */
export const EQUIPMENT_PRESETS: Record<string, EquipmentPreset> = {
  warrior: {
    race: 'human',
    armorTier: 'chain',
    helmet: 'helm',
    weapon: 'sword',
    hasCape: false,
    hairStyle: 'short',
    accessory: 'belt',
  },
  mage: {
    race: 'elf',
    armorTier: 'cloth',
    helmet: 'mage_hat',
    weapon: 'staff',
    hasCape: true,
    hairStyle: 'long',
    accessory: 'glow',
  },
  archer: {
    race: 'human',
    armorTier: 'leather',
    helmet: 'hood',
    weapon: 'bow',
    hasCape: true,
    hairStyle: 'long',
    accessory: 'belt',
  },
  goblin: {
    race: 'goblin',
    armorTier: 'leather',
    helmet: 'none',
    weapon: 'club',
    hasCape: false,
    hairStyle: 'bald',
    accessory: 'none',
  },
  skeleton: {
    race: 'undead',
    armorTier: 'none',
    helmet: 'none',
    weapon: 'dagger',
    hasCape: false,
    hairStyle: 'bald',
    accessory: 'glow',
  },
  dark_mage: {
    race: 'undead',
    armorTier: 'cloth',
    helmet: 'hood',
    weapon: 'staff',
    hasCape: true,
    hairStyle: 'hood',
    accessory: 'glow',
  },
  npc: {
    race: 'human',
    armorTier: 'cloth',
    helmet: 'none',
    weapon: 'none',
    hasCape: false,
  },
};

export const ARCHETYPES: Record<string, CharacterArchetype> = {
  warrior: {
    id: 'warrior',
    label: 'Warrior',
    defaultRace: 'human',
    palette: {
      skin: [0xf5c99a, 0xd4a574, 0x8d5524, 0xffdbac],
      hair: [0x3d2314, 0x6b4423, 0x1a1a1a, 0x8b4513],
      shirt: [0x8b0000, 0x555555, 0x4a3728, 0x663333],
      pants: [0x333333, 0x4a3728, 0x222222],
      accent: [0xccaa44, 0x888888, 0xaa4444],
      armor: [0x666677, 0x777788, 0x555566],
      metal: [0xaaaaaa, 0xcccccc, 0x888888],
      cape: [0x882222, 0x334488],
    },
    bodyTypes: ['medium', 'stocky'],
    hairStyles: ['short', 'spiky', 'bald'],
    accessories: ['belt', 'none'],
    armorTiers: ['chain', 'plate', 'leather'],
    helmets: ['helm', 'none'],
    weapons: ['sword', 'axe'],
    capes: [false, true],
  },
  mage: {
    id: 'mage',
    label: 'Mage',
    defaultRace: 'elf',
    palette: {
      skin: [0xffdbac, 0xf5c99a, 0xd4a574],
      hair: [0xeeeeee, 0x6633aa, 0x2244aa, 0x1a1a1a],
      shirt: [0x4422aa, 0x224488, 0x5533aa, 0x333366],
      pants: [0x222244, 0x333366, 0x1a1a33],
      accent: [0x6644ff, 0x44aaff, 0xaa66ff],
      armor: [0x5533aa, 0x442288, 0x6633cc],
      metal: [0x8888cc, 0xaaaaff],
      cape: [0x331188, 0x4422aa],
    },
    bodyTypes: ['slim', 'medium'],
    hairStyles: ['long', 'spiky'],
    accessories: ['glow', 'none'],
    armorTiers: ['cloth', 'none'],
    helmets: ['mage_hat', 'hood', 'none'],
    weapons: ['staff'],
    capes: [true],
  },
  archer: {
    id: 'archer',
    label: 'Archer',
    defaultRace: 'human',
    palette: {
      skin: [0xf5c99a, 0xd4a574, 0x8d5524],
      hair: [0x6b4423, 0x3d2314, 0x228822, 0x1a1a1a],
      shirt: [0x336633, 0x556644, 0x445533, 0x664422],
      pants: [0x4a3728, 0x333322, 0x554433],
      accent: [0x88aa44, 0xcc8844, 0x668844],
      armor: [0x556644, 0x445533, 0x667755],
      metal: [0x888866, 0xaaaa88],
      cape: [0x335522, 0x446633],
    },
    bodyTypes: ['slim', 'medium'],
    hairStyles: ['short', 'long'],
    accessories: ['belt', 'none'],
    armorTiers: ['leather', 'cloth'],
    helmets: ['hood', 'none'],
    weapons: ['bow', 'dagger'],
    capes: [true, false],
  },
  goblin: {
    id: 'goblin',
    label: 'Goblin',
    defaultRace: 'goblin',
    palette: {
      skin: [0x44aa44, 0x338833, 0x55cc55],
      hair: [0x1a331a, 0x223322],
      shirt: [0x664422, 0x553311, 0x774433],
      pants: [0x443322, 0x332211],
      accent: [0xaa4444, 0xcc6622],
      armor: [0x554433, 0x443322],
      metal: [0x666666, 0x888888],
      cape: [0x442211],
    },
    bodyTypes: ['slim', 'medium'],
    hairStyles: ['bald', 'spiky'],
    accessories: ['none', 'belt'],
    armorTiers: ['leather', 'none'],
    helmets: ['none'],
    weapons: ['club', 'dagger'],
    capes: [false],
  },
  skeleton: {
    id: 'skeleton',
    label: 'Skeleton',
    defaultRace: 'undead',
    palette: {
      skin: [0xdddddd, 0xcccccc, 0xeeeeee],
      hair: [0x888888],
      shirt: [0xaaaaaa, 0x999999],
      pants: [0x777777, 0x666666],
      accent: [0xffffff, 0xccccff],
      armor: [0xbbbbbb, 0x999999],
      metal: [0xcccccc, 0xeeeeee],
      cape: [0x444466],
    },
    bodyTypes: ['slim', 'medium'],
    hairStyles: ['bald'],
    accessories: ['glow', 'none'],
    armorTiers: ['none'],
    helmets: ['none'],
    weapons: ['dagger', 'sword'],
    capes: [false],
  },
  dark_mage: {
    id: 'dark_mage',
    label: 'Dark Mage',
    defaultRace: 'undead',
    palette: {
      skin: [0xd4a574, 0xcccccc, 0x888888],
      hair: [0x1a1a1a, 0x330033],
      shirt: [0x220033, 0x110022, 0x331144],
      pants: [0x110011, 0x220022],
      accent: [0xaa00ff, 0xff0066, 0x6600aa],
      armor: [0x330044, 0x220033],
      metal: [0x663388, 0x8844aa],
      cape: [0x220033, 0x110022],
    },
    bodyTypes: ['slim', 'medium'],
    hairStyles: ['hood', 'long'],
    accessories: ['glow', 'cape'],
    armorTiers: ['cloth', 'none'],
    helmets: ['hood', 'mage_hat'],
    weapons: ['staff'],
    capes: [true],
  },
  npc: {
    id: 'npc',
    label: 'Villager',
    defaultRace: 'human',
    palette: {
      skin: [0xf5c99a, 0xd4a574, 0xffdbac, 0x8d5524],
      hair: [0x3d2314, 0x6b4423, 0xeeeeee, 0x1a1a1a],
      shirt: [0x666688, 0x886644, 0x448866, 0x888866],
      pants: [0x444444, 0x554433, 0x333355],
      accent: [0xccaa44, 0x888888],
      armor: [0x777777, 0x666666],
      metal: [0x999999, 0xbbbbbb],
      cape: [0x553333, 0x334455],
    },
    bodyTypes: ['slim', 'medium', 'stocky'],
    hairStyles: ['short', 'long', 'bald'],
    accessories: ['none', 'belt'],
    armorTiers: ['cloth', 'none', 'leather'],
    helmets: ['none', 'hood'],
    weapons: ['none', 'dagger'],
    capes: [false, true],
  },
};

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function applyPreset(archetypeId: string, rand: () => number): Partial<CharacterDNA> {
  const preset = EQUIPMENT_PRESETS[archetypeId] ?? EQUIPMENT_PRESETS.npc;
  const archetype = ARCHETYPES[archetypeId] ?? ARCHETYPES.npc;

  return {
    race: preset.race,
    armorTier: preset.armorTier,
    helmet: preset.helmet,
    weapon: preset.weapon,
    hasCape: preset.hasCape,
    hairStyle: preset.hairStyle ?? pick(archetype.hairStyles, rand),
    accessory: preset.accessory ?? pick(archetype.accessories, rand),
  };
}

/** NPC villagers get randomized equipment within preset bounds */
function randomizeNpcEquipment(rand: () => number): Partial<CharacterDNA> {
  const races: Race[] = ['human', 'elf', 'dwarf'];
  const armors: ArmorTier[] = ['cloth', 'none', 'leather'];
  const helmets: HelmetType[] = ['none', 'hood'];
  const weapons: WeaponType[] = ['none', 'dagger'];
  return {
    race: pick(races, rand),
    armorTier: pick(armors, rand),
    helmet: pick(helmets, rand),
    weapon: pick(weapons, rand),
    hasCape: rand() > 0.7,
  };
}

export function generateDNA(seed: string, archetypeId: string): CharacterDNA {
  const archetype = ARCHETYPES[archetypeId] ?? ARCHETYPES.npc;
  const rand = seededRandom(hashSeed(seed));
  const presetFields = archetypeId === 'npc' && !EQUIPMENT_PRESETS[seed]
    ? { ...applyPreset('npc', rand), ...randomizeNpcEquipment(rand) }
    : applyPreset(archetypeId, rand);

  return {
    seed,
    race: presetFields.race ?? archetype.defaultRace,
    skin: pick(archetype.palette.skin, rand),
    hair: pick(archetype.palette.hair, rand),
    shirt: pick(archetype.palette.shirt, rand),
    pants: pick(archetype.palette.pants, rand),
    accent: pick(archetype.palette.accent, rand),
    armor: pick(archetype.palette.armor, rand),
    metal: pick(archetype.palette.metal, rand),
    cape: pick(archetype.palette.cape, rand),
    bodyType: pick(archetype.bodyTypes, rand),
    hairStyle: presetFields.hairStyle ?? pick(archetype.hairStyles, rand),
    accessory: presetFields.accessory ?? pick(archetype.accessories, rand),
    armorTier: presetFields.armorTier ?? pick(archetype.armorTiers, rand),
    helmet: presetFields.helmet ?? pick(archetype.helmets, rand),
    weapon: presetFields.weapon ?? pick(archetype.weapons, rand),
    hasCape: presetFields.hasCape ?? pick(archetype.capes, rand),
    mutation: rand(),
  };
}

export function breedDNA(
  parentA: CharacterDNA,
  parentB: CharacterDNA,
  childSeed: string,
  archetypeId: string
): CharacterDNA {
  const base = generateDNA(childSeed, archetypeId);
  const rand = seededRandom(hashSeed(childSeed + '-breed'));

  const pickGene = <T>(a: T, b: T, fallback: T): T => {
    if (rand() < 0.4) return a;
    if (rand() < 0.85) return b;
    return fallback;
  };

  return {
    ...base,
    race: pickGene(parentA.race, parentB.race, base.race),
    skin: pickGene(parentA.skin, parentB.skin, base.skin),
    hair: pickGene(parentA.hair, parentB.hair, base.hair),
    shirt: pickGene(parentA.shirt, parentB.shirt, base.shirt),
    pants: pickGene(parentA.pants, parentB.pants, base.pants),
    accent: pickGene(parentA.accent, parentB.accent, base.accent),
    armor: pickGene(parentA.armor, parentB.armor, base.armor),
    metal: pickGene(parentA.metal, parentB.metal, base.metal),
    cape: pickGene(parentA.cape, parentB.cape, base.cape),
    bodyType: pickGene(parentA.bodyType, parentB.bodyType, base.bodyType),
    hairStyle: pickGene(parentA.hairStyle, parentB.hairStyle, base.hairStyle),
    accessory: pickGene(parentA.accessory, parentB.accessory, base.accessory),
    armorTier: pickGene(parentA.armorTier, parentB.armorTier, base.armorTier),
    helmet: pickGene(parentA.helmet, parentB.helmet, base.helmet),
    weapon: pickGene(parentA.weapon, parentB.weapon, base.weapon),
    hasCape: rand() < 0.5 ? parentA.hasCape : parentB.hasCape,
    mutation: rand(),
  };
}

/** Re-equip character at runtime (e.g. after looting armor) */
export function equipItem(dna: CharacterDNA, slot: 'weapon' | 'armor' | 'helmet', value: string): CharacterDNA {
  const updated = { ...dna };
  if (slot === 'weapon') updated.weapon = value as WeaponType;
  if (slot === 'armor') updated.armorTier = value as ArmorTier;
  if (slot === 'helmet') updated.helmet = value as HelmetType;
  return updated;
}
