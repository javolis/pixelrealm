# External Sprite Assets (Hybrid Mode)

Drop free LPC or Mana Seed sprite sheets here to override procedural characters.

## Quick setup

1. Download a **CC0** top-down character sheet (16×16 or 32×32 frames).
   - [OpenGameArt LPC character](https://opengameart.org/content/pixel-art-top-down-dungeon-tileset-and-rpg-character-with-animations)
   - [16×16 RPG character set](https://opengameart.org/content/16x16-8-bit-rpg-character-set)
   - [Mana Seed base on itch.io](https://seliel-the-shaper.itch.io/character-base)

2. Place PNG files in `public/assets/sprites/characters/`:
   ```
   characters/warrior.png
   characters/mage.png
   characters/goblin.png
   ```

3. Edit `manifest.json`:
   ```json
   {
     "characters": [
       {
         "archetypeId": "warrior",
         "path": "/assets/sprites/characters/warrior.png",
         "frameWidth": 16,
         "frameHeight": 16,
         "frameCount": 6
       }
     ]
   }
   ```

4. Restart the dev server. External sprites are used when listed; everything else stays procedural.

## How hybrid mode works

- **Procedural layer** — always available, infinite variety, palette swap + equipment
- **External layer** — used when manifest entry exists for that archetype
- **Recolor** — procedural system can still tint external sprites via Phaser `setTint` in future

Procedural sprites are LPC-inspired: body → pants → torso → armor → head → hair → weapon → cape.
