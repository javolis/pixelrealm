import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import { createCharacterSprite } from '../sprites/SpriteFactory';

export interface NPCDef {
  id: string;
  name: string;
  color: number;
  questId?: string;
  dialogue: string[];
}

export class NPC {
  sprite: Phaser.GameObjects.Sprite;
  def: NPCDef;
  nameText: Phaser.GameObjects.Text;
  exclamation: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, def: NPCDef) {
    this.def = def;
    this.sprite = createCharacterSprite(scene, x, y, def.id, 'npc');

    this.nameText = scene.add
      .text(x, y - 14, def.name, {
        fontSize: '6px',
        color: '#ffdd00',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.exclamation = scene.add
      .text(x, y - 22, '!', {
        fontSize: '10px',
        color: '#ffff00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setVisible(!!def.questId);
  }

  isNear(playerX: number, playerY: number): boolean {
    return Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, playerX, playerY) < 32;
  }

  update(): void {
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 14);
    this.exclamation.setPosition(this.sprite.x, this.sprite.y - 22);
  }
}

export const NPC_DATA: NPCDef[] = [
  {
    id: 'aldric',
    name: 'Captain Aldric',
    color: 0xccaa44,
    questId: 'goblin_menace',
    dialogue: [
      'Welcome, adventurer! Goblins plague our lands.',
      'Slay 3 goblins and return to me for a reward.',
      '[Press E to accept quest: Goblin Menace]',
    ],
  },
  {
    id: 'torin',
    name: 'Blacksmith Torin',
    color: 0x888888,
    questId: 'copper_rush',
    dialogue: [
      'Need ore for the forge!',
      'Mine 5 copper ore from the hills.',
      '[Press E to accept quest: Copper Rush]',
    ],
  },
  {
    id: 'healer',
    name: 'Sister Elara',
    color: 0xffffff,
    dialogue: [
      'May the light guide you, traveler.',
      'Rest here if you need healing.',
      '[Press E to fully heal]',
    ],
  },
];

export function spawnNPCs(scene: Phaser.Scene, centerX: number, centerY: number): NPC[] {
  return [
    new NPC(scene, centerX * TILE_SIZE + 8, (centerY - 2) * TILE_SIZE + 8, NPC_DATA[0]),
    new NPC(scene, (centerX + 2) * TILE_SIZE + 8, centerY * TILE_SIZE + 8, NPC_DATA[1]),
    new NPC(scene, (centerX - 2) * TILE_SIZE + 8, centerY * TILE_SIZE + 8, NPC_DATA[2]),
  ];
}
