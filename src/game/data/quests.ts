export interface QuestObjective {
  type: 'kill' | 'gather' | 'talk';
  target: string;
  count: number;
  description: string;
}

export interface QuestDef {
  id: string;
  name: string;
  giver: string;
  description: string;
  objectives: QuestObjective[];
  rewards: {
    xp: Partial<Record<string, number>>;
    gold: number;
    items?: string[];
  };
}

export const QUESTS: Record<string, QuestDef> = {
  goblin_menace: {
    id: 'goblin_menace',
    name: 'Goblin Menace',
    giver: 'Captain Aldric',
    description: 'The goblins threaten our village. Slay 3 of them.',
    objectives: [
      { type: 'kill', target: 'goblin', count: 3, description: 'Slay Goblins (0/3)' },
    ],
    rewards: {
      xp: { attack: 150, hitpoints: 100 },
      gold: 50,
      items: ['bread'],
    },
  },
  copper_rush: {
    id: 'copper_rush',
    name: 'Copper Rush',
    giver: 'Blacksmith Torin',
    description: 'I need copper ore for my forge. Mine 5 pieces.',
    objectives: [
      { type: 'gather', target: 'copper_ore', count: 5, description: 'Mine Copper Ore (0/5)' },
    ],
    rewards: {
      xp: { mining: 200 },
      gold: 75,
    },
  },
};
