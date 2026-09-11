import { QUESTS, QuestDef } from '../data/quests';

export interface ActiveQuest {
  def: QuestDef;
  progress: number[];
  completed: boolean;
}

export class QuestSystem {
  private active: ActiveQuest[] = [];
  private completed: string[] = [];

  startQuest(questId: string): boolean {
    if (this.completed.includes(questId)) return false;
    if (this.active.some((q) => q.def.id === questId)) return false;

    const def = QUESTS[questId];
    if (!def) return false;

    this.active.push({
      def,
      progress: def.objectives.map(() => 0),
      completed: false,
    });
    return true;
  }

  updateKill(enemyId: string): QuestDef | null {
    return this.updateObjective('kill', enemyId);
  }

  updateGather(itemId: string): QuestDef | null {
    return this.updateObjective('gather', itemId);
  }

  private updateObjective(type: string, target: string): QuestDef | null {
    for (const quest of this.active) {
      if (quest.completed) continue;
      for (let i = 0; i < quest.def.objectives.length; i++) {
        const obj = quest.def.objectives[i];
        if (obj.type === type && obj.target === target && quest.progress[i] < obj.count) {
          quest.progress[i]++;
          if (this.isQuestComplete(quest)) {
            quest.completed = true;
            this.completed.push(quest.def.id);
          }
          return quest.def;
        }
      }
    }
    return null;
  }

  private isQuestComplete(quest: ActiveQuest): boolean {
    return quest.def.objectives.every((obj, i) => quest.progress[i] >= obj.count);
  }

  getActiveQuests(): ActiveQuest[] {
    return this.active.filter((q) => !q.completed);
  }

  getCompletedQuests(): ActiveQuest[] {
    return this.active.filter((q) => q.completed);
  }

  getObjectiveText(quest: ActiveQuest, index: number): string {
    const obj = quest.def.objectives[index];
    const progress = quest.progress[index];
    return obj.description.replace(/\(\d+\/\d+\)/, `(${progress}/${obj.count})`);
  }
}
