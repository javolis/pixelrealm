import Phaser from 'phaser';
import { CharacterClass } from '../data/classes';
import { Player } from '../entities/Player';
import { Enemy, spawnEnemies } from '../entities/Enemy';
import { NPC, spawnNPCs } from '../entities/NPC';
import { TileMap } from '../world/TileMap';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, GAME_WIDTH, GAME_HEIGHT } from '../config';
import { updateWalkAnimation } from '../sprites/SpriteFactory';
import { ITEMS } from '../data/items';

export class GameScene extends Phaser.Scene {
  player!: Player;
  tileMap!: TileMap;
  enemies: Enemy[] = [];
  npcs: NPC[] = [];
  tileSprites: Phaser.GameObjects.Image[][] = [];
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  spaceKey!: Phaser.Input.Keyboard.Key;
  eKey!: Phaser.Input.Keyboard.Key;
  gatherBar!: Phaser.GameObjects.Rectangle;
  gatherBarBg!: Phaser.GameObjects.Rectangle;
  dialogueBox!: Phaser.GameObjects.Rectangle;
  dialogueText!: Phaser.GameObjects.Text;
  currentNPC: NPC | null = null;
  messageQueue: string[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { characterClass: CharacterClass }): void {
    this.registry.set('characterClass', data.characterClass);
  }

  create(): void {
    this.tileMap = new TileMap();
    this.renderMap();

    const cx = Math.floor(MAP_WIDTH / 2);
    const cy = Math.floor(MAP_HEIGHT / 2);
    const characterClass = this.registry.get('characterClass') as CharacterClass;
    this.player = new Player(this, cx * TILE_SIZE + 8, (cy + 3) * TILE_SIZE + 8, characterClass);

    this.enemies = spawnEnemies(this, this.tileMap);
    this.npcs = spawnNPCs(this, cx, cy);

    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setZoom(2);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,S,A,D') as typeof this.wasd;
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.gatherBarBg = this.add.rectangle(0, 0, 30, 4, 0x333333).setVisible(false).setScrollFactor(0).setDepth(100);
    this.gatherBar = this.add.rectangle(0, 0, 30, 4, 0x44aa44).setVisible(false).setScrollFactor(0).setDepth(101);

    this.dialogueBox = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, GAME_WIDTH - 40, 80, 0x111122, 0.9)
      .setStrokeStyle(1, 0x444466)
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    this.dialogueText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 60, '', {
        fontSize: '8px',
        color: '#ffffff',
        fontFamily: 'monospace',
        wordWrap: { width: GAME_WIDTH - 60 },
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(201)
      .setVisible(false);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y > GAME_HEIGHT - 100) return;
      this.tryAttack(pointer.worldX, pointer.worldY);
      this.tryGather(pointer.worldX, pointer.worldY);
    });

    this.events.on('show-message', (msg: string) => this.showMessage(msg));
    this.events.on('toggle-inventory', () => this.events.emit('ui-toggle-inventory'));
    this.events.on('toggle-quests', () => this.events.emit('ui-toggle-quests'));
  }

  private renderMap(): void {
    const tiles = this.tileMap.getAllTiles();
    for (let y = 0; y < MAP_HEIGHT; y++) {
      this.tileSprites[y] = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        const type = tiles[y][x];
        this.tileSprites[y][x] = this.add.image(x * TILE_SIZE + 8, y * TILE_SIZE + 8, `tile_${type}`);
      }
    }
  }

  update(_time: number, delta: number): void {
    if (!this.player || this.player.isDead()) return;

    this.player.update(delta);
    this.handleMovement();
    this.handleCombat(delta);
    this.handleGathering(delta);
    this.npcs.forEach((npc) => npc.update());

    this.events.emit('player-update', this.player);

    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.handleInteract();
    }
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.tryAttack(this.player.x + 20, this.player.y);
    }
  }

  private handleMovement(): void {
    const speed = 100;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = speed;

    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    const nextX = this.player.x + (vx * (1 / 60));
    const nextY = this.player.y + (vy * (1 / 60));
    const nextTileX = Math.floor(nextX / TILE_SIZE);
    const nextTileY = Math.floor(nextY / TILE_SIZE);

    if (this.tileMap.isWalkable(nextTileX, nextTileY)) {
      this.player.body.setVelocity(vx, vy);
    } else {
      this.player.body.setVelocity(0, 0);
    }

    updateWalkAnimation(
      this.player.sprite,
      this.player.body.velocity.x,
      this.player.body.velocity.y,
      this.player.textureKey
    );
  }

  private tryAttack(worldX: number, worldY: number): void {
    if (this.player.attackCooldown > 0) return;

    const fx = this.add.image(this.player.x, this.player.y, 'attack_fx').setAlpha(0.8);
    this.tweens.add({
      targets: fx,
      x: worldX,
      y: worldY,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => fx.destroy(),
    });

    this.player.attackCooldown = 500;

    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, worldX, worldY);
      if (dist < 20 || Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) < 28) {
        const killed = enemy.takeDamage(this.player.attackDamage);
        if (killed) {
          this.onEnemyKilled(enemy);
        }
        const skill = this.player.characterClass === 'mage' ? 'magic' : this.player.characterClass === 'archer' ? 'ranged' : 'attack';
        const result = this.player.skills.addXp(skill, enemy.def.xp);
        this.player.skills.addXp('hitpoints', Math.floor(enemy.def.xp / 3));
        if (result.leveledUp) {
          this.showMessage(`${skill} level up! Now level ${result.newLevel}`);
        }
        break;
      }
    }
  }

  private onEnemyKilled(enemy: Enemy): void {
    this.player.gold += enemy.def.gold;
    this.showMessage(`Defeated ${enemy.def.name}! +${enemy.def.gold} gold`);

    if (enemy.def.drop && enemy.def.dropChance && Math.random() < enemy.def.dropChance) {
      this.player.inventory.addItem(enemy.def.drop);
      this.showMessage(`Received ${ITEMS[enemy.def.drop]?.name ?? enemy.def.drop}`);
    }

    const quest = this.player.quests.updateKill(enemy.def.id);
    if (quest) {
      this.showMessage(`Quest updated: ${quest.name}`);
      this.checkQuestComplete(quest.id);
    }
  }

  private tryGather(worldX: number, worldY: number): void {
    const tx = Math.floor(worldX / TILE_SIZE);
    const ty = Math.floor(worldY / TILE_SIZE);
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, tx * TILE_SIZE + 8, ty * TILE_SIZE + 8);
    if (dist > 32 || !this.tileMap.isMineable(tx, ty)) return;

    this.player.isGathering = true;
    this.player.gatherProgress = 0;
    this.player.gatherTarget = { x: tx, y: ty };
  }

  private handleGathering(delta: number): void {
    if (!this.player.isGathering || !this.player.gatherTarget) {
      this.gatherBar.setVisible(false);
      this.gatherBarBg.setVisible(false);
      return;
    }

    const { x: tx, y: ty } = this.player.gatherTarget;
    const def = this.tileMap.getTileDef(tx, ty);

    this.player.gatherProgress += delta;
    const duration = 2000;
    const progress = Math.min(1, this.player.gatherProgress / duration);

    const screenPos = this.cameras.main.getWorldPoint(this.player.x, this.player.y - 20);
    this.gatherBarBg.setPosition(screenPos.x, screenPos.y).setVisible(true);
    this.gatherBar
      .setPosition(screenPos.x - 15 + 15 * progress, screenPos.y)
      .setDisplaySize(30 * progress, 4)
      .setVisible(true);

    if (progress >= 1) {
      this.player.isGathering = false;
      this.player.gatherTarget = null;

      if (def.skill && def.xp) {
        const result = this.player.skills.addXp(def.skill, def.xp);
        if (result.leveledUp) {
          this.showMessage(`${def.skill} level up! Now level ${result.newLevel}`);
        }
      }

      if (def.drop) {
        this.player.inventory.addItem(def.drop);
        this.showMessage(`Received ${ITEMS[def.drop]?.name ?? def.drop}`);
        const quest = this.player.quests.updateGather(def.drop);
        if (quest) {
          this.showMessage(`Quest updated: ${quest.name}`);
          this.checkQuestComplete(quest.id);
        }
      }

      const replacement = def.skill === 'woodcutting' ? 'grass' : 'stone';
      this.tileMap.setTile(tx, ty, replacement);
      this.tileSprites[ty][tx].setTexture(`tile_${replacement}`);
      this.showMessage(`Mined ${def.name}`);
    }
  }

  private handleCombat(delta: number): void {
    for (const enemy of this.enemies) {
      if (enemy.canAttack(this.player.x, this.player.y)) {
        const dmg = enemy.attack();
        this.player.takeDamage(dmg);
        this.showMessage(`${enemy.def.name} hits you for ${dmg} damage!`);
        if (this.player.isDead()) {
          this.showMessage('You have fallen... Respawning at village.');
          this.time.delayedCall(2000, () => {
            const cx = Math.floor(MAP_WIDTH / 2);
            const cy = Math.floor(MAP_HEIGHT / 2);
            this.player.sprite.setPosition(cx * TILE_SIZE + 8, (cy + 3) * TILE_SIZE + 8);
            this.player.hp = this.player.maxHp;
          });
        }
      }
      enemy.update(delta, this.player.x, this.player.y);
    }
  }

  private handleInteract(): void {
    for (const npc of this.npcs) {
      if (npc.isNear(this.player.x, this.player.y)) {
        this.currentNPC = npc;
        if (npc.def.id === 'healer') {
          this.player.hp = this.player.maxHp;
          this.player.mana = this.player.maxMana;
          this.showMessage('Sister Elara heals you fully.');
          return;
        }
        if (npc.def.questId) {
          const started = this.player.quests.startQuest(npc.def.questId);
          if (started) {
            this.showMessage(`Quest accepted: ${npc.def.name}'s task!`);
          } else {
            this.showMessage(npc.def.dialogue[0]);
          }
        }
        this.showDialogue(npc.def.dialogue);
        return;
      }
    }
  }

  private checkQuestComplete(questId: string): void {
    const completed = this.player.quests.getCompletedQuests().find((q) => q.def.id === questId);
    if (!completed) return;

    const rewards = completed.def.rewards;
    this.player.gold += rewards.gold;
    for (const [skill, xp] of Object.entries(rewards.xp)) {
      this.player.skills.addXp(skill as import('../data/classes').SkillName, xp!);
    }
    if (rewards.items) {
      for (const item of rewards.items) {
        this.player.inventory.addItem(item);
      }
    }
    this.showMessage(`Quest complete: ${completed.def.name}! +${rewards.gold} gold`);
  }

  private showDialogue(lines: string[]): void {
    this.dialogueBox.setVisible(true);
    this.dialogueText.setVisible(true).setText(lines.join('\n'));
    this.time.delayedCall(4000, () => {
      this.dialogueBox.setVisible(false);
      this.dialogueText.setVisible(false);
    });
  }

  showMessage(msg: string): void {
    this.events.emit('ui-message', msg);
  }
}
