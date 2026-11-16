import React from 'react';
import { useGame } from '../../context/GameContext';
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';
import { speakEnglish } from '../../utils/speechSynth';

export const FeedbackModal: React.FC = () => {
  const { feedbackModal, closeFeedback } = useGame();

  if (!feedbackModal || !feedbackModal.isOpen) return null;

  const { title, message, englishPhrase, isSuccess, tip, onRetry, onContinue } = feedbackModal;

  const handleAction = () => {
    closeFeedback();
    if (isSuccess && onContinue) {
      onContinue();
    } else if (!isSuccess && onRetry) {
      onRetry();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '16px'
    }}>
      <div 
        className="rpg-box animate-float"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '24px 20px',
          textAlign: 'center',
          border: isSuccess ? '4px solid #16a34a' : '4px solid #dc2626'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '14px'
        }}>
          {isSuccess ? (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              border: '3px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a'
            }}>
              <CheckCircle2 size={40} />
            </div>
          ) : (
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              border: '3px solid #dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }}>
              <AlertCircle size={40} />
            </div>
          )}
        </div>

        <h3 style={{
          fontSize: '20px',
          fontWeight: 800,
          color: isSuccess ? '#15803d' : '#b91c1c',
          marginBottom: '10px'
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '14px',
          color: '#334155',
          lineHeight: '1.5',
          marginBottom: '14px'
        }}>
          {message}
        </p>

        {englishPhrase && (
          <div style={{
            backgroundColor: '#f1f5f9',
            border: '2px dashed #94a3b8',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 700,
              color: '#1e293b',
              textAlign: 'left'
            }}>
              "{englishPhrase}"
            </span>
            <button
              onClick={() => speakEnglish(englishPhrase)}
              title="Escuchar pronunciación"
              style={{
                background: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 10px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              <Volume2 size={16} />
              <span>Audio</span>
            </button>
          </div>
        )}

        {tip && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '12px',
            color: '#92400e',
            marginBottom: '18px',
            textAlign: 'left',
            lineHeight: '1.4'
          }}>
            💡 <strong>Consejo pedagógico:</strong> {tip}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={handleAction}
            className={`rpg-btn ${isSuccess ? 'rpg-btn-green' : 'rpg-btn-red'}`}
            style={{ width: '100%', fontSize: '14px', padding: '12px' }}
          >
            {isSuccess ? (
              <>
                <span>Continuar</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Intentar nuevamente</span>
                <RotateCcw size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
