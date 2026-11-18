import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerState, PlayerCustomization, InventoryItem, Badge } from '../types/player';
import { sfx } from '../utils/audioSynthesis';
import { canMoveTo } from '../utils/collision';

interface PlayerContextType {
  player: PlayerState;
  updateCustomization: (custom: Partial<PlayerCustomization>) => void;
  setPosition: (x: number, y: number, direction?: PlayerState['direction']) => void;
  moveBy: (dx: number, dy: number, dir: PlayerState['direction']) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addItem: (item: InventoryItem) => void;
  hasItem: (itemId: string) => boolean;
  unlockBadge: (badge: Badge) => void;
  equipHat: (hat: PlayerCustomization['hat']) => void;
}

const DEFAULT_PLAYER: PlayerState = {
  customization: {
    name: 'Guía Inti',
    skinTone: '#ffd7ba',
    hairStyle: 'short',
    hairColor: '#271c19',
    outfitColor: '#b91c1c',
    hat: 'chullo'
  },
  x: 200,
  y: 300,
  direction: 'up',
  isMoving: false,
  level: 1,
  xp: 150,
  coins: 50,
  inventory: [],
  badges: [
    {
      id: 'novice_guide',
      title: 'Guía Principiante',
      description: 'Llegaste a San Pedro de las Nubes con ganas de aprender inglés.',
      icon: '🌱'
    }
  ],
  completedActivities: []
};

const isPlayerDirection = (direction: unknown): direction is PlayerState['direction'] =>
  direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const saved = localStorage.getItem('rpg_player');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.customization && parsed.inventory) {
          return {
            ...DEFAULT_PLAYER,
            ...parsed,
            direction: isPlayerDirection(parsed.direction) ? parsed.direction : DEFAULT_PLAYER.direction
          };
        }
      }
    } catch {}
    return DEFAULT_PLAYER;
  });

  useEffect(() => {
    try {
      localStorage.setItem('rpg_player', JSON.stringify(player));
    } catch {}
  }, [player]);

  const updateCustomization = (custom: Partial<PlayerCustomization>) => {
    try { sfx.playClick(); } catch {}
    setPlayer(prev => ({
      ...prev,
      customization: { ...prev.customization, ...custom }
    }));
  };

  const setPosition = (x: number, y: number, direction?: PlayerState['direction']) => {
    const targetX = Math.round(x);
    const targetY = Math.round(y);
    if (canMoveTo(targetX, targetY)) {
      setPlayer(prev => ({
        ...prev,
        x: targetX,
        y: targetY,
        direction: direction || prev.direction
      }));
    }
  };

  const moveBy = (dx: number, dy: number, dir: PlayerState['direction']) => {
    setPlayer(prev => {
      const nextX = prev.x + dx;
      const nextY = prev.y + dy;

      // Check full collision first
      if (canMoveTo(nextX, nextY)) {
        return {
          ...prev,
          x: nextX,
          y: nextY,
          direction: dir,
          isMoving: true
        };
      }

      // Slide along axes if diagonal or partial block
      if (dx !== 0 && canMoveTo(nextX, prev.y)) {
        return {
          ...prev,
          x: nextX,
          direction: dir,
          isMoving: true
        };
      }
      if (dy !== 0 && canMoveTo(prev.x, nextY)) {
        return {
          ...prev,
          y: nextY,
          direction: dir,
          isMoving: true
        };
      }

      // Blocked by collision, only change face direction
      return {
        ...prev,
        direction: dir,
        isMoving: false
      };
    });
  };

  const addXp = (amount: number) => {
    try { sfx.playLevelUp(); } catch {}
    setPlayer(prev => {
      const newXp = prev.xp + amount;
      const nextLevel = Math.floor(newXp / 300) + 1;
      return {
        ...prev,
        xp: newXp,
        level: nextLevel
      };
    });
  };

  const addCoins = (amount: number) => {
    try { sfx.playCoin(); } catch {}
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  const addItem = (item: InventoryItem) => {
    try { sfx.playSuccess(); } catch {}
    setPlayer(prev => {
      if (prev.inventory.some(i => i.id === item.id)) return prev;
      return {
        ...prev,
        inventory: [...prev.inventory, item]
      };
    });
  };

  const hasItem = (itemId: string) => {
    return player.inventory.some(i => i.id === itemId);
  };

  const unlockBadge = (badge: Badge) => {
    try { sfx.playSuccess(); } catch {}
    setPlayer(prev => {
      if (prev.badges.some(b => b.id === badge.id)) return prev;
      return {
        ...prev,
        badges: [
          ...prev.badges,
          { ...badge, unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      };
    });
  };

  const equipHat = (hat: PlayerCustomization['hat']) => {
    try { sfx.playClick(); } catch {}
    setPlayer(prev => ({
      ...prev,
      customization: { ...prev.customization, hat }
    }));
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        updateCustomization,
        setPosition,
        moveBy,
        addXp,
        addCoins,
        addItem,
        hasItem,
        unlockBadge,
        equipHat
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
