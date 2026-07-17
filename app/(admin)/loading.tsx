import React from 'react';
import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center p-6">
      <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
        <div className="absolute inset-0 border-t-2 border-brand rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-brand/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <Activity className="text-brand animate-pulse w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-bold text-white tracking-widest uppercase glow-text mb-2 animate-pulse">
        Initializing Admin Controls
      </h2>
      <p className="text-sm text-text-secondary">Securing connection and loading system data...</p>
      
      <div className="w-64 h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-brand rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}
