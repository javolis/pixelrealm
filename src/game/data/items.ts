export interface ItemDef {
  id: string;
  name: string;
  description: string;
  stackable: boolean;
  value: number;
  color: number;
  type: 'resource' | 'weapon' | 'armor' | 'consumable' | 'quest';
}

export const ITEMS: Record<string, ItemDef> = {
  logs: {
    id: 'logs',
    name: 'Oak Logs',
    description: 'Freshly cut oak logs.',
    stackable: true,
    value: 5,
    color: 0x8b6914,
    type: 'resource',
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    description: 'A chunk of stone.',
    stackable: true,
    value: 3,
    color: 0x666666,
    type: 'resource',
  },
  copper_ore: {
    id: 'copper_ore',
    name: 'Copper Ore',
    description: 'Raw copper ore.',
    stackable: true,
    value: 15,
    color: 0xb87333,
    type: 'resource',
  },
  iron_ore: {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Raw iron ore.',
    stackable: true,
    value: 35,
    color: 0xaaaaaa,
    type: 'resource',
  },
  goblin_ear: {
    id: 'goblin_ear',
    name: 'Goblin Ear',
    description: 'A trophy from a defeated goblin.',
    stackable: true,
    value: 10,
    color: 0x44aa44,
    type: 'quest',
  },
  bread: {
    id: 'bread',
    name: 'Bread',
    description: 'Restores 20 HP.',
    stackable: true,
    value: 8,
    color: 0xdeb887,
    type: 'consumable',
  },
  bronze_sword: {
    id: 'bronze_sword',
    name: 'Bronze Sword',
    description: 'A basic warrior weapon.',
    stackable: false,
    value: 50,
    color: 0xcd7f32,
    type: 'weapon',
  },
};
