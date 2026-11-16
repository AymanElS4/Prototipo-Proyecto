import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { Award, BookOpen, X, CheckCircle, Sparkles } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';

export const HistoryModal: React.FC = () => {
  const { isHistoryOpen, setIsHistoryOpen, history } = useGame();
  const { player } = usePlayer();
  const [activeTab, setActiveTab] = useState<'badges' | 'history'>('badges');

  if (!isHistoryOpen) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '16px'
    }}>
      <div 
        className="rpg-box"
        style={{
          width: '100%',
          maxWidth: '380px',
          maxHeight: '90%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fffbeb',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '3px solid #b45309',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fef3c7'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#b45309" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#78350f' }}>
              Bitácora del Guía
            </h2>
          </div>
          <button
            onClick={() => {
              sfx.playClick();
              setIsHistoryOpen(false);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#78350f',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('badges');
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'badges' ? '#fffbeb' : 'transparent',
              borderBottom: activeTab === 'badges' ? '3px solid #f59e0b' : 'none',
              fontWeight: 700,
              fontSize: '12px',
              color: activeTab === 'badges' ? '#78350f' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Award size={15} />
            <span>Insignias ({player.badges.length})</span>
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('history');
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: activeTab === 'history' ? '#fffbeb' : 'transparent',
              borderBottom: activeTab === 'history' ? '3px solid #f59e0b' : 'none',
              fontWeight: 700,
              fontSize: '12px',
              color: activeTab === 'history' ? '#78350f' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={15} />
            <span>Actividades ({history.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          padding: '14px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {activeTab === 'badges' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {player.badges.map(b => (
                <div 
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #fde68a',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                    border: '2px solid #f59e0b'
                  }}>
                    {b.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#78350f' }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.3' }}>
                      {b.description}
                    </div>
                  </div>
                </div>
              ))}

              {/* Show Inventory items if any */}
              {player.inventory.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#78350f', marginBottom: '6px' }}>
                    🎒 Objetos Clave Obtenidos:
                  </div>
                  {player.inventory.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #10b981',
                        borderRadius: '6px',
                        marginBottom: '6px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#065f46' }}>{item.name}</div>
                        <div style={{ fontSize: '10px', color: '#047857' }}>{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: '#64748b', fontSize: '13px' }}>
                  Aún no has completado actividades pedagógicas en este módulo. ¡Explora el pueblo y habla con los turistas!
                </div>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      border: '2px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>{item.title}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{item.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#475569' }}>
                      <span>Puntaje: <strong>{item.score}/{item.maxScore}</strong></span>
                      <span>•</span>
                      <span>Intentos fallidos: <strong>{item.mistakesCount}</strong></span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} />
                      <span>{item.notes}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 14px', backgroundColor: '#fef3c7', borderTop: '2px solid #fde68a' }}>
          <button
            onClick={() => {
              sfx.playClick();
              setIsHistoryOpen(false);
            }}
            className="rpg-btn"
            style={{ width: '100%', padding: '8px', fontSize: '12px' }}
          >
            Cerrar Bitácora
          </button>
        </div>
      </div>
    </div>
  );
};
