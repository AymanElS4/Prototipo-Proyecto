import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameScreen, GameSettings, ActivityHistoryItem, ModuleInfo } from '../types/game';
import { MODULES_DATA } from '../data/modulesData';
import { sfx } from '../utils/audioSynthesis';

interface FeedbackModalState {
  isOpen: boolean;
  title: string;
  message: string;
  englishPhrase?: string;
  isSuccess: boolean;
  tip?: string;
  onRetry?: () => void;
  onContinue?: () => void;
}

interface GameContextType {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  modules: ModuleInfo[];
  currentModuleId: number;
  setCurrentModuleId: (id: number) => void;
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  toggleOnlineMode: () => void;
  history: ActivityHistoryItem[];
  addHistoryRecord: (item: Omit<ActivityHistoryItem, 'id' | 'timestamp'>) => void;
  feedbackModal: FeedbackModalState | null;
  showFeedback: (modal: Omit<FeedbackModalState, 'isOpen'>) => void;
  closeFeedback: () => void;
  isPauseOpen: boolean;
  setIsPauseOpen: (open: boolean) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  resetAllGameProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: false, // Disabled by default for instant performance
  sfxVolume: 0.5,
  textSpeed: 'fast',
  isOnlineMode: true,
  phoneFrameView: true
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreenState] = useState<GameScreen>('main_menu');

  const [modules, setModules] = useState<ModuleInfo[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_modules');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === MODULES_DATA.length) {
          return parsed;
        }
      }
    } catch {}
    return MODULES_DATA;
  });

  const [currentModuleId, setCurrentModuleId] = useState<number>(1);

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('rpg_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState<ActivityHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('rpg_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState | null>(null);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('rpg_modules', JSON.stringify(modules));
    } catch {}
  }, [modules]);

  useEffect(() => {
    try {
      localStorage.setItem('rpg_settings', JSON.stringify(settings));
      sfx.setEnabled(settings.soundEnabled);
      sfx.setVolume(settings.sfxVolume);
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('rpg_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // INSTANT navigation: changes state immediately without waiting for anything
  const setScreen = (newScreen: GameScreen) => {
    setScreenState(newScreen);
    sfx.playClick();
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleOnlineMode = () => {
    sfx.playClick();
    setSettings(prev => ({ ...prev, isOnlineMode: !prev.isOnlineMode }));
  };

  const addHistoryRecord = (item: Omit<ActivityHistoryItem, 'id' | 'timestamp'>) => {
    const record: ActivityHistoryItem = {
      ...item,
      id: 'hist_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory(prev => [record, ...prev]);
  };

  const showFeedback = (modal: Omit<FeedbackModalState, 'isOpen'>) => {
    if (modal.isSuccess) {
      sfx.playSuccess();
    } else {
      sfx.playError();
    }
    setFeedbackModal({ ...modal, isOpen: true });
  };

  const closeFeedback = () => {
    sfx.playClick();
    setFeedbackModal(null);
  };

  const resetAllGameProgress = () => {
    try {
      localStorage.removeItem('rpg_modules');
      localStorage.removeItem('rpg_player');
      localStorage.removeItem('rpg_quest');
      localStorage.removeItem('rpg_history');
    } catch {}
    setModules(MODULES_DATA);
    setHistory([]);
    setScreenState('main_menu');
    setIsPauseOpen(false);
    window.location.reload();
  };

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        modules,
        currentModuleId,
        setCurrentModuleId,
        settings,
        updateSettings,
        toggleOnlineMode,
        history,
        addHistoryRecord,
        feedbackModal,
        showFeedback,
        closeFeedback,
        isPauseOpen,
        setIsPauseOpen,
        isHistoryOpen,
        setIsHistoryOpen,
        resetAllGameProgress
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
