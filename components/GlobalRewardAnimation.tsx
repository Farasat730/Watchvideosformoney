import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import CoinIcon from './icons/CoinIcon';

const GlobalRewardAnimation = () => {
    const { rewardTrigger } = useData();
    const [coins, setCoins] = useState<{ id: number; style: React.CSSProperties }[]>([]);

    useEffect(() => {
        if (!rewardTrigger) return;

        // The animation now targets the balance display in the top bar for a more logical flow.
        const balanceDisplay = document.getElementById('top-bar-balance');
        if (!balanceDisplay) return;

        const rect = balanceDisplay.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        const numCoins = Math.min(Math.floor(rewardTrigger.amount), 12) + 6; // 6 to 18 coins

        const newCoins = Array.from({ length: numCoins }).map((_, i) => {
            const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 150;
            const startY = window.innerHeight * 0.9;
            
            const floatUpX = startX + (Math.random() - 0.5) * 80;
            const floatUpY = startY - 120 - (Math.random() * 60);

            return {
                id: Date.now() + i,
                initialStyle: {
                    position: 'fixed',
                    left: `${startX}px`,
                    top: `${startY}px`,
                    opacity: 0,
                    transform: 'translate(-50%, -50%) scale(0)',
                },
                floatUpStyle: {
                    left: `${floatUpX}px`,
                    top: `${floatUpY}px`,
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1)',
                    transition: `all 0.4s cubic-bezier(0.33, 1, 0.68, 1) ${i * 30}ms`,
                },
                toWalletStyle: {
                    left: `${targetX}px`,
                    top: `${targetY}px`,
                    opacity: 0,
                    transform: 'translate(-50%, -50%) scale(0.2)',
                    transition: `all ${0.8 + Math.random() * 0.4}s cubic-bezier(0.5, 0, 0.75, 1), opacity 0.2s linear ${0.7 + Math.random() * 0.4}s`,
                    transitionDelay: `${i * 40}ms`,
                }
            };
        });

        setCoins(newCoins.map(c => ({ id: c.id, style: c.initialStyle })));

        setTimeout(() => {
            setCoins(newCoins.map(c => ({ id: c.id, style: { ...c.initialStyle, ...c.floatUpStyle } })));
        }, 50);

        setTimeout(() => {
            setCoins(newCoins.map(c => ({ id: c.id, style: { ...c.initialStyle, ...c.floatUpStyle, ...c.toWalletStyle } })));
        }, 450);
        
        setTimeout(() => {
            setCoins([]);
        }, 3000);

    }, [rewardTrigger]);

    if (!coins.length) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {coins.map(coin => (
                <div key={coin.id} style={coin.style}>
                     <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                        {/* 3D Bubble & Glow Effect */}
                        <div 
                            className="absolute inset-0 rounded-full" 
                            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 70%)' }}
                        ></div>
                        <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-lg animate-fade-pulse" style={{ animationDuration: '2s' }}></div>
                        
                        {/* Coin Icon */}
                        <CoinIcon className="w-full h-full drop-shadow-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GlobalRewardAnimation;
