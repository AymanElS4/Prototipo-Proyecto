import React, { useEffect } from 'react';
import { useQuest } from '../../context/QuestContext';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { Sparkles, Key, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';
import confetti from 'canvas-confetti';

export const ModuleOneCompleteModal: React.FC = () => {
  const { activeActivityModal, setActiveActivityModal, quest, completeModuleOne } = useQuest();
  const { setScreen, setIsHistoryOpen } = useGame();
  const { addItem, equipHat, unlockBadge } = usePlayer();

  const isVisible = activeActivityModal === 'module_complete';

  useEffect(() => {
    if (isVisible) {
      sfx.playLevelUp();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });

      // Deliver mandatory rewards to player
      if (quest.rewardItem) {
        addItem(quest.rewardItem);
      }
      if (quest.cosmeticReward) {
        addItem(quest.cosmeticReward);
        unlockBadge({
          id: 'valle_protector',
          title: 'Protector de San Pedro',
          description: 'Completaste el Módulo 1 y salvaste al turista John.',
          icon: '🗝️'
        });
      }
      completeModuleOne();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 170,
      padding: '16px'
    }}>
      <div 
        className="rpg-box animate-float"
        style={{
          width: '100%',
          maxWidth: '360px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '14px',
          backgroundColor: '#fffbeb',
          border: '4px solid #f59e0b'
        }}
      >
        {/* Banner Trophy */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#fef3c7',
          border: '4px solid #d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          boxShadow: '0 6px 12px rgba(245, 158, 11, 0.4)'
        }}>
          🏆
        </div>

        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#15803d',
            backgroundColor: '#dcfce7',
            padding: '3px 12px',
            borderRadius: '12px',
            textTransform: 'uppercase'
          }}>
            ¡Módulo 1 Completado con Éxito!
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#78350f', marginTop: '6px' }}>
            San Pedro de las Nubes
          </h2>
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', lineHeight: '1.4' }}>
            Has rescatado a Mr. John, recuperado su equipaje mediante indicaciones en inglés y descifrado las palabras clave de su libreta.
          </p>
        </div>

        {/* Mandatory Rewards Showcase */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Key Reward */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '2px solid #f59e0b',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              border: '2px solid #b45309',
              flexShrink: 0
            }}>
              🗝️
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#b45309' }}>
                ¡Llave Dorada de San Pedro!
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Recompensa obligatoria para abrir el acceso a los próximos valles.
              </div>
            </div>
          </div>

          {/* Cosmetic Reward */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '2px solid #10b981',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            textAlign: 'left'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              border: '2px solid #059669',
              flexShrink: 0
            }}>
              👑
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857' }}>
                Chullo Sagrado de Guía Experto
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Accesorio cosmético tradicional desbloqueado para tu avatar.
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '6px' }}>
          <button
            onClick={() => {
              sfx.playSuccess();
              equipHat('chullo_dorado');
              setActiveActivityModal('none');
              setScreen('world_map');
            }}
            className="rpg-btn rpg-btn-green"
            style={{ width: '100%', padding: '10px', fontSize: '12px' }}
          >
            <Sparkles size={16} />
            <span>Equipar Chullo y Salir al Mapa</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setActiveActivityModal('none');
              setIsHistoryOpen(true);
            }}
            className="rpg-btn rpg-btn-secondary"
            style={{ width: '100%', padding: '8px', fontSize: '11px' }}
          >
            <Award size={14} />
            <span>Ver Logros en Bitácora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
