import { ITEMS } from '../data/items';

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export class InventorySystem {
  private slots: InventorySlot[] = [];
  readonly maxSlots = 28;

  addItem(itemId: string, quantity = 1): boolean {
    const def = ITEMS[itemId];
    if (!def) return false;

    if (def.stackable) {
      const existing = this.slots.find((s) => s.itemId === itemId);
      if (existing) {
        existing.quantity += quantity;
        return true;
      }
    }

    if (this.slots.length >= this.maxSlots) return false;
    this.slots.push({ itemId, quantity });
    return true;
  }

  removeItem(itemId: string, quantity = 1): boolean {
    const idx = this.slots.findIndex((s) => s.itemId === itemId);
    if (idx === -1) return false;

    const slot = this.slots[idx];
    if (slot.quantity <= quantity) {
      this.slots.splice(idx, 1);
    } else {
      slot.quantity -= quantity;
    }
    return true;
  }

  countItem(itemId: string): number {
    return this.slots
      .filter((s) => s.itemId === itemId)
      .reduce((sum, s) => sum + s.quantity, 0);
  }

  getSlots(): InventorySlot[] {
    return [...this.slots];
  }

  useItem(itemId: string): { success: boolean; effect?: string } {
    const def = ITEMS[itemId];
    if (!def || def.type !== 'consumable') {
      return { success: false };
    }
    if (!this.removeItem(itemId, 1)) {
      return { success: false };
    }
    if (itemId === 'bread') {
      return { success: true, effect: 'heal:20' };
    }
    return { success: true };
  }
}
