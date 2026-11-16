import React from 'react';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Lock, Star, Play } from 'lucide-react';

export const WorldMap: React.FC = () => {
  const { modules, setScreen, setCurrentModuleId, showFeedback } = useGame();

  const handleSelectModule = (id: number, isUnlocked: boolean, title: string) => {
    if (isUnlocked) {
      setCurrentModuleId(id);
      setScreen('town_map'); // Instant transition into the town!
    } else {
      showFeedback({
        title: 'Módulo Bloqueado',
        message: `El ${title} está cerrado con candado. Completa el Módulo 1 para obtener la Llave Dorada.`,
        isSuccess: false,
        tip: 'Habla con Mr. John en la plaza de San Pedro.'
      });
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#064e3b',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <div style={{
        padding: '14px 18px',
        backgroundColor: '#065f46',
        borderBottom: '2px solid #047857',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        <button
          onClick={() => setScreen('main_menu')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 800,
            fontSize: '14px'
          }}
        >
          <ArrowLeft size={18} />
          <span>Volver</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
            Selección de Módulos
          </h2>
          <span style={{ fontSize: '11px', color: '#a7f3d0' }}>
            Ruta del Valle (6 Niveles)
          </span>
        </div>

        <div style={{ width: '30px' }} />
      </div>

      {/* Modules List (Flat 2D) */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        alignItems: 'center'
      }}>
        {modules.map((mod) => {
          return (
            <div
              key={mod.id}
              onClick={() => handleSelectModule(mod.id, mod.isUnlocked, mod.title)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '14px 16px',
                backgroundColor: mod.isUnlocked ? '#ffffff' : '#1e293b',
                border: mod.isUnlocked ? '2px solid #b45309' : '2px solid #334155',
                borderRadius: '12px',
                cursor: 'pointer',
                opacity: mod.isUnlocked ? 1 : 0.8
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Module Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: mod.isUnlocked ? '#fef3c7' : '#0f172a',
                  border: mod.isUnlocked ? '2px solid #f59e0b' : '2px solid #475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  {mod.thumbnail}
                  {!mod.isUnlocked && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      backgroundColor: '#dc2626',
                      borderRadius: '50%',
                      padding: '3px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={12} />
                    </div>
                  )}
                </div>

                {/* Module Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: mod.isUnlocked ? '#b45309' : '#94a3b8'
                    }}>
                      {mod.title}
                    </span>

                    {mod.isUnlocked ? (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(mod.maxStars)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#b45309" />
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#f87171', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={12} /> BLOQUEADO
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: mod.isUnlocked ? '#1e293b' : '#f8fafc',
                    margin: '3px 0'
                  }}>
                    {mod.name}
                  </h3>

                  <div style={{
                    fontSize: '12px',
                    color: mod.isUnlocked ? '#475569' : '#cbd5e1',
                    lineHeight: '1.3'
                  }}>
                    {mod.subtitle}
                  </div>
                </div>
              </div>

              {/* Action Button inside current unlocked module */}
              {mod.isUnlocked && (
                <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectModule(mod.id, mod.isUnlocked, mod.title);
                    }}
                    className="rpg-btn rpg-btn-green"
                    style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                  >
                    <Play size={16} />
                    <span>¡Entrar al Módulo 1!</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
