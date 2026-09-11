import { CharacterDNA, generateDNA, breedDNA } from './CharacterDNA';

const STORAGE_KEY = 'pixelrealm-character-registry';

/**
 * Remembers every character generated in this browser session / save.
 * New characters can inherit traits from similar archetypes already seen.
 */
export class CharacterRegistry {
  private static instance: CharacterRegistry;
  private registry: Record<string, CharacterDNA> = {};

  private constructor() {
    this.load();
  }

  static getInstance(): CharacterRegistry {
    if (!CharacterRegistry.instance) {
      CharacterRegistry.instance = new CharacterRegistry();
    }
    return CharacterRegistry.instance;
  }

  getOrCreate(seed: string, archetypeId: string): CharacterDNA {
    const key = `${archetypeId}:${seed}`;
    if (this.registry[key]) {
      return this.registry[key];
    }

    const similar = Object.entries(this.registry).filter(([k]) =>
      k.startsWith(`${archetypeId}:`)
    );

    let dna: CharacterDNA;
    if (similar.length >= 2) {
      const parents = similar.slice(-2).map(([, v]) => v);
      dna = breedDNA(parents[0], parents[1], seed, archetypeId);
    } else if (similar.length === 1) {
      dna = breedDNA(similar[0][1], similar[0][1], seed, archetypeId);
    } else {
      dna = generateDNA(seed, archetypeId);
    }

    this.registry[key] = dna;
    this.save();
    return dna;
  }

  getAll(): Record<string, CharacterDNA> {
    return { ...this.registry };
  }

  count(): number {
    return Object.keys(this.registry).length;
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.registry = JSON.parse(raw);
    } catch {
      this.registry = {};
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.registry));
    } catch {
      // Storage full or unavailable — continue without persisting
    }
  }
}
