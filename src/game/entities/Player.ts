import Phaser from 'phaser';
import { CharacterClass, CLASSES } from '../data/classes';
import { SkillSystem } from '../systems/SkillSystem';
import { InventorySystem } from '../systems/InventorySystem';
import { QuestSystem } from '../systems/QuestSystem';
import { TILE_SIZE } from '../config';
import { createCharacterSprite, registerCharacterTextures } from '../sprites/SpriteFactory';

export class Player {
  sprite: Phaser.GameObjects.Sprite;
  textureKey: string;
  body: Phaser.Physics.Arcade.Body;
  characterClass: CharacterClass;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  gold: number;
  skills: SkillSystem;
  inventory: InventorySystem;
  quests: QuestSystem;
  attackCooldown = 0;
  isGathering = false;
  gatherProgress = 0;
  gatherTarget: { x: number; y: number } | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    characterClass: CharacterClass
  ) {
    this.characterClass = characterClass;
    const def = CLASSES[characterClass];
    this.maxHp = def.startingHp;
    this.hp = def.startingHp;
    this.maxMana = def.startingMana;
    this.mana = def.startingMana;
    this.gold = 25;
    this.skills = new SkillSystem();
    this.inventory = new InventorySystem();
    this.quests = new QuestSystem();

    this.textureKey = registerCharacterTextures(scene, 'player', characterClass);
    this.sprite = createCharacterSprite(scene, x, y, 'player', characterClass);
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setCollideWorldBounds(false);
    this.body.setSize(10, 8);
    this.body.setOffset(3, 8);
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  get tileX(): number {
    return Math.floor(this.x / TILE_SIZE);
  }

  get tileY(): number {
    return Math.floor(this.y / TILE_SIZE);
  }

  get attackDamage(): number {
    const def = CLASSES[this.characterClass];
    const attackLevel = this.skills.getLevel('attack');
    return def.attackDamage + attackLevel;
  }

  takeDamage(amount: number): void {
    const defence = this.skills.getLevel('defence');
    const reduced = Math.max(1, amount - Math.floor(defence / 3));
    this.hp = Math.max(0, this.hp - reduced);
    this.sprite.setTint(0xff6666);
    this.sprite.scene.time.delayedCall(120, () => this.sprite.clearTint());
  }

  heal(amount: number): void {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  isDead(): boolean {
    return this.hp <= 0;
  }

  update(delta: number): void {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }
  }
}
