import React from 'react';
import { NPCData } from '../../types/dialogue';
import { useQuest } from '../../context/QuestContext';
import { sfx } from '../../utils/audioSynthesis';
import { PixelImage } from '../ui/PixelImage';

interface NPCProps {
  npc: NPCData;
  isNearby: boolean;
}

export const NPC: React.FC<NPCProps> = ({ npc, isNearby }) => {
  const { openDialogue } = useQuest();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { sfx.playClick(); } catch {}
    openDialogue(npc.id);
  };

  return (
    <div
      onClick={handleClick}
      title={`Hablar con ${npc.name}`}
      style={{
        position: 'absolute',
        left: `${npc.x}px`,
        top: `${npc.y}px`,
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 20
      }}
    >
      {/* Interaction prompt floating above */}
      {isNearby && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#f59e0b',
            color: '#78350f',
            border: '2px solid #ffffff',
            borderRadius: '12px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 800,
            boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          [E] Toca para hablar
        </div>
      )}

      {/* NPC Sprite Avatar without rigid border box */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))',
          transition: 'transform 0.15s ease'
        }}
      >
        {npc.spriteImage ? (
          <PixelImage src={npc.spriteImage} alt={npc.name} width={22} height={44} />
        ) : (
          <span style={{ fontSize: '26px' }}>{npc.avatarIcon}</span>
        )}
      </div>

      {/* Name Label */}
      <div style={{
        marginTop: '2px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        color: '#ffffff',
        padding: '1px 6px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {npc.name.split(' ')[0]}
      </div>
    </div>
  );
};
