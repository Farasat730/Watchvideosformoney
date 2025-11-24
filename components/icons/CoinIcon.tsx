import React from 'react';

// FIX: Added `style` prop to allow for dynamic styling, specifically for width and height.
const CoinIcon = ({ className = 'w-6 h-6', style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <defs>
      <radialGradient id="coinShine" cx="0.25" cy="0.25" r="0.35">
        <stop offset="0%" stopColor="#FFFBEF" />
        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="coinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
       <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>
    </defs>
    <g style={{ filter: 'url(#glow)' }} filter="url(#dropShadow)">
        <circle cx="50" cy="50" r="48" fill="#B8860B" />
        <circle cx="50" cy="50" r="45" fill="url(#coinGradient)" />
        <path d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 M50,15 A35,35 0 1,1 50,85 A35,35 0 1,1 50,15" fill="#DAA520" fillOpacity="0.5" />
        <circle cx="50" cy="50" r="45" fill="url(#coinShine)" opacity="0.8"/>
        <text x="50" y="68" textAnchor="middle" fontSize="45" fontWeight="bold" fill="#B8860B" opacity="0.7">$</text>
    </g>
  </svg>
);

export default CoinIcon;
