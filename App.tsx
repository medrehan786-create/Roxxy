import React from 'react';
import { useLiveRoxy } from './hooks/useLiveSemu'; 
import { HUD } from './components/HUD';

const App: React.FC = () => {
  const { 
    state, 
    connect, 
    disconnect, 
    visuals, 
    memory, 
    toggleMic, 
    isMicMuted,
    error,
    sendTextMessage,
    sendImage,
    isCameraActive,
    toggleCamera,
    videoStream,
  } = useLiveRoxy();

  return (
    <div className="relative w-screen h-screen overflow-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic Aurora Background */}
      <div className="bg-aurora"></div>

      {/* Main UI Layer */}
      <HUD 
        state={state}
        memory={memory}
        onToggleMic={toggleMic}
        isMicMuted={isMicMuted}
        onConnect={connect}
        onDisconnect={disconnect}
        error={error}
        visuals={visuals}
        toggleCamera={toggleCamera}
        isCameraActive={isCameraActive}
        videoStream={videoStream}
        sendTextMessage={sendTextMessage}
      />

    </div>
  );
};

export default App;