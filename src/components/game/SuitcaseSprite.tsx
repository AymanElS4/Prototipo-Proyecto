import React from 'react';
import { SuitcaseItem } from '../../types/activities';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { sfx } from '../../utils/audioSynthesis';
import confetti from 'canvas-confetti';

interface SuitcaseSpriteProps {
  suitcase: SuitcaseItem;
}

export const SuitcaseSprite: React.FC<SuitcaseSpriteProps> = ({ suitcase }) => {
  const { hasFoundBackpack, setHasFoundBackpack, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addItem, unlockBadge, addXp } = usePlayer();

  if (hasFoundBackpack && suitcase.isCorrect) {
    return null;
  }

  const renderShapeIcon = (shape: SuitcaseItem['shape']) => {
    switch (shape) {
      case 'circle': return '⚪';
      case 'square': return '⬜';
      case 'triangle': return '🔺';
      case 'star': return '⭐';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (suitcase.isCorrect) {
      try {
        sfx.playSuccess();
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 }
        });
      } catch {}

      setHasFoundBackpack(true);
      advanceQuestStep();
      addXp(100);

      addItem({
        id: 'johns_blue_backpack',
        name: 'Mochila Azul de John',
        description: 'La maleta perdida con un círculo azul en el frente. Pertenece a Mr. John.',
        icon: '🎒',
        category: 'quest'
      });

      unlockBadge({
        id: 'eagle_eye',
        title: 'Ojo de Halcón',
        description: 'Encontraste la maleta exacta solicitada en inglés ("blue backpack with a circle").',
        icon: '🦅'
      });

      addHistoryRecord({
        activityType: 'suitcase_search',
        title: 'Búsqueda de Equipaje Perdido',
        score: 100,
        maxScore: 100,
        mistakesCount: 0,
        completed: true,
        notes: 'Identificación correcta de: "Blue backpack with a circle".'
      });

      showFeedback({
        title: '¡Maleta Correcta Encontrada!',
        message: suitcase.feedbackEs,
        englishPhrase: 'Blue backpack with a circle',
        isSuccess: true,
        tip: 'Ahora ve a la plaza y habla con Mr. John para entregársela y continuar con la aventura.',
        onContinue: () => {
          openDialogue('john', 'bag_found');
        }
      });
    } else {
      try { sfx.playError(); } catch {}
      showFeedback({
        title: '¡Maleta Equivocada!',
        message: suitcase.feedbackEs,
        englishPhrase: `${suitcase.colorEn} backpack with a ${suitcase.shapeEn}`,
        isSuccess: false,
        tip: 'Mr. John necesita: "blue backpack with a circle". Verifica tanto el color (blue) como la figura (circle).'
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="animate-float"
      title={`Examinar equipaje: ${suitcase.colorEn} with ${suitcase.shapeEn}`}
      style={{
        position: 'absolute',
        left: `${suitcase.x}px`,
        top: `${suitcase.y}px`,
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: suitcase.color,
        border: '3px solid #ffffff',
        boxShadow: '0 6px 12px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 15
      }}
    >
      {/* Top Handle of luggage */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        width: '16px',
        height: '6px',
        border: '2px solid #ffffff',
        borderBottom: 'none',
        borderRadius: '4px 4px 0 0'
      }} />

      {/* Center Shape */}
      <span style={{ fontSize: '18px', lineHeight: 1 }}>
        {renderShapeIcon(suitcase.shape)}
      </span>

      {/* Touch indicator badge */}
      <span style={{
        position: 'absolute',
        bottom: '-14px',
        backgroundColor: 'rgba(0,0,0,0.85)',
        color: '#ffffff',
        fontSize: '9px',
        fontWeight: 800,
        padding: '1px 5px',
        borderRadius: '4px',
        whiteSpace: 'nowrap'
      }}>
        Tocar
      </span>
    </div>
  );
};
