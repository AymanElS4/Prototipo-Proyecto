export type GameScreen = 
  | 'main_menu' 
  | 'customizer' 
  | 'world_map' 
  | 'town_map';

export type ActivityType = 
  | 'suitcase_search' 
  | 'word_search' 
  | 'multiple_choice' 
  | 'listening_speaking';

export interface ModuleInfo {
  id: number;
  title: string;
  name: string;
  subtitle: string;
  isUnlocked: boolean;
  stars: number;
  maxStars: number;
  description: string;
  thumbnail: string;
  locationName: string;
  topics: string[];
}

export interface ActivityHistoryItem {
  id: string;
  timestamp: string;
  activityType: ActivityType;
  title: string;
  score: number;
  maxScore: number;
  mistakesCount: number;
  completed: boolean;
  notes: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  sfxVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast';
  isOnlineMode: boolean;
  phoneFrameView: boolean;
}
