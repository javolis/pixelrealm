import { SkillName, levelFromXp, xpForLevel } from '../data/classes';

export class SkillSystem {
  private skills: Record<SkillName, number> = {
    attack: 0,
    defence: 0,
    mining: 0,
    woodcutting: 0,
    magic: 0,
    ranged: 0,
    hitpoints: 1154, // start at level 10
  };

  getXp(skill: SkillName): number {
    return this.skills[skill];
  }

  getLevel(skill: SkillName): number {
    return levelFromXp(this.skills[skill]);
  }

  addXp(skill: SkillName, amount: number): { leveledUp: boolean; newLevel: number } {
    const oldLevel = this.getLevel(skill);
    this.skills[skill] += amount;
    const newLevel = this.getLevel(skill);
    return { leveledUp: newLevel > oldLevel, newLevel };
  }

  getProgress(skill: SkillName): number {
    const level = this.getLevel(skill);
    const currentXp = this.skills[skill];
    const levelStart = xpForLevel(level - 1);
    const levelEnd = xpForLevel(level);
    return (currentXp - levelStart) / (levelEnd - levelStart);
  }

  getAllSkills(): Record<SkillName, { xp: number; level: number }> {
    const result = {} as Record<SkillName, { xp: number; level: number }>;
    for (const skill of Object.keys(this.skills) as SkillName[]) {
      result[skill] = { xp: this.skills[skill], level: this.getLevel(skill) };
    }
    return result;
  }
}
