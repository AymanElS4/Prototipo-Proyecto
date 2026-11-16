import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { PlayerProvider } from './context/PlayerContext';
import { QuestProvider } from './context/QuestContext';

// Screens
import { MainMenu } from './components/screens/MainMenu';
import { AvatarCustomizer } from './components/screens/AvatarCustomizer';
import { WorldMap } from './components/screens/WorldMap';
import { TownMap } from './components/game/TownMap';

// HUD & Modals
import { GameHUD } from './components/layout/GameHUD';
import { PauseModal } from './components/layout/PauseModal';
import { HistoryModal } from './components/layout/HistoryModal';
import { FeedbackModal } from './components/ui/FeedbackModal';
import { DialogueOverlay } from './components/game/DialogueOverlay';
import { ActivityIntroModal } from './components/activities/ActivityIntroModal';
import { WordSearchModal } from './components/activities/WordSearchModal';
import { SentenceMatchingModal } from './components/activities/SentenceMatchingModal';
import { ListeningSpeakingModal } from './components/activities/ListeningSpeakingModal';
import { ModuleOneCompleteModal } from './components/activities/ModuleOneCompleteModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RPG Game Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1e1b4b',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', color: '#f59e0b', marginBottom: '12px' }}>
            ⚠️ Algo inesperado ocurrió
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px' }}>
            {this.state.error?.message || 'Error al cargar la pantalla del juego.'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="rpg-btn rpg-btn-green"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            Reiniciar y Continuar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { screen, settings } = useGame();

  const renderCurrentScreen = () => {
    switch (screen) {
      case 'main_menu':
        return <MainMenu />;
      case 'customizer':
        return <AvatarCustomizer />;
      case 'world_map':
        return <WorldMap />;
      case 'town_map':
        return <TownMap />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className={`device-container ${settings.phoneFrameView ? 'device-frame' : 'device-fullscreen'}`}>
      {/* Smartphone Notch Bar (Redmi 15C style) */}
      {settings.phoneFrameView && (
        <div className="device-notch">
          <div className="camera-lens" />
        </div>
      )}

      {/* Screen View */}
      {renderCurrentScreen()}

      {/* HUD & Global Overlays */}
      <GameHUD />
      <DialogueOverlay />
      <ActivityIntroModal />
      <WordSearchModal />
      <SentenceMatchingModal />
      <ListeningSpeakingModal />
      <ModuleOneCompleteModal />
      <FeedbackModal />
      <HistoryModal />
      <PauseModal />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <PlayerProvider>
          <QuestProvider>
            <AppContent />
          </QuestProvider>
        </PlayerProvider>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
