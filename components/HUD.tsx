import React, { useState, useEffect, useRef } from 'react';
import { RoxyState, MemoryLog } from '../types';
import { FaMicrophone, FaMicrophoneSlash, FaPowerOff, FaCamera, FaTerminal, FaWifi, FaBolt, FaGlobe } from 'react-icons/fa';
import { MdOutlineSmartDisplay } from 'react-icons/md';
import Orb from './Orb';

interface HUDProps {
  state: RoxyState;
  memory: MemoryLog[];
  onToggleMic: () => void;
  isMicMuted: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  error: string | null;
  visuals: { inputVolume: number };
  toggleCamera: () => void;
  isCameraActive: boolean;
  videoStream: MediaStream | null;
  sendTextMessage: (text: string) => Promise<void>;
}

export const HUD: React.FC<HUDProps> = ({ 
  state, 
  memory, 
  onToggleMic, 
  isMicMuted, 
  onConnect, 
  onDisconnect,
  error,
  visuals,
  toggleCamera,
  isCameraActive,
  videoStream,
  sendTextMessage
}) => {
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [displayResponse, setDisplayResponse] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const roxyLogs = memory.filter(m => m.role === 'roxy');
  const latestLog = roxyLogs.length > 0 ? roxyLogs[roxyLogs.length - 1].text : null;

  // Typing Effect Logic
  useEffect(() => {
    if (latestLog && latestLog !== lastResponse) {
      setLastResponse(latestLog);
      setDisplayResponse('');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayResponse(latestLog.slice(0, i + 1));
        i++;
        if (i > latestLog.length) clearInterval(interval);
      }, 15); // Fast typing speed
      return () => clearInterval(interval);
    }
  }, [latestLog, lastResponse]);

  // Video stream effect
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 md:p-8 pointer-events-none">
      
      {/* --- TOP BAR: SYSTEM STATUS --- */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col animate-float" style={{ animationDuration: '8s' }}>
          <h1 className="text-4xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] cursor-default">
            ROXY <span className="text-cyan-400 text-sm align-top opacity-80">OS 2.0</span>
          </h1>
          <div className="flex space-x-4 mt-2 text-[10px] font-mono text-cyan-500/60 uppercase tracking-wider">
            <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300"><FaWifi className="animate-pulse" /> ONLINE</span>
            <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300"><FaBolt /> MEM: OPTIMAL</span>
            <span className="flex items-center gap-1 hover:text-cyan-400 transition-colors duration-300"><FaGlobe /> LOC: LOCKED</span>
          </div>
        </div>
        
        {/* Toggle Terminal Button */}
        <button 
            onClick={() => setShowTerminal(!showTerminal)}
            className={`
                p-2 border rounded-sm transition-all duration-300 ease-out
                hover:shadow-[0_0_15px_#22d3ee] hover:scale-110 active:scale-95
                ${showTerminal 
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-900/20 shadow-[0_0_10px_#22d3ee]' 
                    : 'border-cyan-500/30 text-cyan-500/50 hover:text-cyan-400 hover:border-cyan-400/50'}
            `}
        >
            <FaTerminal size={18} />
        </button>
      </div>

      {/* --- CENTER STAGE: ORB & HOLOGRAPHIC CARD --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        
        {/* The Orb (Interactive Area) */}
        <div className="mb-12 pointer-events-auto cursor-pointer" onClick={state === RoxyState.DISCONNECTED ? onConnect : onToggleMic}>
             <Orb state={state} inputVolume={visuals.inputVolume} />
        </div>

        {/* Holographic Response Card */}
        {displayResponse && (
            <div className="w-[90%] md:w-[600px] min-h-[120px] glass-panel rounded-lg p-6 relative overflow-hidden transition-all duration-500 animate-slide-up hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                
                {/* Tech Deco Lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                
                {/* Subtle Scanline Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-[20%] animate-scanline pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 opacity-60 text-cyan-300 text-[10px] font-mono tracking-[0.2em] uppercase">
                        <MdOutlineSmartDisplay /> System Output
                    </div>
                    <p className="text-cyan-50 font-sans text-lg md:text-xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {displayResponse}
                        <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400/80 ml-1 align-middle shadow-[0_0_8px_cyan]"></span>
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* --- RIGHT SIDE: VISION FEED & TERMINAL --- */}
      <div className="absolute top-24 right-4 flex flex-col gap-4 items-end pointer-events-auto">
          
          {/* Vision Feed */}
          {isCameraActive && videoStream && (
             <div className="w-32 md:w-48 aspect-[3/4] glass-panel rounded-sm overflow-hidden relative shadow-[0_0_30px_rgba(34,211,238,0.15)] border-cyan-500/30 border animate-fade-in">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
                
                {/* Camera UI Overlay */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                <div className="absolute bottom-2 left-2 text-[8px] text-cyan-500 font-mono tracking-widest bg-black/50 px-1 rounded">LIVE FEED</div>
                
                {/* Scanning Effect */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/50 shadow-[0_0_10px_cyan] animate-[scanline_3s_linear_infinite]"></div>
             </div>
          )}

          {/* System Terminal Log */}
          {showTerminal && (
             <div className="w-64 h-48 glass-panel rounded-sm p-3 font-mono text-[10px] text-green-400 overflow-y-auto custom-scrollbar flex flex-col-reverse shadow-2xl border border-cyan-500/20 backdrop-blur-xl animate-fade-in">
                 {memory.slice().reverse().map((log) => (
                     <div key={log.id} className="mb-1 break-words opacity-90 border-b border-white/5 pb-1">
                         <span className="text-gray-500 select-none">[{new Date(log.timestamp).toLocaleTimeString([], {hour12:false, second:'2-digit'})}]</span> 
                         <span className={log.role === 'user' ? 'text-cyan-300' : 'text-emerald-300'}> {log.role === 'user' ? '>>' : '#'} {log.text.substring(0, 60)}{log.text.length>60?'...':''}</span>
                     </div>
                 ))}
                 <div className="text-cyan-500 font-bold mb-2 pb-1 border-b border-cyan-500/30">root@roxy-os:~# tail -f /var/log/sys</div>
             </div>
          )}
      </div>

      {/* --- BOTTOM CONTROLS (Floating Glass Dock) --- */}
      <div className="w-full flex justify-center pb-8 pointer-events-auto z-20">
         {state === RoxyState.DISCONNECTED ? (
             <button 
                onClick={onConnect}
                className="group relative px-10 py-4 bg-cyan-950/40 border border-cyan-500/50 rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(34,211,238,0.4)] hover:border-cyan-400 hover:scale-105 active:scale-95"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-3 text-cyan-300 font-bold tracking-[0.2em] group-hover:text-white">
                    <FaPowerOff /> INITIALIZE
                </span>
             </button>
         ) : (
             <div className="glass-panel px-10 py-5 rounded-full flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 transform transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/30">
                 
                 {/* Mic Toggle */}
                 <div className="relative">
                     {/* Ripple Effect for Mic */}
                     {state === RoxyState.LISTENING && !isMicMuted && (
                         <div className="absolute inset-0 rounded-full bg-cyan-500/30 animate-ping"></div>
                     )}
                     <button 
                        onClick={onToggleMic} 
                        className={`
                            relative z-10 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95
                            ${isMicMuted 
                                ? 'bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] border border-red-500/20' 
                                : 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/20 hover:bg-cyan-500/20'}
                        `}
                     >
                        {isMicMuted ? <FaMicrophoneSlash size={22}/> : <FaMicrophone size={22} className={state === RoxyState.LISTENING ? 'animate-pulse' : ''}/>}
                     </button>
                 </div>

                 {/* Visualizer Middle Section */}
                 <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                 <div className="flex gap-1.5 items-end h-8 w-24 justify-center">
                    {[1, 1.4, 0.8, 1.2, 0.6].map((h, i) => (
                        <div 
                            key={i}
                            className={`w-1 rounded-full transition-all duration-100 ${state === RoxyState.SPEAKING ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-white/20'}`}
                            style={{
                                height: `${Math.max(10, visuals.inputVolume * 100 * h)}%`,
                                animation: state === RoxyState.SPEAKING ? `bounce 0.${5+i}s infinite` : 'none'
                            }}
                        ></div>
                    ))}
                 </div>
                 <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                 {/* Camera Toggle */}
                 <button 
                    onClick={toggleCamera} 
                    className={`
                        p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border
                        ${isCameraActive 
                            ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] border-white/30' 
                            : 'bg-transparent text-cyan-500/40 border-transparent hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30'}
                    `}
                 >
                    <FaCamera size={22} />
                 </button>

                 {/* Disconnect */}
                 <button 
                    onClick={onDisconnect} 
                    className="p-2 ml-2 text-red-500/50 hover:text-red-500 transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90"
                 >
                    <FaPowerOff size={18} />
                 </button>
             </div>
         )}
      </div>

      {/* Error Toast */}
      {error && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 glass-panel text-red-400 px-6 py-3 rounded-full border border-red-500/30 flex items-center gap-3 animate-bounce shadow-[0_0_30px_rgba(220,38,38,0.3)]">
              <FaBolt /> 
              <span className="text-xs font-mono font-bold tracking-widest">{error}</span>
          </div>
      )}
      
      <style>{`
        @keyframes scanline {
            0% { top: 0% }
            100% { top: 100% }
        }
        .animate-scanline {
            animation: scanline 4s linear infinite;
        }
      `}</style>
    </div>
  );
};