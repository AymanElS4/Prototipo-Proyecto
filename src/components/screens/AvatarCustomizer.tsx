import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';

export const AvatarCustomizer: React.FC = () => {
  const { setScreen } = useGame();
  const { player, updateCustomization, hasItem } = usePlayer();
  const [name, setName] = useState(player.customization.name);

  // Active Category selection around the portrait: 'hat' | 'shirt' | 'skin' | 'pants' | 'glasses'
  const [activeCategory, setActiveCategory] = useState<'hat' | 'skin' | 'shirt' | 'pants' | 'glasses'>('hat');

  // Skin tones
  const skinTones = [
    { label: 'Cálido Natural', value: '#ffd7ba' },
    { label: 'Trigueño Andino', value: '#e8ac7c' },
    { label: 'Bronce Valle', value: '#c68642' },
    { label: 'Moreno Andino', value: '#8d5524' }
  ];

  // Shirt colors
  const shirtColors = [
    { label: 'Blanco Tradicional', value: '#ffffff' },
    { label: 'Rojo Andino', value: '#b91c1c' },
    { label: 'Azul Lago', value: '#1d4ed8' },
    { label: 'Verde Valle', value: '#15803d' },
    { label: 'Dorado Sol', value: '#b45309' },
    { label: 'Negro Elegante', value: '#1e293b' }
  ];

  // Pants colors
  const pantsColors = [
    { label: 'Gris Oscuro', value: '#334155' },
    { label: 'Marrón Cuero', value: '#78350f' },
    { label: 'Azul Denim', value: '#1e3a8a' },
    { label: 'Beige Arena', value: '#d6d3d1' }
  ];

  // Hats items
  const hats = [
    {
      id: 'montera' as const,
      name: 'Montera Cusqueña',
      img: '/assets/avatar_customizer/montera_clean.png',
      locked: false
    },
    {
      id: 'chullo' as const,
      name: 'Chullo Andino',
      icon: '🧶',
      locked: false
    },
    {
      id: 'sombrero' as const,
      name: 'Sombrero de Paja',
      icon: '👒',
      locked: false
    },
    {
      id: 'gorra' as const,
      name: 'Gorra de Guía',
      icon: '🧢',
      locked: false
    },
    {
      id: 'chullo_dorado' as const,
      name: 'Chullo Sagrado Dorado',
      icon: '👑',
      locked: !hasItem('chullo_dorado') && player.customization.hat !== 'chullo_dorado'
    },
    {
      id: 'none' as const,
      name: 'Sin Sombrero',
      icon: '🚫',
      locked: false
    }
  ];

  // Glasses items
  const glassesList = [
    { id: 'none' as const, name: 'Sin lentes', icon: '🚫' },
    { id: 'classic' as const, name: 'Lentes Clásicos', icon: '👓' },
    { id: 'sunglasses' as const, name: 'Lentes de Sol', icon: '🕶️' }
  ];

  const handleSave = () => {
    sfx.playSuccess();
    updateCustomization({ name: name.trim() || 'Guía Inti' });
    setScreen('main_menu');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: 'url(/assets/menu_theme/main_bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      color: '#ffffff'
    }}>
      {/* Dark overlay backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 1
      }} />

      {/* Top Header Bar (Organizado y sin choques) */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* Back Button */}
        <button
          onClick={() => {
            sfx.playClick();
            setScreen('main_menu');
          }}
          className="stone-btn"
          style={{
            padding: '7px 12px',
            fontSize: '11px',
            borderRadius: '10px',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>

        {/* Name input pill */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre del Guía..."
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            border: '2px solid #5a5245',
            borderRadius: '12px',
            padding: '5px 10px',
            fontSize: '12.5px',
            fontWeight: 800,
            color: '#2b261f',
            textAlign: 'center',
            flex: 1,
            maxWidth: '160px',
            outline: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}
        />

        {/* Save Confirmation Button */}
        <button
          onClick={handleSave}
          className="stone-btn stone-btn-green"
          style={{
            padding: '7px 12px',
            fontSize: '11px',
            borderRadius: '10px',
            flexShrink: 0
          }}
        >
          <Check size={16} />
          <span>Guardar</span>
        </button>
      </div>

      {/* Main Interactive Stage: Character with Circular Category Orbs */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 10px 0 10px'
      }}>
        {/* Orbit of Round Category Buttons */}
        <div style={{
          position: 'relative',
          width: '290px',
          height: '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Character Illustration Base */}
          <div style={{
            position: 'relative',
            width: '180px',
            height: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 5
          }}>
            {/* Base Portrait Image from uploaded design */}
            <img
              src="/assets/avatar_customizer/character_portrait.png"
              alt="Guía Turístico"
              style={{
                width: '150px',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))'
              }}
            />

            {/* Hat Layer Rendered on Head */}
            {player.customization.hat === 'montera' && (
              <img
                src="/assets/avatar_customizer/montera_head_clean.png"
                alt="Montera"
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '95px',
                  height: 'auto',
                  zIndex: 8,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
                }}
              />
            )}
            {player.customization.hat === 'chullo' && (
              <span style={{ position: 'absolute', top: '16px', fontSize: '42px', zIndex: 8, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>🧶</span>
            )}
            {player.customization.hat === 'sombrero' && (
              <span style={{ position: 'absolute', top: '16px', fontSize: '42px', zIndex: 8, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>👒</span>
            )}
            {player.customization.hat === 'gorra' && (
              <span style={{ position: 'absolute', top: '18px', fontSize: '42px', zIndex: 8, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>🧢</span>
            )}
            {player.customization.hat === 'chullo_dorado' && (
              <span style={{ position: 'absolute', top: '12px', fontSize: '46px', zIndex: 8, filter: 'drop-shadow(0 4px 8px rgba(245,158,11,0.6))' }}>👑</span>
            )}

            {/* Glasses Layer */}
            {player.customization.glasses === 'classic' && (
              <span style={{ position: 'absolute', top: '78px', fontSize: '24px', zIndex: 9 }}>👓</span>
            )}
            {player.customization.glasses === 'sunglasses' && (
              <span style={{ position: 'absolute', top: '78px', fontSize: '24px', zIndex: 9 }}>🕶️</span>
            )}
          </div>

          {/* 1. Category Button: Skin Tone (Left) */}
          <button
            onClick={() => {
              sfx.playClick();
              setActiveCategory('skin');
            }}
            title="Tono de Piel"
            style={{
              position: 'absolute',
              top: '80px',
              left: '6px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: activeCategory === 'skin' ? '#fef3c7' : 'rgba(235, 230, 219, 0.95)',
              border: activeCategory === 'skin' ? '3px solid #f59e0b' : '2px solid #5a5245',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              zIndex: 12
            }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: player.customization.skinTone || '#e8ac7c',
              border: '1.5px solid #5a5245'
            }} />
          </button>

          {/* 2. Category Button: Shirt / Prendas (Top Left) */}
          <button
            onClick={() => {
              sfx.playClick();
              setActiveCategory('shirt');
            }}
            title="Vestimenta / Camiseta"
            style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: activeCategory === 'shirt' ? '#fef3c7' : 'rgba(235, 230, 219, 0.95)',
              border: activeCategory === 'shirt' ? '3px solid #f59e0b' : '2px solid #5a5245',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              fontSize: '18px',
              zIndex: 12
            }}
          >
            👕
          </button>

          {/* 3. Category Button: Hat / Montera (Top Center) */}
          <button
            onClick={() => {
              sfx.playClick();
              setActiveCategory('hat');
            }}
            title="Sombreros y Monteras"
            style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: activeCategory === 'hat' ? '#fef3c7' : 'rgba(235, 230, 219, 0.95)',
              border: activeCategory === 'hat' ? '3px solid #f59e0b' : '2px solid #5a5245',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              padding: '4px',
              zIndex: 15
            }}
          >
            <img
              src="/assets/avatar_customizer/montera_clean.png"
              alt="Hat"
              style={{ width: '32px', height: 'auto', objectFit: 'contain' }}
            />
          </button>

          {/* 4. Category Button: Pants (Top Right) */}
          <button
            onClick={() => {
              sfx.playClick();
              setActiveCategory('pants');
            }}
            title="Pantalón"
            style={{
              position: 'absolute',
              top: '12px',
              right: '38px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: activeCategory === 'pants' ? '#fef3c7' : 'rgba(235, 230, 219, 0.95)',
              border: activeCategory === 'pants' ? '3px solid #f59e0b' : '2px solid #5a5245',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              fontSize: '18px',
              zIndex: 12
            }}
          >
            👖
          </button>

          {/* 5. Category Button: Glasses (Right) */}
          <button
            onClick={() => {
              sfx.playClick();
              setActiveCategory('glasses');
            }}
            title="Lentes y Accesorios"
            style={{
              position: 'absolute',
              top: '80px',
              right: '6px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: activeCategory === 'glasses' ? '#fef3c7' : 'rgba(235, 230, 219, 0.95)',
              border: activeCategory === 'glasses' ? '3px solid #f59e0b' : '2px solid #5a5245',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              fontSize: '18px',
              zIndex: 12
            }}
          >
            👓
          </button>
        </div>
      </div>

      {/* Bottom Inventory Slot Grid (4x3 Stone Framed Slots) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        borderTop: '3px solid #5a5245',
        padding: '12px 14px 18px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}>
        {/* Category Description */}
        <div style={{
          fontSize: '11px',
          fontWeight: 900,
          color: '#fbbf24',
          textTransform: 'uppercase',
          letterSpacing: '0.8px'
        }}>
          {activeCategory === 'hat' && 'Seleccionar Sombrero o Montera'}
          {activeCategory === 'skin' && 'Seleccionar Tono de Piel'}
          {activeCategory === 'shirt' && 'Seleccionar Color de Prenda'}
          {activeCategory === 'pants' && 'Seleccionar Color de Pantalón'}
          {activeCategory === 'glasses' && 'Seleccionar Accesorios de Rostro'}
        </div>

        {/* 4x3 Slot Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '7px',
          width: '100%',
          maxWidth: '330px'
        }}>
          {activeCategory === 'hat' && (
            <>
              {hats.map(item => {
                const isSelected = player.customization.hat === item.id;

                return (
                  <button
                    key={item.id}
                    disabled={item.locked}
                    onClick={() => {
                      if (!item.locked) {
                        sfx.playClick();
                        updateCustomization({ hat: item.id });
                      }
                    }}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: isSelected ? 'rgba(254, 243, 199, 0.95)' : 'rgba(71, 85, 105, 0.45)',
                      border: isSelected ? '3px solid #f59e0b' : '2px solid #64748b',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: item.locked ? 'not-allowed' : 'pointer',
                      opacity: item.locked ? 0.4 : 1,
                      position: 'relative',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      padding: '4px'
                    }}
                    title={item.name}
                  >
                    {item.img ? (
                      <img src={item.img} alt={item.name} style={{ width: '40px', height: 'auto', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '22px' }}>{item.icon}</span>
                    )}
                    {item.locked && (
                      <div style={{ position: 'absolute', top: '2px', right: '2px' }}>
                        <Lock size={12} color="#ef4444" />
                      </div>
                    )}
                  </button>
                );
              })}
              {Array.from({ length: 12 - hats.length }).map((_, idx) => (
                <div
                  key={`empty-hat-${idx}`}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'rgba(30, 41, 59, 0.35)',
                    border: '2px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </>
          )}

          {activeCategory === 'skin' && (
            <>
              {skinTones.map(item => {
                const isSelected = player.customization.skinTone === item.value;

                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      sfx.playClick();
                      updateCustomization({ skinTone: item.value });
                    }}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: 'rgba(71, 85, 105, 0.45)',
                      border: isSelected ? '3px solid #f59e0b' : '2px solid #64748b',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    title={item.label}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: item.value,
                      border: '2px solid white'
                    }} />
                  </button>
                );
              })}
              {Array.from({ length: 12 - skinTones.length }).map((_, idx) => (
                <div
                  key={`empty-skin-${idx}`}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'rgba(30, 41, 59, 0.35)',
                    border: '2px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </>
          )}

          {activeCategory === 'shirt' && (
            <>
              {shirtColors.map(item => {
                const isSelected = player.customization.outfitColor === item.value;

                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      sfx.playClick();
                      updateCustomization({ outfitColor: item.value });
                    }}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: 'rgba(71, 85, 105, 0.45)',
                      border: isSelected ? '3px solid #f59e0b' : '2px solid #64748b',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    title={item.label}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      backgroundColor: item.value,
                      border: '2px solid white'
                    }} />
                  </button>
                );
              })}
              {Array.from({ length: 12 - shirtColors.length }).map((_, idx) => (
                <div
                  key={`empty-shirt-${idx}`}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'rgba(30, 41, 59, 0.35)',
                    border: '2px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </>
          )}

          {activeCategory === 'pants' && (
            <>
              {pantsColors.map(item => {
                const isSelected = player.customization.pantsColor === item.value;

                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      sfx.playClick();
                      updateCustomization({ pantsColor: item.value });
                    }}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: 'rgba(71, 85, 105, 0.45)',
                      border: isSelected ? '3px solid #f59e0b' : '2px solid #64748b',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    title={item.label}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      backgroundColor: item.value,
                      border: '2px solid white'
                    }} />
                  </button>
                );
              })}
              {Array.from({ length: 12 - pantsColors.length }).map((_, idx) => (
                <div
                  key={`empty-pants-${idx}`}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'rgba(30, 41, 59, 0.35)',
                    border: '2px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </>
          )}

          {activeCategory === 'glasses' && (
            <>
              {glassesList.map(item => {
                const isSelected = player.customization.glasses === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sfx.playClick();
                      updateCustomization({ glasses: item.id });
                    }}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: isSelected ? 'rgba(254, 243, 199, 0.95)' : 'rgba(71, 85, 105, 0.45)',
                      border: isSelected ? '3px solid #f59e0b' : '2px solid #64748b',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      cursor: 'pointer',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    title={item.name}
                  >
                    <span>{item.icon}</span>
                  </button>
                );
              })}
              {Array.from({ length: 12 - glassesList.length }).map((_, idx) => (
                <div
                  key={`empty-glasses-${idx}`}
                  style={{
                    aspectRatio: '1',
                    backgroundColor: 'rgba(30, 41, 59, 0.35)',
                    border: '2px solid rgba(100, 116, 139, 0.3)',
                    borderRadius: '12px'
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
