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
  const { setHasFoundBackpack, advanceQuestStep, openDialogue } = useQuest();
  const { showFeedback, addHistoryRecord } = useGame();
  const { addItem, unlockBadge, addXp } = usePlayer();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (suitcase.isCorrect) {
      try {
        sfx.playSuccess();
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setHasFoundBackpack(true);
      advanceQuestStep();
      addXp(100);

      addItem({
        id: 'johns_blue_backpack',
        name: 'John\'s Blue Backpack',
        description: 'Blue backpack with a cross emblem in the center.',
        icon: '🎒',
        category: 'quest'
      });

      unlockBadge({
        id: 'eagle_eye',
        title: 'Eagle Eye',
        description: 'You found the exact item: "blue backpack with a cross".',
        icon: '🦅'
      });

      addHistoryRecord({
        activityType: 'suitcase_search',
        title: 'Luggage Search: Airport',
        score: 100,
        maxScore: 100,
        mistakesCount: 0,
        completed: true,
        notes: 'Identified: "Blue backpack with a cross".'
      });

      showFeedback({
        title: '¡BIEN HECHO! / Well done',
        message: 'You found the correct backpack! Talk to Mr. John to return it.',
        englishPhrase: 'Blue backpack with a cross',
        isSuccess: true,
        tip: 'Now approach Mr. John and press TALK to return it and continue.',
        onContinue: () => {
          openDialogue('john', 'bag_found');
        }
      });
    } else {
      try { sfx.playError(); } catch {}
      showFeedback({
        title: '¡Inténtalo de nuevo! / Try Again!',
        message: `This is a ${suitcase.colorEn} backpack with a ${suitcase.shapeEn}. Mr. John needs a blue backpack with a cross.`,
        englishPhrase: `${suitcase.colorEn} backpack with a ${suitcase.shapeEn}`,
        isSuccess: false,
        tip: 'Remember: look for the "blue backpack with a cross" on the carousel.'
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="animate-float"
      title={`Check luggage: ${suitcase.colorEn} with ${suitcase.shapeEn}`}
      style={{
        position: 'absolute',
        left: `${suitcase.x}px`,
        top: `${suitcase.y}px`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 25,
        userSelect: 'none'
      }}
    >
      {/* RPG Pixel Art Backpack Sprite */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.15s ease'
      }}>
        <img
          src={suitcase.spriteImg}
          alt={`Backpack ${suitcase.colorEn} with ${suitcase.shapeEn}`}
          style={{
            width: '44px',
            height: '44px',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.5))'
          }}
        />

        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          border: '1.5px dashed rgba(255, 255, 255, 0.6)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Pill: Touch Backpack */}
      <span style={{
        marginTop: '2px',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        color: '#f8fafc',
        fontSize: '9.5px',
        fontWeight: 900,
        padding: '2px 7px',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
      }}>
        🎒 Touch
      </span>
    </div>
  );
};
