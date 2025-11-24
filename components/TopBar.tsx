import React, { useState, useEffect } from 'react';
import { useData, AudioPlayer } from '../context/DataContext';
import CoinIcon from './icons/CoinIcon';
import { NotificationIcon3D } from './icons/NavIcons';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const TopBar = ({ title, showBackButton }: { title: string, showBackButton?: boolean }) => {
    const { user, notifications } = useData();
    const navigate = useNavigate();
    const unreadCount = notifications.filter(n => !n.read).length;

    const [displayCoins, setDisplayCoins] = useState(user.coins);

    useEffect(() => {
        // Animate for coin gains to provide rewarding feedback.
        if (user.coins > displayCoins) {
            const difference = user.coins - displayCoins;
            const animationDuration = 1500; // ms

            // Determine the number of steps/sounds for the animation.
            // More coins result in more steps, capped at 30 for performance and to keep the animation brief.
            const numSteps = Math.min(Math.floor(difference), 30);
            if (numSteps <= 0) { // If the difference is less than 1, just update directly.
                 setDisplayCoins(user.coins);
                 return;
            }

            const incrementPerStep = difference / numSteps;
            const timePerStep = animationDuration / numSteps;

            let step = 0;
            const timer = setInterval(() => {
                step++;
                // Play a sound on each step to sync with the visual count-up.
                AudioPlayer.playCoinSound();

                if (step >= numSteps) {
                    setDisplayCoins(user.coins); // Ensure it ends on the exact final number.
                    clearInterval(timer);
                } else {
                    setDisplayCoins(prev => prev + incrementPerStep);
                }
            }, timePerStep);

            return () => clearInterval(timer);
        } else if (user.coins < displayCoins) {
             // For subtractions (e.g., withdrawals), provide a smooth count-down animation.
             const difference = displayCoins - user.coins;
             const animationDuration = 800; // ms, faster for a transactional feel

             const numSteps = Math.min(Math.floor(difference), 30);
             if (numSteps <= 0) {
                 setDisplayCoins(user.coins);
                 return;
             }

             const decrementPerStep = difference / numSteps;
             const timePerStep = animationDuration / numSteps;

             let step = 0;
             const timer = setInterval(() => {
                 step++;
                 if (step >= numSteps) {
                     setDisplayCoins(user.coins); // Ensure it ends on the exact final number.
                     clearInterval(timer);
                 } else {
                     setDisplayCoins(prev => prev - decrementPerStep);
                 }
             }, timePerStep);

             return () => clearInterval(timer);
        }
        // If coins haven't changed, do nothing.
    }, [user.coins, displayCoins]);


    return (
        <header className="fixed top-4 left-4 right-4 bg-gradient-to-br from-[#110f1b]/80 to-[#0c0a14]/80 backdrop-blur-2xl p-3 z-50 grid grid-cols-3 items-center shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl">
            {/* Left Section: Back Button */}
            <div className="flex justify-start">
                {showBackButton && (
                    <button 
                        onClick={() => navigate(-1)}
                        className="relative w-10 h-10 flex items-center justify-center bg-black/20 rounded-full border border-white/10 shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-brand-purple/20 hover:border-brand-purple/50 active:scale-95"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-white" />
                    </button>
                )}
            </div>
            
            {/* Center Section: Title */}
            <h1 className="text-xl font-bold text-white tracking-wider text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{title}</h1>
            
            {/* Right Section: Balance & Notifications */}
            <div className="flex items-center gap-4 justify-end">
                <div id="top-bar-balance" className="flex items-center gap-2 bg-black/30 p-2 pl-3 rounded-full shadow-inner shadow-black/50 border border-white/10">
                    <span className="font-bold text-lg text-brand-gold tabular-nums" style={{textShadow: '0 0 10px #FFD700'}}>
                        {Math.floor(displayCoins).toLocaleString()}
                    </span>
                    <CoinIcon className="w-9 h-9" />
                </div>
                <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 text-white transition-transform duration-200 hover:scale-110 active:scale-95">
                    <NotificationIcon3D />
                    {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-dark-bg animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
}

export default TopBar;