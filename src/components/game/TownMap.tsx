import React, { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { useQuest } from '../../context/QuestContext';
import { Character } from './Character';
import { NPC } from './NPC';
import { SuitcaseSprite } from './SuitcaseSprite';
import { NPCS_DATA } from '../../data/npcsData';
import { SUITCASES_DATA } from '../../data/suitcasesData';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight as ArrowR, ArrowLeft as ArrowL, MessageCircle, RotateCcw } from 'lucide-react';
import { AIRPORT_ASSETS } from '../../utils/airportAssets';

export const TownMap: React.FC = () => {
  const { setScreen } = useGame();
  const { player, moveBy, setPosition } = usePlayer();
  const { 
    suitcasesVisible, 
    openDialogue, 
    activeDialogueNpcId,
    activeActivityModal,
    restartLevelOne
  } = useQuest();

  const mapRef = useRef<HTMLDivElement>(null);

  // Proximity check for talking to NPCs
  const getNearbyNpcId = () => {
    for (const [id, npc] of Object.entries(NPCS_DATA)) {
      const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
      if (dist < 90) return id;
    }
    return null;
  };

  const nearbyNpcId = getNearbyNpcId();

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeDialogueNpcId || activeActivityModal !== 'none') return;

      const step = 22;
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          moveBy(0, -step, 'up');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          moveBy(0, step, 'down');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          moveBy(-step, 0, 'left');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          moveBy(step, 0, 'right');
          break;
        case 'e':
          e.preventDefault();
          if (nearbyNpcId) {
            openDialogue(nearbyNpcId);
          } else {
            openDialogue('john');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialogueNpcId, activeActivityModal, nearbyNpcId, moveBy, openDialogue]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeDialogueNpcId || activeActivityModal !== 'none') return;
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setPosition(clickX, clickY);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      flex: 1,
      minHeight: '580px',
      backgroundColor: '#0f172a',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Aeropuerto - Interior (Escenario Oficial Nivel 1) */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        style={{
          width: '100%',
          flex: 1,
          minHeight: '520px',
          position: 'relative',
          backgroundImage: `url(${AIRPORT_ASSETS.interiorSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          overflow: 'hidden',
          cursor: 'crosshair',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Interactive Suitcases */}
        {suitcasesVisible && SUITCASES_DATA.map(suitcase => (
          <SuitcaseSprite key={suitcase.id} suitcase={suitcase} />
        ))}

        {/* NPCs positioned inside the airport */}
        {Object.values(NPCS_DATA).map(npc => (
          <NPC key={npc.id} npc={npc} isNearby={nearbyNpcId === npc.id} />
        ))}

        {/* Guía (Personaje Jugable) */}
        <Character player={player} />
      </div>

      {/* Mobile Virtual D-Pad & Action Controls Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        zIndex: 30
      }}>
        {/* Directional Pad */}
        <div style={{
          pointerEvents: 'auto',
          width: '132px',
          height: '132px',
          position: 'relative'
        }}>
          <button
            onClick={() => moveBy(0, -22, 'up')}
            style={{
              position: 'absolute',
              top: 0,
              left: '44px',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #38bdf8',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowUp size={22} />
          </button>
          <button
            onClick={() => moveBy(-22, 0, 'left')}
            style={{
              position: 'absolute',
              top: '44px',
              left: 0,
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #38bdf8',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowL size={22} />
          </button>
          <button
            onClick={() => moveBy(22, 0, 'right')}
            style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #38bdf8',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowR size={22} />
          </button>
          <button
            onClick={() => moveBy(0, 22, 'down')}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '44px',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '2px solid #38bdf8',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowDown size={22} />
          </button>
        </div>

        {/* Action Button: Talk to Tourist or examine */}
        <div style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => {
              if (nearbyNpcId) {
                openDialogue(nearbyNpcId);
              } else {
                openDialogue('john');
              }
            }}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: nearbyNpcId ? '#16a34a' : '#0284c7',
              border: '3px solid #ffffff',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
              transition: 'transform 0.15s'
            }}
          >
            <MessageCircle size={22} />
            <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '2px' }}>
              {nearbyNpcId ? 'HABLAR' : 'TURISTA'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
