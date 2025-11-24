
import React from 'react';

// Shared defs for task icons
const defs = (
    <defs>
        <linearGradient id="taskIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4169E1" />
            <stop offset="100%" stopColor="#A020F0" />
        </linearGradient>
        <filter id="taskIconGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
);

export const TasksIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    {defs}
    <g filter="url(#taskIconGlow)">
        <rect x="12" y="8" width="40" height="48" rx="8" fill="url(#taskIconGrad)" stroke="white" strokeWidth="3" />
        <path d="M22 24 L28 30 L42 18" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 42 L28 48 L42 36" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
</svg>
);


export const WatchVideosIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    {defs}
    <g filter="url(#taskIconGlow)">
        <rect x="8" y="16" width="48" height="32" rx="6" fill="url(#taskIconGrad)" stroke="white" strokeWidth="3"/>
        <path d="M28,26 L42,32 L28,38 Z" fill="white"/>
        <circle cx="20" cy="40" r="2" fill="white" opacity="0.7" />
        <circle cx="44" cy="40" r="2" fill="white" opacity="0.7" />
    </g>
</svg>
);

export const VideoMarathonIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    {defs}
    <g filter="url(#taskIconGlow)">
        <rect x="12" y="12" width="40" height="40" rx="6" fill="url(#taskIconGrad)" stroke="white" strokeWidth="3" />
        <rect x="18" y="18" width="28" height="28" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4" />
        <path d="M28,26 L40,32 L28,38 Z" fill="white"/>
    </g>
</svg>
);

export const ShareIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    {defs}
    <g filter="url(#taskIconGlow)">
        <circle cx="44" cy="18" r="8" fill="url(#taskIconGrad)" stroke="white" strokeWidth="3"/>
        <circle cx="20" cy="32" r="8" fill="url(#taskIconGrad)" stroke="white" strokeWidth="3"/>
        <circle cx="44" cy="46" r="8" fill="url(#taskIconGrad)" stroke="white" strokeWidth="3"/>
        <line x1="26" y1="28" x2="38" y2="22" stroke="white" strokeWidth="3"/>
        <line x1="26" y1="36" x2="38" y2="42" stroke="white" strokeWidth="3"/>
    </g>
</svg>
);

export const MiningIcon3D = () => (
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    {defs}
    <g filter="url(#taskIconGlow)">
        {/* Chip Base */}
        <rect x="14" y="14" width="36" height="36" rx="4" fill="url(#taskIconGrad)" stroke="white" strokeWidth="2.5"/>
        {/* Chip Pins */}
        <line x1="32" y1="8" x2="32" y2="14" stroke="white" strokeWidth="2.5"/>
        <line x1="32" y1="50" x2="32" y2="56" stroke="white" strokeWidth="2.5"/>
        <line x1="8" y1="32" x2="14" y2="32" stroke="white" strokeWidth="2.5"/>
        <line x1="50" y1="32" x2="56" y2="32" stroke="white" strokeWidth="2.5"/>
        
        {/* Pickaxe/Symbol */}
        <path d="M22 32 L32 42 L42 32 M32 42 L32 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="32" r="4" fill="white" opacity="0.8"/>
    </g>
</svg>
);