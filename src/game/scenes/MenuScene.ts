import Phaser from 'phaser';
import { CLASSES, CharacterClass } from '../data/classes';
import { GAME_WIDTH } from '../config';
import { createCharacterSprite } from '../sprites/SpriteFactory';

export class MenuScene extends Phaser.Scene {
  private selectedClass: CharacterClass = 'warrior';

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#0a0a12');

    this.add
      .text(GAME_WIDTH / 2, 40, 'PIXELREALM', {
        fontSize: '32px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 75, 'An 8-bit Adventure', {
        fontSize: '10px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 100, 'Choose Your Class', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    const classes: CharacterClass[] = ['warrior', 'mage', 'archer'];
    classes.forEach((cls, i) => {
      const x = 120 + i * 200;
      const def = CLASSES[cls];
      const box = this.add
        .rectangle(x, 200, 160, 180, 0x222233)
        .setStrokeStyle(2, 0x444466)
        .setInteractive({ useHandCursor: true });

      createCharacterSprite(this, x, 150, cls, cls).setScale(2);
      this.add
        .text(x, 185, def.name, { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' })
        .setOrigin(0.5);
      this.add
        .text(x, 210, def.description, {
          fontSize: '7px',
          color: '#aaaaaa',
          fontFamily: 'monospace',
          wordWrap: { width: 140 },
          align: 'center',
        })
        .setOrigin(0.5);

      const stats = def.stats;
      this.add
        .text(x, 250, `STR ${stats.str}  DEX ${stats.dex}\nCON ${stats.con}  INT ${stats.int}\nWIS ${stats.wis}  CHA ${stats.cha}`, {
          fontSize: '7px',
          color: '#888888',
          fontFamily: 'monospace',
          align: 'center',
        })
        .setOrigin(0.5);

      box.on('pointerover', () => box.setStrokeStyle(2, def.color));
      box.on('pointerout', () => {
        if (this.selectedClass !== cls) box.setStrokeStyle(2, 0x444466);
      });
      box.on('pointerdown', () => {
        this.selectedClass = cls;
        classes.forEach((c, j) => {
          const boxes = this.children.list.filter(
            (obj) => obj instanceof Phaser.GameObjects.Rectangle && obj.width === 160
          ) as Phaser.GameObjects.Rectangle[];
          boxes[j]?.setStrokeStyle(2, c === cls ? CLASSES[c].color : 0x444466);
        });
      });
    });

    const startBtn = this.add
      .rectangle(GAME_WIDTH / 2, 380, 200, 40, 0x336633)
      .setStrokeStyle(2, 0x44aa44)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(GAME_WIDTH / 2, 380, 'ENTER WORLD', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    startBtn.on('pointerover', () => startBtn.setFillStyle(0x448844));
    startBtn.on('pointerout', () => startBtn.setFillStyle(0x336633));
    startBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { characterClass: this.selectedClass });
      this.scene.launch('UIScene');
    });

    this.add
      .text(GAME_WIDTH / 2, 440, 'WASD/Arrows: Move  |  Space/Click: Attack  |  E: Interact  |  I: Inventory  |  Q: Quests', {
        fontSize: '7px',
        color: '#555555',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
  }
}
