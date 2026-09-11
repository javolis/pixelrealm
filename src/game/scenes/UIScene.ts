import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { SKILLS, SkillName } from '../data/classes';
import { ITEMS } from '../data/items';
import { Player } from '../entities/Player';

export class UIScene extends Phaser.Scene {
  hpBar!: Phaser.GameObjects.Rectangle;
  hpBarBg!: Phaser.GameObjects.Rectangle;
  hpText!: Phaser.GameObjects.Text;
  goldText!: Phaser.GameObjects.Text;
  messageText!: Phaser.GameObjects.Text;
  skillPanel!: Phaser.GameObjects.Rectangle;
  skillTexts: Phaser.GameObjects.Text[] = [];
  inventoryPanel!: Phaser.GameObjects.Rectangle;
  inventoryTexts: Phaser.GameObjects.Text[] = [];
  questPanel!: Phaser.GameObjects.Rectangle;
  questTexts: Phaser.GameObjects.Text[] = [];
  showInventory = false;
  showQuests = false;
  messageTimer = 0;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // HP bar
    this.hpBarBg = this.add.rectangle(70, 16, 100, 10, 0x333333).setScrollFactor(0).setDepth(300);
    this.hpBar = this.add.rectangle(70, 16, 100, 10, 0xcc3333).setScrollFactor(0).setDepth(301);
    this.hpText = this.add
      .text(70, 16, 'HP', { fontSize: '7px', color: '#ffffff', fontFamily: 'monospace' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(302);

    this.goldText = this.add
      .text(GAME_WIDTH - 10, 10, 'Gold: 0', {
        fontSize: '8px',
        color: '#ffcc00',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(300);

    this.messageText = this.add
      .text(GAME_WIDTH / 2, 50, '', {
        fontSize: '8px',
        color: '#ffff88',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(350);

    // Skill panel (always visible, RuneScape-style)
    this.skillPanel = this.add
      .rectangle(GAME_WIDTH - 55, GAME_HEIGHT / 2, 90, 200, 0x111122, 0.85)
      .setStrokeStyle(1, 0x444466)
      .setScrollFactor(0)
      .setDepth(300);

    this.add
      .text(GAME_WIDTH - 55, GAME_HEIGHT / 2 - 90, 'SKILLS', {
        fontSize: '8px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(301);

    const skillNames = Object.keys(SKILLS) as SkillName[];
    skillNames.forEach((_skill, i) => {
      const t = this.add
        .text(GAME_WIDTH - 95, GAME_HEIGHT / 2 - 70 + i * 22, '', {
          fontSize: '7px',
          color: '#cccccc',
          fontFamily: 'monospace',
        })
        .setScrollFactor(0)
        .setDepth(301);
      this.skillTexts.push(t);
    });

    // Inventory panel
    this.inventoryPanel = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 280, 220, 0x111122, 0.95)
      .setStrokeStyle(2, 0x664422)
      .setScrollFactor(0)
      .setDepth(400)
      .setVisible(false);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 95, 'INVENTORY', {
        fontSize: '10px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(401);

    for (let i = 0; i < 14; i++) {
      const t = this.add
        .text(GAME_WIDTH / 2 - 120, GAME_HEIGHT / 2 - 70 + i * 14, '', {
          fontSize: '7px',
          color: '#aaaaaa',
          fontFamily: 'monospace',
        })
        .setScrollFactor(0)
        .setDepth(401)
        .setVisible(false);
      this.inventoryTexts.push(t);
    }

    // Quest panel
    this.questPanel = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 200, 0x111122, 0.95)
      .setStrokeStyle(2, 0x224466)
      .setScrollFactor(0)
      .setDepth(400)
      .setVisible(false);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 85, 'QUEST LOG', {
        fontSize: '10px',
        color: '#66aaff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(401);

    for (let i = 0; i < 8; i++) {
      const t = this.add
        .text(GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 60 + i * 16, '', {
          fontSize: '7px',
          color: '#aaaaaa',
          fontFamily: 'monospace',
        })
        .setScrollFactor(0)
        .setDepth(401)
        .setVisible(false);
      this.questTexts.push(t);
    }

    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('player-update', (player: Player) => this.updateHUD(player));
    gameScene.events.on('ui-message', (msg: string) => this.showMessage(msg));
    gameScene.events.on('ui-toggle-inventory', () => this.toggleInventory());
    gameScene.events.on('ui-toggle-quests', () => this.toggleQuests());

    this.input.keyboard!.on('keydown-I', () => this.toggleInventory());
    this.input.keyboard!.on('keydown-Q', () => this.toggleQuests());
  }

  private updateHUD(player: Player): void {
    const hpPct = player.hp / player.maxHp;
    this.hpBar.setDisplaySize(100 * hpPct, 10);
    this.hpText.setText(`${player.hp}/${player.maxHp}`);
    this.goldText.setText(`Gold: ${player.gold}`);

    const skills = player.skills.getAllSkills();
    const skillNames = Object.keys(SKILLS) as SkillName[];
    skillNames.forEach((skill, i) => {
      const data = skills[skill];
      this.skillTexts[i].setText(`${SKILLS[skill].name}: ${data.level}`);
    });

    if (this.showInventory) this.renderInventory(player);
    if (this.showQuests) this.renderQuests(player);
  }

  private renderInventory(player: Player): void {
    const slots = player.inventory.getSlots();
    this.inventoryTexts.forEach((t, i) => {
      if (i < slots.length) {
        const item = ITEMS[slots[i].itemId];
        t.setText(`${item?.name ?? slots[i].itemId} x${slots[i].quantity}`).setVisible(true);
      } else {
        t.setVisible(false);
      }
    });
  }

  private renderQuests(player: Player): void {
    const active = player.quests.getActiveQuests();
    let line = 0;
    this.questTexts.forEach((t) => t.setVisible(false));

    for (const quest of active) {
      if (line >= this.questTexts.length) break;
      this.questTexts[line].setText(quest.def.name).setColor('#ffcc00').setVisible(true);
      line++;
      for (let i = 0; i < quest.def.objectives.length; i++) {
        if (line >= this.questTexts.length) break;
        this.questTexts[line]
          .setText(`  ${player.quests.getObjectiveText(quest, i)}`)
          .setColor('#aaaaaa')
          .setVisible(true);
        line++;
      }
    }

    const completed = player.quests.getCompletedQuests();
    for (const quest of completed.slice(-2)) {
      if (line >= this.questTexts.length) break;
      this.questTexts[line]
        .setText(`${quest.def.name} [COMPLETE]`)
        .setColor('#44ff44')
        .setVisible(true);
      line++;
    }
  }

  private toggleInventory(): void {
    this.showInventory = !this.showInventory;
    this.inventoryPanel.setVisible(this.showInventory);
    this.inventoryTexts.forEach((t) => t.setVisible(this.showInventory));
  }

  private toggleQuests(): void {
    this.showQuests = !this.showQuests;
    this.questPanel.setVisible(this.showQuests);
    if (!this.showQuests) {
      this.questTexts.forEach((t) => t.setVisible(false));
    }
  }

  private showMessage(msg: string): void {
    this.messageText.setText(msg);
    this.messageTimer = 3000;
  }

  update(_time: number, delta: number): void {
    if (this.messageTimer > 0) {
      this.messageTimer -= delta;
      if (this.messageTimer <= 0) {
        this.messageText.setText('');
      }
    }
  }
}
