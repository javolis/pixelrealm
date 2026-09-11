export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  damage: number;
  xp: number;
  color: number;
  drop?: string;
  dropChance?: number;
  gold: number;
}

export const ENEMIES: Record<string, EnemyDef> = {
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    hp: 30,
    damage: 4,
    xp: 25,
    color: 0x44aa44,
    drop: 'goblin_ear',
    dropChance: 0.5,
    gold: 5,
  },
  skeleton: {
    id: 'skeleton',
    name: 'Skeleton',
    hp: 45,
    damage: 7,
    xp: 45,
    color: 0xcccccc,
    gold: 12,
  },
  dark_mage: {
    id: 'dark_mage',
    name: 'Dark Mage',
    hp: 60,
    damage: 12,
    xp: 80,
    color: 0x6633aa,
    gold: 25,
  },
};
