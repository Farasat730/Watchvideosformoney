

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAd } from '../context/AdContext';
import GlassCard from '../components/GlassPanel';
import CoinIcon from '../components/icons/CoinIcon';
import { GiftIcon3D } from '../components/icons/NavIcons';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import BannerAd from '../components/BannerAd';

const BonusScreen = () => {
    const { user, appConfig, generateApiToken, secureClaimDailyBonus } = useData();
    const { showInterstitialAd, isInterstitialReady } = useAd();
    const currentDayToClaim = user.lastBonusClaimedDay + 1;

    const { dailyBonusSettings } = appConfig;
    const dailyBonuses = dailyBonusSettings.rewards.map((reward, index) => ({
        day: index + 1,
        reward,
        claimed: user.lastBonusClaimedDay >= index + 1,
    }));

    // Manages loading state for the specific day being claimed to prevent double-clicks
    const [claimingDay, setClaimingDay] = useState<number | null>(null);

    const handleClaimAttempt = async (day: number) => {
        // Prevent action if not claimable or already processing another claim
        if (day !== currentDayToClaim || claimingDay) return;

        setClaimingDay(day); // Set loading state

        showInterstitialAd(async (success) => {
            if (success) {
                // 🔐 SECURITY: Ad was shown. Now, ask the server to verify and grant the reward.
                // The client cannot grant the reward itself.
                const token = generateApiToken("claimDailyBonus", { day });
                const rewarded = await secureClaimDailyBonus(day, token);

                if (!rewarded) {
                    // This can happen if the server detects an issue (e.g., already claimed, invalid day)
                    alert("Failed to claim bonus. It might have already been claimed. Please restart the app.");
                }
                // If successful, the user's balance updates automatically via the DataContext.
            } else {
                // Ad was not shown, so do not attempt to grant a reward.
                console.log("Ad not shown, reward process aborted.");
            }
            setClaimingDay(null); // Reset loading state
        }, { forceShow: true }); // Use forceShow to ensure ad appears for this critical action
    };
    
    if (!dailyBonusSettings.isEnabled) {
        return (
            <div className="p-4 flex flex-col h-full animate-fade-in items-center justify-center">
                <GlassCard className="w-full max-w-md text-center">
                    <h3 className="font-bold text-xl text-yellow-400">Feature Unavailable</h3>
                    <p className="text-sm text-gray-400 mt-2">The Daily Bonus feature is temporarily disabled. Please check back later.</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in overflow-y-auto pb-24">
            <GlassCard className="w-full max-w-lg text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12"><GiftIcon3D /></div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-md">Daily Bonus</h1>
                </div>
                <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                    Claim your reward every day to build up your streak! Rewards increase each consecutive day.
                </p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 justify-center">
                    {dailyBonuses.map(bonus => {
                        const isClaimed = bonus.claimed;
                        const isClaimableToday = bonus.day === currentDayToClaim;
                        const isLocked = bonus.day > currentDayToClaim;

                        // UI states for the button
                        const isProcessing = claimingDay === bonus.day;
                        const isAdNotReady = isClaimableToday && !isInterstitialReady;

                        return (
                            <div 
                                key={bonus.day}
                                className={`
                                    relative group p-3 rounded-2xl flex flex-col items-center justify-between aspect-square transition-all duration-300
                                    overflow-hidden shadow-xl shadow-black/50
                                    border-t-2
                                    ${isClaimableToday 
                                        ? 'bg-gradient-to-br from-brand-purple/40 to-brand-blue/40 border-brand-gold shadow-[0_0_20px_rgba(255,215,0,0.3)] animate-pulse' 
                                        : 'bg-[#1a1b2e]/60 border-white/5'}
                                    ${isLocked ? 'opacity-50 grayscale-[50%]' : ''}
                                `}
                            >
                                <div className="absolute inset-0 shadow-inset-deep rounded-2xl pointer-events-none"></div>

                                <span className="font-extrabold text-xl text-white tracking-wider z-10" style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>Day {bonus.day}</span>
                                
                                <div className="flex-grow flex flex-col items-center justify-center gap-1.5 z-10 mt-2">
                                    <CoinIcon className="w-10 h-10" style={{ filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' }} />
                                    <span className="font-black text-3xl text-brand-gold leading-none" style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.9))' }}>
                                        {bonus.reward}
                                    </span>
                                </div>

                                {/* Status Overlay / Button */}
                                {isClaimed ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                                        <CheckCircleIcon className="w-12 h-12 text-green-400 animate-fade-in" style={{ filter: 'drop-shadow(0 0 15px rgba(74,222,128,0.8))' }} />
                                        <span className="mt-2 text-xs font-bold text-green-300 uppercase tracking-widest">CLAIMED</span>
                                    </div>
                                ) : isClaimableToday ? (
                                    <button 
                                        disabled={isProcessing || isAdNotReady}
                                        onClick={() => handleClaimAttempt(bonus.day)}
                                        className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-br from-brand-gold to-yellow-500 text-black text-base font-black uppercase rounded-b-2xl shadow-xl shadow-yellow-500/40 transition-all duration-300 flex items-center justify-center gap-2 z-20 ${isProcessing || isAdNotReady ? 'cursor-wait opacity-80' : 'hover:brightness-110 active:scale-95'}`}
                                    >
                                        {isProcessing ? (
                                            <div className="w-6 h-6 border-4 border-black/50 border-t-black rounded-full animate-spin"></div>
                                        ) : isAdNotReady ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-black/50 border-t-black rounded-full animate-spin"></div>
                                                <span className="text-xs">Loading Ad...</span>
                                            </>
                                        ) : (
                                            <span style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>CLAIM</span>
                                        )}
                                    </button>
                                ) : (
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/60 text-gray-300 text-base font-black uppercase rounded-b-2xl flex items-center justify-center gap-2 z-20">
                                        <LockClosedIcon className="w-6 h-6"/> LOCKED
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </GlassCard>
            <BannerAd />
        </div>
    );
};

export default BonusScreen;