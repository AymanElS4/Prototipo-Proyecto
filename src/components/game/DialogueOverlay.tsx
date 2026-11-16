import React, { useState, useEffect } from 'react';
import { useQuest } from '../../context/QuestContext';
import { NPCS_DATA } from '../../data/npcsData';
import { Volume2, ArrowRight, X } from 'lucide-react';
import { speakEnglish } from '../../utils/speechSynth';
import { sfx } from '../../utils/audioSynthesis';

export const DialogueOverlay: React.FC = () => {
  const { 
    activeDialogueNpcId, 
    activeDialogueNodeId, 
    closeDialogue, 
    openDialogue,
    setSuitcasesVisible,
    advanceQuestStep,
    setActiveActivityModal
  } = useQuest();

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const npc = activeDialogueNpcId ? NPCS_DATA[activeDialogueNpcId] : null;
  const currentNode = (npc && activeDialogueNodeId) ? npc.dialogueTree[activeDialogueNodeId] : null;

  useEffect(() => {
    if (!currentNode) return;

    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const fullText = currentNode.text;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index % 4 === 0) {
        try { sfx.playDialogueBlip(); } catch {}
      }
      if (index >= fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [currentNode]);

  if (!npc || !currentNode) return null;

  const handleOptionClick = (option: typeof currentNode.options[0]) => {
    try { sfx.playClick(); } catch {}

    if (option.action === 'accept_quest') {
      setSuitcasesVisible(true);
      advanceQuestStep();
      closeDialogue();
      setActiveActivityModal('activity_1_intro');
      return;
    }

    if (option.action === 'open_activity_intro') {
      closeDialogue();
      setActiveActivityModal('activity_2_intro');
      return;
    }

    if (option.action === 'open_listening_speaking') {
      closeDialogue();
      setActiveActivityModal('listening_speaking');
      return;
    }

    if (option.action === 'close') {
      if (activeDialogueNpcId === 'mateo' && activeDialogueNodeId === 'mateo_reward') {
        closeDialogue();
        setActiveActivityModal('module_complete');
        return;
      }
      closeDialogue();
      return;
    }

    if (option.nextDialogId) {
      openDialogue(activeDialogueNpcId!, option.nextDialogId);
    } else {
      closeDialogue();
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '14px',
      right: '14px',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div 
        className="rpg-box"
        style={{
          padding: '16px 18px',
          backgroundColor: '#fffbeb',
          border: '4px solid #b45309',
          boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
          position: 'relative'
        }}
      >
        {/* Speaker Info Pill */}
        <div style={{
          position: 'absolute',
          top: '-18px',
          left: '16px',
          backgroundColor: npc.color,
          color: '#ffffff',
          padding: '4px 14px',
          borderRadius: '14px',
          fontSize: '12px',
          fontWeight: 800,
          border: '2px solid #ffffff',
          boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>{currentNode.avatarIcon}</span>
          <span>{currentNode.speaker}</span>
          <span style={{ opacity: 0.85, fontSize: '10px', fontWeight: 600 }}>• {currentNode.speakerRole}</span>
        </div>

        {/* Close button top right */}
        <button
          onClick={closeDialogue}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: '#78350f',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {/* Dialogue Text */}
        <div style={{
          marginTop: '10px',
          minHeight: '48px',
          fontSize: '14px',
          color: '#1e293b',
          lineHeight: '1.5',
          fontWeight: 600
        }}>
          {displayedText}
          {isTyping && <span style={{ opacity: 0.7, color: '#f59e0b' }}> ▌</span>}
        </div>

        {/* English phrase audio preview */}
        {currentNode.englishSnippet && (
          <div style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#eff6ff',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af', fontStyle: 'italic' }}>
              🗣️ "{currentNode.englishSnippet}"
            </span>
            <button
              onClick={() => speakEnglish(currentNode.englishSnippet!)}
              title="Escuchar pronunciación"
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Volume2 size={14} />
              <span>Escuchar</span>
            </button>
          </div>
        )}

        {/* Dialogue Options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '14px'
        }}>
          {currentNode.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(opt)}
              className="rpg-btn"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                justifyContent: 'flex-start',
                textAlign: 'left'
              }}
            >
              <ArrowRight size={16} />
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
