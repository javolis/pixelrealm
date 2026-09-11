# PixelRealm

A 2D 8-bit pixel RPG blending **RuneScape**, **Terraria**, **D&D**, and **Wynncraft**.

## Features

- **Top-down exploration** — Procedurally generated tile world with grass, water, trees, ores, and a starter village
- **Three classes** — Warrior, Mage, Archer with D&D-style stats (STR, DEX, CON, INT, WIS, CHA)
- **RuneScape-style skills** — Attack, Defence, Mining, Woodcutting, Magic, Ranged, Hitpoints with XP and leveling
- **Combat** — Fight goblins, skeletons, and dark mages; enemies respawn and chase you
- **Gathering** — Mine rocks, copper, iron; chop trees for logs
- **Quests** — Accept quests from NPCs, track progress, earn rewards
- **Inventory & gold** — Collect resources and loot

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| Space / Click | Attack |
| Click on resource | Mine / Chop |
| E | Interact with NPCs |
| I | Toggle inventory |
| Q | Toggle quest log |

## Run Locally

```bash
npm install
npm run dev
```

Opens in your browser at `http://localhost:5173`.

## Build for Production

```bash
npm run build
npm run preview
```

The `dist/` folder can be deployed to any static host, or wrapped with **Capacitor** / **Tauri** for mobile and desktop apps.

## Tech Stack

- [Phaser 3](https://phaser.io/) — 2D game engine
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — Dev server and bundler

## Roadmap

- [ ] Pixel art sprite sheets
- [ ] Multiplayer / online world (Wynncraft-style)
- [ ] More classes, spells, and dungeons
- [ ] Crafting and equipment
- [ ] Save/load character progress
- [ ] Mobile touch controls
