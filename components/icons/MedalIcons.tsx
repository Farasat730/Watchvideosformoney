
import React from 'react';

const MedalIconBase = ({ gradientId, children, rank }: { gradientId: string; children?: React.ReactNode; rank: number }) => (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        {children}
        <g>
            <path d="M16 8 L16 24 L32 32 L48 24 L48 8 L16 8 Z" fill="#4169E1" />
            <path d="M16 24 L32 32 L32 8 L16 8 Z" fill="#8A2BE2" />
            <circle cx="32" cy="42" r="18" fill={`url(#${gradientId})`} stroke="white" strokeWidth="2" />
            <text x="32" y="50" textAnchor="middle" fontSize="24" fontWeight="bold" fill="rgba(0,0,0,0.5)">{rank}</text>
        </g>
    </svg>
);

export const GoldMedalIcon = () => (
    <MedalIconBase gradientId="goldGrad" rank={1}>
        <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFDF00" />
                <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
        </defs>
    </MedalIconBase>
);

export const SilverMedalIcon = () => (
    <MedalIconBase gradientId="silverGrad" rank={2}>
        <defs>
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0E0E0" />
                <stop offset="100%" stopColor="#A0A0A0" />
            </linearGradient>
        </defs>
    </MedalIconBase>
);

export const BronzeMedalIcon = () => (
    <MedalIconBase gradientId="bronzeGrad" rank={3}>
        <defs>
            <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D2691E" />
                <stop offset="100%" stopColor="#8B4513" />
            </linearGradient>
        </defs>
    </MedalIconBase>
);
