'use client';

import React from 'react';

export function SecurityVector({ className = 'w-48 h-48' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full animate-pulse-slow">
        {/* Outer Glow Ring */}
        <circle cx="100" cy="100" r="80" stroke="url(#secGlow)" strokeWidth="1.5" strokeDasharray="5 5" className="animate-spin-slow" />
        
        {/* Core Shield */}
        <path d="M100 45 C125 45, 145 35, 145 35 C145 75, 135 115, 100 145 C65 115, 55 75, 55 35 C55 35, 75 45, 100 45 Z" 
          fill="rgba(0, 255, 136, 0.03)" 
          stroke="url(#shieldBorder)" 
          strokeWidth="2.5" 
        />
        
        {/* Padlock inside shield */}
        <rect x="85" y="85" width="30" height="24" rx="4" fill="rgba(0, 255, 136, 0.1)" stroke="#00ff88" strokeWidth="2" />
        <path d="M91 85 V75 C91 70, 95 66, 100 66 C105 66, 109 70, 109 75 V85" stroke="#00ff88" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="97" r="2.5" fill="#00ff88" />
        <path d="M100 100 V105" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />

        {/* Floating tech nodes */}
        <circle cx="45" cy="80" r="4" fill="#00ff88" className="animate-bounce" style={{ animationDelay: '0.2s' }} />
        <line x1="45" y1="80" x2="65" y2="70" stroke="rgba(0, 255, 136, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
        
        <circle cx="155" cy="110" r="4" fill="#00ff88" className="animate-bounce" style={{ animationDelay: '0.6s' }} />
        <line x1="155" y1="110" x2="135" y2="100" stroke="rgba(0, 255, 136, 0.4)" strokeWidth="1" strokeDasharray="2 2" />

        <circle cx="120" cy="155" r="3" fill="#00ff88" className="animate-ping" />

        {/* Gradients */}
        <defs>
          <radialGradient id="secGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shieldBorder" x1="55" y1="35" x2="145" y2="145">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00cc6a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function VipCrown({ className = 'w-48 h-48' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        {/* Radial Background Light */}
        <circle cx="100" cy="100" r="70" fill="url(#crownBgGlow)" />
        
        {/* Pedestal */}
        <path d="M60 140 H140 V145 C140 148, 135 150, 100 150 C65 150, 60 148, 60 145 Z" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
        <line x1="50" y1="140" x2="150" y2="140" stroke="rgba(0, 255, 136, 0.5)" strokeWidth="2" strokeLinecap="round" />

        {/* Crown Body */}
        <path d="M55 125 L65 75 L90 100 L100 65 L110 100 L135 75 L145 125 Z" 
          fill="rgba(0, 255, 136, 0.08)" 
          stroke="url(#crownGold)" 
          strokeWidth="2.5" 
          strokeLinejoin="round" 
        />
        
        {/* Crown jewels / glowing dots */}
        <circle cx="65" cy="72" r="4.5" fill="#00ff88" className="shadow-lg" />
        <circle cx="100" cy="62" r="5.5" fill="#00ff88" className="animate-pulse" />
        <circle cx="135" cy="72" r="4.5" fill="#00ff88" />
        
        <circle cx="100" cy="108" r="6" fill="rgba(0, 255, 136, 0.2)" stroke="#00ff88" strokeWidth="1.5" />
        <polygon points="100,104 102,108 106,108 103,110 104,114 100,112 96,114 97,110 94,108 98,108" fill="#00ff88" />

        {/* Sparkles */}
        <path d="M50 60 L52 64 L56 65 L52 66 L50 70 L48 66 L44 65 L48 64 Z" fill="#00ff88" className="animate-pulse" />
        <path d="M150 55 L151.5 58 L155 59 L151.5 60 L150 63 L148.5 60 L145 59 L148.5 58 Z" fill="#00ff88" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
        
        <defs>
          <radialGradient id="crownBgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="crownGold" x1="55" y1="65" x2="145" y2="125">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#00cc6a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function DocumentVector({ className = 'w-48 h-48' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        <circle cx="100" cy="100" r="75" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.05)" />
        
        {/* Back Document Sheet */}
        <rect x="75" y="55" width="60" height="85" rx="6" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" transform="rotate(-6 105 97.5)" />
        
        {/* Main Document Sheet */}
        <rect x="65" y="60" width="60" height="85" rx="6" fill="rgba(5, 5, 5, 0.9)" stroke="url(#docBorder)" strokeWidth="2" />
        
        {/* Document lines */}
        <line x1="77" y1="80" x2="113" y2="80" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeLinecap="round" />
        <line x1="77" y1="92" x2="113" y2="92" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeLinecap="round" />
        <line x1="77" y1="104" x2="100" y2="104" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" strokeLinecap="round" />
        
        {/* Checkmark badge */}
        <circle cx="120" cy="135" r="16" fill="#050505" stroke="#00ff88" strokeWidth="2" className="shadow-lg" />
        <path d="M114 135 L118 139 L126 131" stroke="#00ff88" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        <defs>
          <linearGradient id="docBorder" x1="65" y1="60" x2="125" y2="145">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0, 255, 136, 0.4)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function EmptyInboxVector({ className = 'w-40 h-40' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        {/* Glowing aura */}
        <circle cx="100" cy="100" r="50" fill="url(#inboxGlow)" />
        
        {/* Inbox Tray */}
        <path d="M50 110 L65 145 H135 L150 110" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" fill="rgba(20, 20, 20, 0.4)" strokeLinejoin="round" />
        <path d="M50 110 H75 C80 110, 85 115, 90 120 H110 C115 115, 120 110, 125 110 H150" stroke="#00ff88" strokeWidth="2" fill="none" />
        
        {/* Floating envelopes */}
        <rect x="80" y="60" width="40" height="26" rx="3" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" transform="rotate(10 100 73)" />
        <path d="M80 63 L100 75 L120 63" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" fill="none" transform="rotate(10 100 73)" />
        
        <defs>
          <radialGradient id="inboxGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

export function ReferralTreeIllustration({ className = 'w-48 h-48' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
        {/* Lines */}
        <path d="M100 55 V100 M100 100 L50 145 M100 100 H150 M150 100 V145" stroke="rgba(0, 255, 136, 0.3)" strokeWidth="2" strokeDasharray="3 3" />
        
        {/* Root Node */}
        <circle cx="100" cy="50" r="16" fill="rgba(0, 255, 136, 0.1)" stroke="#00ff88" strokeWidth="2.5" />
        <circle cx="100" cy="50" r="6" fill="#00ff88" />
        
        {/* Child Node Left */}
        <circle cx="50" cy="145" r="12" fill="#050505" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
        <circle cx="50" cy="145" r="4" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* Child Node Center-Right */}
        <circle cx="150" cy="100" r="14" fill="rgba(0, 255, 136, 0.05)" stroke="#00ff88" strokeWidth="2" />
        <circle cx="150" cy="100" r="5" fill="#00ff88" />
        
        {/* Grandchild Node */}
        <circle cx="150" cy="145" r="10" fill="#050505" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
        <circle cx="150" cy="145" r="3" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* Stats bubbles */}
        <rect x="118" y="32" width="45" height="18" rx="9" fill="rgba(0, 255, 136, 0.1)" stroke="#00ff88" strokeWidth="1" />
        <text x="140" y="44" fill="#00ff88" fontSize="8" fontWeight="bold" textAnchor="middle">YOU</text>
      </svg>
    </div>
  );
}
