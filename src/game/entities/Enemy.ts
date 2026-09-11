import Phaser from 'phaser';
import { ENEMIES, EnemyDef } from '../data/enemies';
import { TILE_SIZE } from '../config';
import { createCharacterSprite, updateWalkAnimation, registerCharacterTextures } from '../sprites/SpriteFactory';

export class Enemy {
  sprite: Phaser.GameObjects.Sprite;
  textureKey: string;
  body: Phaser.Physics.Arcade.Body;
  def: EnemyDef;
  hp: number;
  attackCooldown = 0;
  respawnTimer = 0;
  spawnX: number;
  spawnY: number;
  active = true;
  nameText: Phaser.GameObjects.Text;
  enemyId: string;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyId: string, instanceId?: string) {
    this.enemyId = enemyId;
    this.def = ENEMIES[enemyId];
    this.hp = this.def.hp;
    this.spawnX = x;
    this.spawnY = y;

    const seed = instanceId ?? `${enemyId}_${Math.round(x)}_${Math.round(y)}`;
    this.textureKey = registerCharacterTextures(scene, seed, enemyId);
    this.sprite = createCharacterSprite(scene, x, y, seed, enemyId);

    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(10, 8);
    this.body.setOffset(3, 8);

    this.nameText = scene.add
      .text(x, y - 12, this.def.name, {
        fontSize: '6px',
        color: '#ff6666',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
  }

  get x(): number {
    return this.sprite.x;
  }

  get y(): number {
    return this.sprite.y;
  }

  takeDamage(amount: number): boolean {
    if (!this.active) return false;
    this.hp -= amount;
    this.sprite.setTint(0xffffff);
    this.sprite.scene.time.delayedCall(100, () => {
      if (this.active) this.sprite.clearTint();
    });
    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private die(): void {
    this.active = false;
    this.sprite.setVisible(false);
    this.nameText.setVisible(false);
    this.body.enable = false;
    this.respawnTimer = 15000;
  }

  respawn(): void {
    this.hp = this.def.hp;
    this.active = true;
    this.sprite.setPosition(this.spawnX, this.spawnY);
    this.sprite.setVisible(true);
    this.sprite.clearTint();
    this.nameText.setPosition(this.spawnX, this.spawnY - 12);
    this.nameText.setVisible(true);
    this.body.enable = true;
    this.respawnTimer = 0;
  }

  update(delta: number, playerX: number, playerY: number): void {
    if (!this.active) {
      this.respawnTimer -= delta;
      if (this.respawnTimer <= 0) this.respawn();
      return;
    }

    this.nameText.setPosition(this.x, this.y - 12);

    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
    if (dist < 80 && dist > 20) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);
      this.body.setVelocity(Math.cos(angle) * 40, Math.sin(angle) * 40);
    } else {
      this.body.setVelocity(0, 0);
    }

    updateWalkAnimation(this.sprite, this.body.velocity.x, this.body.velocity.y, this.textureKey);
  }

  canAttack(playerX: number, playerY: number): boolean {
    if (!this.active || this.attackCooldown > 0) return false;
    return Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY) < 24;
  }

  attack(): number {
    this.attackCooldown = 1500;
    return this.def.damage;
  }
}

export function spawnEnemies(
  scene: Phaser.Scene,
  tileMap: {
    width: number;
    height: number;
    isWalkable: (x: number, y: number) => boolean;
  }
): Enemy[] {
  const enemies: Enemy[] = [];
  const spawns = [
    { id: 'goblin', count: 8 },
    { id: 'skeleton', count: 4 },
    { id: 'dark_mage', count: 2 },
  ];

  for (const spawn of spawns) {
    let placed = 0;
    let attempts = 0;
    while (placed < spawn.count && attempts < 200) {
      attempts++;
      const tx = Phaser.Math.Between(5, tileMap.width - 5);
      const ty = Phaser.Math.Between(5, tileMap.height - 5);
      const distFromCenter = Math.hypot(tx - tileMap.width / 2, ty - tileMap.height / 2);
      if (distFromCenter > 8 && tileMap.isWalkable(tx, ty)) {
        const x = tx * TILE_SIZE + 8;
        const y = ty * TILE_SIZE + 8;
        enemies.push(new Enemy(scene, x, y, spawn.id, `${spawn.id}_${placed}`));
        placed++;
      }
    }
  }
  return enemies;
}
