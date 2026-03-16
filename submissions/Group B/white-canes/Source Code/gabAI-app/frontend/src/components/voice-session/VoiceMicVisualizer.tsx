import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface VoiceMicVisualizerProps {
  isActive: boolean;
  isConnecting?: boolean;
  isMuted?: boolean;
  volumeLevel?: number; // 0 to 1
}

const VoiceMicVisualizer = ({ 
  isActive, 
  isConnecting = false, 
  isMuted = false,
  volumeLevel = 0 
}: VoiceMicVisualizerProps) => {
  const showPulse = isActive && !isMuted && !isConnecting;
  
  // Dynamic scale factor based on volume (0.0 to 1.0)
  // We want it to be noticeable but not jarring.
  const dynamicScale = 1 + (volumeLevel * 0.4); 
  const dynamicGlow = volumeLevel * 30; // 0 to 30px shadow

  return (
    <div className="relative flex items-center justify-center w-80 h-80">

      {/* Outer concentric rings — pulse when active, scale with volume */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "absolute rounded-full border transition-all duration-300",
            "border-[#2e1065]/20",
            showPulse && "animate-pulse"
          )}
          style={{
            inset: `${i * 24}px`,
            transform: showPulse ? `scale(${1 + (volumeLevel * (0.2 + i * 0.1))})` : 'scale(1)',
            opacity: showPulse ? 0.4 - i * 0.1 + (volumeLevel * 0.2) : 0.12,
            borderWidth: showPulse ? `${1 + volumeLevel * 2}px` : '1px'
          }}
        />
      ))}

      {/* Static decorative ring */}
      <div
        className={cn(
          "absolute inset-10 rounded-full border-2 transition-all duration-500",
          isMuted
            ? "border-red-200"
            : isConnecting
            ? "border-amber-200 animate-pulse"
            : isActive
            ? "border-[#2e1065]/30"
            : "border-zinc-100"
        )}
        style={{
           transform: showPulse ? `scale(${1 + volumeLevel * 0.1})` : 'scale(1)'
        }}
      />

      {/* Center button */}
      <div
        className={cn(
          "relative w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-150 shadow-2xl cursor-pointer select-none",
          isMuted
            ? "bg-red-500 scale-95 shadow-red-500/30"
            : isConnecting
            ? "bg-gradient-to-br from-amber-400 to-orange-400 shadow-amber-400/30"
            : isActive
            ? "bg-gradient-to-br from-[#2e1065] to-[#1f0b47] shadow-[#2e1065]/30"
            : "bg-white border border-zinc-100 shadow-zinc-100"
        )}
        style={{
          transform: showPulse ? `scale(${dynamicScale})` : isMuted ? 'scale(0.95)' : 'scale(1)',
          boxShadow: showPulse 
            ? `0 0 ${dynamicGlow}px ${dynamicGlow/2}px rgba(46, 16, 101, 0.3)` 
            : undefined
        }}
      >
        {isConnecting ? (
          <Loader2 size={40} className="text-white animate-spin" />
        ) : isMuted ? (
          <MicOff size={40} className="text-white" />
        ) : (
          <Mic
            size={40}
            className={cn(
              "transition-colors duration-500",
              isActive ? "text-white" : "text-zinc-300"
            )}
          />
        )}
      </div>

      {/* Status label */}
      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        <span className={cn(
          "text-sm font-bold tracking-wide px-5 py-2 rounded-full shadow-sm shadow-black/5 transition-all duration-300",
          isMuted
            ? "text-red-500 bg-red-50 border border-red-100"
            : isConnecting
            ? "text-amber-600 bg-amber-50 border border-amber-100"
            : isActive
            ? "text-[#2e1065] bg-purple-50 border border-purple-100 scale-105"
            : "text-zinc-400 bg-zinc-50 border border-zinc-100"
        )}>
          {isMuted ? "MUTED" : isConnecting ? "CONNECTING..." : isActive ? (volumeLevel > 0.05 ? "SPEAKING" : "LISTENING") : "READY"}
        </span>
      </div>
    </div>
  );
};

export default VoiceMicVisualizer;
