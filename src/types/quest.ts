import { InventoryItem } from './player';

export type QuestStatus = 'not_started' | 'in_progress' | 'ready_to_turn_in' | 'completed';

export interface QuestStep {
  id: string;
  instruction: string;
  targetNpcOrObject?: string;
  isCompleted: boolean;
}

export interface Quest {
  id: string;
  title: string;
  giverName: string;
  description: string;
  status: QuestStatus;
  currentStepIndex: number;
  steps: QuestStep[];
  rewardXp: number;
  rewardCoins: number;
  rewardItem?: InventoryItem;
  cosmeticReward?: InventoryItem;
}
