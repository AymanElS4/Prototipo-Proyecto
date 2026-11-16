import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quest } from '../types/quest';

interface QuestContextType {
  quest: Quest;
  suitcasesVisible: boolean;
  setSuitcasesVisible: (visible: boolean) => void;
  hasFoundBackpack: boolean;
  setHasFoundBackpack: (found: boolean) => void;
  activeActivityModal: 'none' | 'activity_1_intro' | 'activity_2_intro' | 'word_search' | 'activity_3_intro' | 'sentence_matching' | 'listening_speaking' | 'module_complete';
  setActiveActivityModal: (modal: 'none' | 'activity_1_intro' | 'activity_2_intro' | 'word_search' | 'activity_3_intro' | 'sentence_matching' | 'listening_speaking' | 'module_complete') => void;
  activeDialogueNpcId: string | null;
  activeDialogueNodeId: string | null;
  openDialogue: (npcId: string, nodeId?: string) => void;
  closeDialogue: () => void;
  advanceQuestStep: () => void;
  completeModuleOne: () => void;
  restartLevelOne: () => void;
}

const INITIAL_QUEST: Quest = {
  id: 'rescue_johns_bag',
  title: 'La Maleta Perdida de John',
  giverName: 'Mr. John',
  description: 'Ayuda al turista extranjero a localizar su equipaje y comprender el vocabulario clave en inglés.',
  status: 'not_started',
  currentStepIndex: 0,
  steps: [
    {
      id: 'step_talk_john',
      instruction: 'Habla con Mr. John en el aeropuerto para saber qué necesita.',
      targetNpcOrObject: 'john',
      isCompleted: false
    },
    {
      id: 'step_search_bag',
      instruction: 'Encuentra la "blue backpack with a circle" en la faja de equipajes.',
      targetNpcOrObject: 'suitcase-blue-circle',
      isCompleted: false
    },
    {
      id: 'step_return_bag',
      instruction: 'Regresa con Mr. John y entrégale su mochila azul.',
      targetNpcOrObject: 'john',
      isCompleted: false
    },
    {
      id: 'step_word_search',
      instruction: 'Resuelve la Sopa de Letras con las palabras clave (Actividad 2).',
      targetNpcOrObject: 'word_search',
      isCompleted: false
    },
    {
      id: 'step_sentence_matching',
      instruction: 'Une con líneas los personajes, profesiones y lugares (Actividad 3).',
      targetNpcOrObject: 'sentence_matching',
      isCompleted: false
    },
    {
      id: 'step_speaking',
      instruction: 'Practica la expresión oral en la sección de Speaking (Actividad 4).',
      targetNpcOrObject: 'listening_speaking',
      isCompleted: false
    },
    {
      id: 'step_receive_rewards',
      instruction: 'Habla con Don Mateo para recibir la Llave Dorada del Valle.',
      targetNpcOrObject: 'mateo',
      isCompleted: false
    }
  ],
  rewardXp: 250,
  rewardCoins: 100,
  rewardItem: {
    id: 'golden_key_module1',
    name: 'Llave Dorada de San Pedro',
    description: 'Antigua llave forjada en bronce y oro que desbloquea los caminos hacia los siguientes valles.',
    icon: '🗝️',
    category: 'key'
  },
  cosmeticReward: {
    id: 'chullo_dorado',
    name: 'Chullo Sagrado de Guía Experto',
    description: 'Prenda tejida con hilos dorados que distingue a los mejores orientadores turísticos.',
    icon: '🧶',
    category: 'cosmetic'
  }
};

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quest, setQuest] = useState<Quest>(() => {
    try {
      const saved = localStorage.getItem('rpg_quest');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.steps) && parsed.steps.length === INITIAL_QUEST.steps.length) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_QUEST;
  });

  const [suitcasesVisible, setSuitcasesVisible] = useState<boolean>(() => {
    return (quest?.currentStepIndex || 0) === 1;
  });

  const [hasFoundBackpack, setHasFoundBackpack] = useState<boolean>(false);

  const [activeActivityModal, setActiveActivityModal] = useState<
    'none' | 'activity_1_intro' | 'activity_2_intro' | 'word_search' | 'activity_3_intro' | 'sentence_matching' | 'listening_speaking' | 'module_complete'
  >('none');

  const [activeDialogueNpcId, setActiveDialogueNpcId] = useState<string | null>(null);
  const [activeDialogueNodeId, setActiveDialogueNodeId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('rpg_quest', JSON.stringify(quest));
    } catch {}
  }, [quest]);

  // Restart level 1 cleanly so the user can replay it without getting stuck
  const restartLevelOne = () => {
    setQuest(INITIAL_QUEST);
    setSuitcasesVisible(false);
    setHasFoundBackpack(false);
    setActiveActivityModal('none');
    setActiveDialogueNpcId(null);
    setActiveDialogueNodeId(null);
    try {
      localStorage.removeItem('rpg_quest');
    } catch {}
  };

  const openDialogue = (npcId: string, nodeId?: string) => {
    setActiveDialogueNpcId(npcId);
    if (nodeId) {
      setActiveDialogueNodeId(nodeId);
    } else {
      const stepIdx = quest?.currentStepIndex || 0;
      if (npcId === 'john') {
        if (stepIdx === 0) {
          setActiveDialogueNodeId('start');
        } else if (stepIdx === 1) {
          setActiveDialogueNodeId('waiting_for_bag');
        } else if (stepIdx === 2) {
          setActiveDialogueNodeId('bag_found');
        } else if (stepIdx === 3) {
          setActiveDialogueNodeId('word_search_intro');
        } else if (stepIdx === 4) {
          setActiveDialogueNodeId('word_search_done');
        } else if (stepIdx === 5) {
          setActiveDialogueNodeId('matching_done');
        } else {
          setActiveDialogueNodeId('start');
        }
      } else if (npcId === 'mateo') {
        if (stepIdx >= 6) {
          setActiveDialogueNodeId('mateo_reward');
        } else {
          setActiveDialogueNodeId('start');
        }
      } else {
        setActiveDialogueNodeId('start');
      }
    }
  };

  const closeDialogue = () => {
    setActiveDialogueNpcId(null);
    setActiveDialogueNodeId(null);
  };

  const advanceQuestStep = () => {
    setQuest(prev => {
      const nextIndex = Math.min(prev.steps.length - 1, prev.currentStepIndex + 1);
      const updatedSteps = prev.steps.map((s, idx) => ({
        ...s,
        isCompleted: idx < nextIndex
      }));

      const newStatus = nextIndex >= prev.steps.length - 1 ? 'ready_to_turn_in' : 'in_progress';
      return {
        ...prev,
        currentStepIndex: nextIndex,
        steps: updatedSteps,
        status: newStatus
      };
    });
  };

  const completeModuleOne = () => {
    setQuest(prev => ({
      ...prev,
      status: 'completed',
      steps: prev.steps.map(s => ({ ...s, isCompleted: true }))
    }));
  };

  return (
    <QuestContext.Provider
      value={{
        quest,
        suitcasesVisible,
        setSuitcasesVisible,
        hasFoundBackpack,
        setHasFoundBackpack,
        activeActivityModal,
        setActiveActivityModal,
        activeDialogueNpcId,
        activeDialogueNodeId,
        openDialogue,
        closeDialogue,
        advanceQuestStep,
        completeModuleOne,
        restartLevelOne
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) throw new Error('useQuest must be used within QuestProvider');
  return context;
};
