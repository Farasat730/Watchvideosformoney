


import React from 'react';

// Each icon is a self-contained SVG with its own gradients and filters
// to simulate a 3D, glossy, and glowing effect.

export const HomeIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="homegrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8A2BE2" />
        <stop offset="100%" stopColor="#4169E1" />
      </linearGradient>
      <filter id="iconGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#iconGlow)">
      <path d="M54.5,29.5 L32,8.5 L9.5,29.5" stroke="white" strokeWidth="4" fill="none" strokeLinejoin="round" />
      <path d="M14.5,24.5 L14.5,55.5 L49.5,55.5 L49.5,24.5" fill="url(#homegrad)" stroke="white" strokeWidth="4" strokeLinejoin="round" />
      <rect x="24.5" y="39.5" width="15" height="16" fill="rgba(255,255,255,0.5)" rx="3" />
    </g>
</svg>
);

export const TasksIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tasksgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8A2BE2" />
        <stop offset="100%" stopColor="#4169E1" />
      </linearGradient>
    </defs>
    <g filter="url(#iconGlow)">
      <rect x="12" y="8" width="40" height="48" rx="8" fill="url(#tasksgrad)" stroke="white" strokeWidth="3" />
      <line x1="20" y1="22" x2="44" y2="22" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="34" x2="44" y2="34" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="46" x2="34" y2="46" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" />
    </g>
</svg>
);

export const WalletIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="walletgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5F9EA0" />
        <stop offset="100%" stopColor="#4682B4" />
      </linearGradient>
    </defs>
    <g filter="url(#iconGlow)">
      <rect x="8" y="16" width="48" height="32" rx="6" fill="url(#walletgrad)" stroke="white" strokeWidth="3" />
      <path d="M8,24 L32,24 C38,24 38,32 44,32 L56,32" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
      <circle cx="48" cy="32" r="5" fill="white" />
    </g>
</svg>
);

export const LeaderboardIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trophygrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>
    <g filter="url(#iconGlow)">
      <path d="M16,10 C16,4 20,4 22,10 L42,10 C44,4 48,4 48,10" stroke="white" strokeWidth="3" fill="none" />
      <path d="M12,12 L52,12 V30 C52,40 42,48 32,48 C22,48 12,40 12,30 Z" fill="url(#trophygrad)" stroke="white" strokeWidth="3" />
      <rect x="24" y="46" width="16" height="8" fill="#B8860B" stroke="white" strokeWidth="2" />
    </g>
</svg>
);

export const ProfileIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
      <circle cx="32" cy="24" r="12" fill="url(#homegrad)" stroke="white" strokeWidth="3" />
      <path d="M16,56 C16,44 23,40 32,40 C41,40 48,44 48,56 Z" fill="url(#homegrad)" stroke="white" strokeWidth="3" />
    </g>
</svg>
);

export const PlayIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
        <circle cx="32" cy="32" r="28" fill="url(#homegrad)" stroke="white" strokeWidth="3"/>
        <path d="M26,20 L46,32 L26,44 Z" fill="white"/>
    </g>
</svg>
);

export const GiftIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
        <rect x="10" y="24" width="44" height="28" rx="6" fill="url(#homegrad)" stroke="white" strokeWidth="3"/>
        <path d="M10,24 L54,24 L50,14 L14,14 Z" fill="#A020F0" stroke="white" strokeWidth="3"/>
        <rect x="28" y="12" width="8" height="12" fill="#FFD700"/>
        <rect x="28" y="24" width="8" height="28" fill="#FFD700" opacity="0.7"/>
    </g>
</svg>
);

export const InfoIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
        <circle cx="32" cy="32" r="28" fill="url(#homegrad)" stroke="white" strokeWidth="3"/>
        <line x1="32" y1="28" x2="32" y2="46" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="32" cy="18" r="3" fill="white"/>
    </g>
</svg>
);

export const AppLogo3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="appLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A020F0" />
        <stop offset="100%" stopColor="#4169E1" />
      </linearGradient>
      <filter id="appLogoGlow">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#appLogoGlow)">
        <path d="M12 12 L24 52 L32 36 L40 52 L52 12 L44 12 L36 40 L32 24 L28 40 L20 12 Z" fill="url(#appLogoGrad)" stroke="white" strokeWidth="3" strokeLinejoin="round" />
        <path d="M12 12 L24 52 L32 36 L40 52 L52 12 L44 12 L36 40 L32 24 L28 40 L20 12 Z" fill="rgba(255,255,255,0.2)" />
    </g>
</svg>
);

export const InviteIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
      <circle cx="26" cy="24" r="10" fill="url(#homegrad)" stroke="white" strokeWidth="2.5" />
      <path d="M16,48 C16,38 20,34 26,34 C32,34 36,38 36,48 Z" fill="url(#homegrad)" stroke="white" strokeWidth="2.5" />
      <circle cx="45" cy="38" r="14" fill="#A020F0" stroke="white" strokeWidth="2.5" />
      <line x1="45" y1="32" x2="45" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <line x1="39" y1="38" x2="51" y2="38" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </g>
</svg>
);

export const ContactIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
      <rect x="8" y="14" width="48" height="36" rx="6" fill="url(#homegrad)" stroke="white" strokeWidth="3"/>
      <path d="M8 18 L32 36 L56 18" stroke="rgba(255,255,255,0.8)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="22" y="10" width="20" height="8" rx="4" fill="#A020F0" stroke="white" strokeWidth="2"/>
    </g>
</svg>
);

export const NotificationIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#iconGlow)">
      <path d="M32,10 C42,10 48,16 48,24 L48,38 C48,42 52,44 52,48 L12,48 C12,44 16,42 16,38 L16,24 C16,16 22,10 32,10 Z" fill="url(#homegrad)" stroke="white" strokeWidth="3" />
      <path d="M26,50 C26,54 38,54 38,50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="8" r="3" fill="white" />
    </g>
</svg>
);

export const TreasureIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="100%" stopColor="#A0522D" />
      </linearGradient>
      <linearGradient id="goldGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
    <g filter="url(#iconGlow)">
        {/* Box lid */}
        <path d="M10 28 C 10 18, 54 18, 54 28 L 54 32 L 10 32 Z" fill="url(#woodGrad)" stroke="white" strokeWidth="2.5" />
        {/* Box bottom */}
        <rect x="10" y="32" width="44" height="20" rx="4" fill="url(#woodGrad)" stroke="white" strokeWidth="2.5" />
        {/* Gold Trim */}
        <path d="M8 28 L 56 28 L 56 34 L 8 34 Z" fill="url(#goldGradIcon)" stroke="#654321" strokeWidth="1" />
        {/* Lock */}
        <circle cx="32" cy="42" r="6" fill="url(#goldGradIcon)" />
        <rect x="29" y="46" width="6" height="4" fill="#654321" />
        <circle cx="32" cy="42" r="2" fill="#654321" />
    </g>
</svg>
);
