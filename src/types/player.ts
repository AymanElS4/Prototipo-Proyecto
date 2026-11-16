export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'key' | 'cosmetic' | 'quest' | 'collectible';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface PlayerCustomization {
  name: string;
  skinTone: string;
  hairStyle: 'short' | 'curly' | 'braids' | 'ponytail';
  hairColor: string;
  outfitColor: string;
  hat: 'none' | 'montera' | 'chullo' | 'sombrero' | 'gorra' | 'chullo_dorado';
  glasses?: 'none' | 'classic' | 'sunglasses';
  pantsColor?: string;
}

export interface PlayerState {
  customization: PlayerCustomization;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  level: number;
  xp: number;
  coins: number;
  inventory: InventoryItem[];
  badges: Badge[];
  completedActivities: string[];
}
