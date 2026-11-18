import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { usePlayer } from '../../context/PlayerContext';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { sfx } from '../../utils/audioSynthesis';

const GorraIcon: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg
    viewBox="0 0 100 72"
    width={size}
    height={size * 0.72}
    aria-hidden="true"
    style={style}
  >
    <path
      d="M16 49C18 27 35 11 56 11c17 0 28 13 30 34l9 4c-16 11-51 16-70 9-6-2-9-5-9-9Z"
      fill="#315f83"
      stroke="#263b4a"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path
      d="M17 49c24-9 51-8 70-3l8 3c-13 13-47 18-68 12-7-2-11-6-10-12Z"
      fill="#244960"
      stroke="#263b4a"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M56 13c-8 11-11 24-10 39" fill="none" stroke="#7397a8" strokeWidth="3" />
  </svg>
);

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
      img: '/assets/avatar_customizer/montera_hat_sin_fondo.webp',
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

  const inventoryFrameStyle: React.CSSProperties = {
    backgroundImage: "url('/assets/avatar_customizer/cuadrodeobjeto_sin_fondo.webp')",
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };
  const emptyInventorySlotStyle: React.CSSProperties = {
    aspectRatio: '1',
    ...inventoryFrameStyle,
    backgroundColor: 'rgba(170, 190, 191, 0.5)',
    border: 'none',
    borderRadius: '10px'
  };

  const handleSave = () => {
    sfx.playSuccess();
    updateCustomization({ name: name.trim() || 'Guía Inti' });
    localStorage.setItem('rpg_avatar_customized', 'true');
    setScreen('main_menu');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: 'url(/assets/fondocaracteres.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      color: '#ffffff',
      border: '4px solid #484438',
      boxSizing: 'border-box'
    }}>
      {/* Keep the scenery bright, like the reference layout. */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.08)',
        zIndex: 1
      }} />

      {/* Top Header Bar (Organizado y sin choques) */}
      <div style={{
        position: 'absolute',
        zIndex: 20,
        top: '10px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px'
      }}>
        {/* Back Button */}
        <button
          aria-label="Volver"
          onClick={() => {
            sfx.playClick();
            setScreen('main_menu');
          }}
          className="stone-btn"
          style={{
            width: '42px',
            height: '42px',
            padding: '0',
            borderRadius: '50%',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={16} />
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
            maxWidth: '136px',
            minWidth: 0,
            outline: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}
        />

        {/* Save Confirmation Button */}
        <button
          aria-label="Guardar personalización"
          onClick={handleSave}
          className="stone-btn stone-btn-green"
          style={{
            width: '42px',
            height: '42px',
            padding: '0',
            borderRadius: '50%',
            flexShrink: 0
          }}
        >
          <Check size={16} />
        </button>
      </div>

      {/* Main Interactive Stage: Character with Circular Category Orbs */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        minHeight: 0
      }}>
        {/* Orbit of Round Category Buttons */}
        <div style={{
          position: 'absolute',
          top: '9%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(94vw, 330px)',
          height: 'min(60vh, 450px)'
        }}>
          {/* Character Illustration Base */}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            width: 'min(78vw, 260px)',
            height: 'min(42vh, 230px)',
            overflow: 'visible',
            zIndex: 5,
            pointerEvents: 'none'
          }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <img
                src="/assets/avatar_customizer/personaje_sin_fondo.webp"
                alt="Guía Turístico"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  width: '80%',
                  height: 'auto'
                }}
              />
            </div>

            {/* Hat Layer Rendered on Head */}
            {player.customization.hat === 'montera' && (
              <img
                src="/assets/avatar_customizer/montera_hat_sin_fondo.webp"
                alt="Montera Cusqueña"
                style={{
                  position: 'absolute',
                  top: '-10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '42%',
                  height: 'auto',
                  zIndex: 8,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
                }}
              />
            )}
            {player.customization.hat === 'chullo' && (
              <span style={{ position: 'absolute', top: '-12%', left: '50%', transform: 'translateX(-50%)', fontSize: '42px', zIndex: 8, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>🧶</span>
            )}
            {player.customization.hat === 'sombrero' && (
              <span style={{ position: 'absolute', top: '-12%', left: '50%', transform: 'translateX(-50%)', fontSize: '42px', zIndex: 8, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }}>👒</span>
            )}
            {player.customization.hat === 'gorra' && (
              <GorraIcon
                size={122}
                style={{
                  position: 'absolute',
                  top: '-14%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 8,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.45))'
                }}
              />
            )}
            {player.customization.hat === 'chullo_dorado' && (
              <span style={{ position: 'absolute', top: '-14%', left: '50%', transform: 'translateX(-50%)', fontSize: '46px', zIndex: 8, filter: 'drop-shadow(0 4px 8px rgba(245,158,11,0.6))' }}>👑</span>
            )}

            {/* Glasses Layer */}
            {player.customization.glasses === 'classic' && (
              <span style={{ position: 'absolute', top: '34%', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', zIndex: 9 }}>👓</span>
            )}
            {player.customization.glasses === 'sunglasses' && (
              <span style={{ position: 'absolute', top: '34%', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', zIndex: 9 }}>🕶️</span>
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
              top: '110px',
              left: '4%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#d3cbbb',
              border: activeCategory === 'skin' ? '3px solid #f59e0b' : '2px solid #5a5245',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              overflow: 'hidden',
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
              top: '42px',
              left: '20%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: activeCategory === 'shirt' ? '2px solid #f59e0b' : '2px solid transparent',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              padding: '0',
              zIndex: 12
            }}
          >
            <img src="/assets/avatar_customizer/cat_shirt_sin_fondo.webp" alt="" style={{ width: '46px', height: '46px' }} />
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
              top: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: activeCategory === 'hat' ? '2px solid #f59e0b' : '2px solid transparent',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              padding: '0',
              zIndex: 15
            }}
          >
            <img
              src="/assets/avatar_customizer/cat_hat_sin_fondo.webp"
              alt=""
              style={{ width: '46px', height: '46px', objectFit: 'contain' }}
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
              top: '42px',
              right: '20%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: activeCategory === 'pants' ? '2px solid #f59e0b' : '2px solid transparent',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              padding: '0',
              zIndex: 12
            }}
          >
            <img src="/assets/avatar_customizer/cat_pants_sin_fondo.webp" alt="" style={{ width: '46px', height: '46px' }} />
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
              top: '110px',
              right: '4%',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: activeCategory === 'glasses' ? '2px solid #f59e0b' : '2px solid transparent',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              padding: '0',
              zIndex: 12
            }}
          >
            <img src="/assets/avatar_customizer/cat_glasses_sin_fondo.webp" alt="" style={{ width: '46px', height: '46px' }} />
          </button>
        </div>
      </div>

      {/* Bottom Inventory Slot Grid (4x3 Stone Framed Slots) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(112, 145, 151, 0.62)',
        borderTop: 'none',
        padding: '10px 12px 12px',
        height: '32%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0'
      }}>
        {/* 4x3 Slot Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '4px',
          width: '100%',
          maxWidth: '270px'
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
                      ...inventoryFrameStyle,
                      backgroundColor: isSelected ? 'rgba(246, 221, 175, 0.65)' : 'rgba(170, 190, 191, 0.5)',
                      border: isSelected ? '3px solid #f59e0b' : 'none',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: item.locked ? 'not-allowed' : 'pointer',
                      opacity: item.locked ? 0.4 : 1,
                      position: 'relative',
                      boxShadow: 'none',
                      padding: '3px'
                    }}
                    title={item.name}
                  >
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                    ) : item.id === 'gorra' ? (
                      <GorraIcon size={38} />
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
                  style={emptyInventorySlotStyle}
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
                      ...inventoryFrameStyle,
                      backgroundColor: 'rgba(170, 190, 191, 0.5)',
                      border: isSelected ? '3px solid #f59e0b' : 'none',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'none'
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
                  style={emptyInventorySlotStyle}
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
                      ...inventoryFrameStyle,
                      backgroundColor: 'rgba(170, 190, 191, 0.5)',
                      border: isSelected ? '3px solid #f59e0b' : 'none',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'none'
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
                  style={emptyInventorySlotStyle}
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
                      ...inventoryFrameStyle,
                      backgroundColor: 'rgba(170, 190, 191, 0.5)',
                      border: isSelected ? '3px solid #f59e0b' : 'none',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: 'none'
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
                  style={emptyInventorySlotStyle}
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
                      ...inventoryFrameStyle,
                      backgroundColor: isSelected ? 'rgba(246, 221, 175, 0.65)' : 'rgba(170, 190, 191, 0.5)',
                      border: isSelected ? '3px solid #f59e0b' : 'none',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      cursor: 'pointer',
                      boxShadow: 'none'
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
                  style={emptyInventorySlotStyle}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
