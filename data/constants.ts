import React from 'react';
import { VideoCameraIcon, StarIcon, TrophyIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

// FIX: Replaced JSX syntax with React.createElement to resolve compilation errors in a .ts file.
// This is necessary because .ts files are not typically configured to parse JSX.
// UPDATE: Changed keys to be more descriptive and match the new AppConfig structure.
export const tierDetails: { [key: string]: { icon: React.ReactNode; name: string } } = {
    pro_videos: { icon: React.createElement(VideoCameraIcon, { className: "w-8 h-8 text-cyan-400" }), name: 'Pro Videos' },
    master_videos: { icon: React.createElement(StarIcon, { className: "w-8 h-8 text-yellow-400" }), name: 'Master Videos' },
    elite_videos: { icon: React.createElement(TrophyIcon, { className: "w-8 h-8 text-purple-400" }), name: 'Elite Videos' },
    legend_videos: { icon: React.createElement(ShieldCheckIcon, { className: "w-8 h-8 text-red-400" }), name: 'Legend Videos' },
};