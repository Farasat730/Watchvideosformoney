

import React from 'react';
import { AppLogo3D } from '../components/icons/NavIcons';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen w-full font-sans bg-dark-bg text-white overflow-hidden flex flex-col items-center justify-center p-4 relative">
            {/* Premium background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 via-dark-bg to-dark-bg"></div>
            
            <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center gap-12 animate-fade-in" style={{ perspective: '1000px' }}>
                
                {/* 3D Rotating App Logo */}
                <div className="relative w-48 h-48">
                    {/* Soft background glow */}
                    <div className="absolute -inset-4 bg-brand-purple rounded-full shadow-glow-soft-blue animate-pulse" style={{ animationDuration: '4s' }}></div>

                    {/* The 3D rotating element */}
                    <div className="w-full h-full animate-rotate-3d" style={{ transformStyle: 'preserve-3d', animationDuration: '8s' }}>
                       <div className="scale-150"><AppLogo3D /></div>
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white tracking-wider mb-2 animate-fade-pulse" style={{ textShadow: '0 0 25px white, 0 0 40px #6d28d9', animationDuration: '2.5s' }}>
                        Welcome
                    </h1>
                     <h2 
                        className="text-lg font-semibold text-gray-300 tracking-[0.2em] uppercase"
                    >
                        to Watch & Earn
                    </h2>
                </div>

            </div>
        </div>
    );
};

export default LoadingScreen;