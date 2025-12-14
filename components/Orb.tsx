import React from 'react';
import { RoxyState } from '../types';

interface OrbProps {
  state: RoxyState;
  inputVolume: number;
}

const Orb: React.FC<OrbProps> = ({ state, inputVolume }) => {
  const isSpeaking = state === RoxyState.SPEAKING;
  const isListening = state === RoxyState.LISTENING;
  const isProcessing = state === RoxyState.PROCESSING;
  
  // Focus Mode Logic
  const isActive = isSpeaking || isListening || isProcessing;
  
  // Scale Calculation
  // Idle: 0.6 scale (small)
  // Active: 1.1 base + volume reaction
  const baseScale = isActive ? 1.1 : 0.6;
  const volumeEffect = isActive ? Math.min(inputVolume * 2, 0.5) : 0;
  const scale = baseScale + volumeEffect;

  // Opacity/Glow Calculation
  // Idle: Dimmed (0.4)
  // Active: Bright (1.0)
  const coreOpacity = isActive ? 1 : 0.4;
  
  // Color & Shadow Logic
  const getShadow = () => {
      if (isSpeaking) return 'shadow-[0_0_80px_#22d3ee]'; // Cyan glow
      if (isListening) return 'shadow-[0_0_60px_#a855f7]'; // Purple glow
      if (isProcessing) return 'shadow-[0_0_60px_#ffffff]'; // White/Processing
      return 'shadow-[0_0_10px_#3b82f6]'; // Dim blue idle
  };

  const ringColor = isSpeaking ? 'border-cyan-400' : isListening ? 'border-purple-500' : 'border-blue-500/50';
  
  return (
    <div className="relative flex items-center justify-center w-64 h-64 transition-all duration-700 ease-in-out">
      
      {/* Outer Ring - Expands when active */}
      <div 
        className={`absolute inset-0 rounded-full border border-dashed ${ringColor} transition-all duration-700 ease-in-out`}
        style={{ 
            transform: `scale(${isActive ? 1.4 : 0.9}) rotate(${isActive ? '180deg' : '0deg'})`,
            opacity: isActive ? 0.3 : 0.1
        }}
      ></div>

      {/* Inner Spinning Ring */}
      <div 
        className={`absolute inset-4 rounded-full border border-dotted ${ringColor} opacity-40 animate-spin-slow`}
        style={{ animationDuration: isActive ? '4s' : '15s' }}
      ></div>

      {/* Pulsing Energy Field - Visible only when active */}
      <div 
        className={`absolute w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-2xl transition-opacity duration-500`}
        style={{ opacity: isActive ? 1 : 0 }}
      ></div>

      {/* THE CORE */}
      <div 
        className={`
          relative z-10 w-24 h-24 rounded-full 
          bg-black border-2 ${ringColor}
          ${getShadow()}
          transition-all duration-300 ease-out
          flex items-center justify-center
        `}
        style={{
             transform: `scale(${scale})`,
             opacity: coreOpacity
        }}
      >
        {/* Texture */}
        <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40"></div>
        
        {/* Center Visual */}
        {state === RoxyState.DISCONNECTED ? (
            <div className="w-2 h-2 bg-red-900 rounded-full shadow-[0_0_5px_red]"></div>
        ) : (
            <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden`}>
                {/* Voice Bar Visualization inside Core */}
                <div className={`w-full bg-white/90 shadow-[0_0_15px_white] transition-all duration-75`}
                     style={{
                         height: isActive ? `${Math.max(2, inputVolume * 80)}px` : '1px',
                         width: isActive ? '70%' : '10%',
                         opacity: isActive ? 1 : 0.3
                     }}
                ></div>
            </div>
        )}
      </div>

      {/* Status Label - Only visible when active or explicitly processing */}
      <div 
        className={`
            absolute -bottom-12 text-xs tracking-[0.4em] font-mono font-bold text-cyan-400 uppercase 
            transition-all duration-500
            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        `}
      >
        {state}
      </div>
    </div>
  );
};

export default Orb;