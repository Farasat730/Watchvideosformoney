import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAd } from '../context/AdContext';
import GlassCard from '../components/GlassPanel';
import CoinIcon from '../components/icons/CoinIcon';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';
import BannerAd from '../components/BannerAd';
 
const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const WatchScreen = () => {
    const { user, generateApiToken, secureCreditVideoReward, appConfig } = useData();
    const { showRewardedAd, isRewardedReady } = useAd();
    const [isWatching, setIsWatching] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    const buttonKey = 'home_watch';
    const settings = appConfig.adButtonSettings.home_watch;
    
    if (!settings) return <div>Error: Configuration for this feature is missing.</div>;

    const progress = user.buttonProgress?.[buttonKey] || { watched: 0, cooldownEndTime: 0 };

    const rewardAmount = settings.reward;
    const dailyLimit = settings.limit;
    const watchCount = progress.watched;
    const hasReachedLimit = watchCount >= dailyLimit;
    const cooldownEndTime = progress.cooldownEndTime || 0;

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (cooldownEndTime > Date.now()) {
            const updateTimer = () => {
                const remaining = cooldownEndTime - Date.now();
                if (remaining > 0) {
                    setCooldownRemaining(remaining);
                } else {
                    setCooldownRemaining(0);
                    clearInterval(timer);
                }
            };
            updateTimer();
            timer = setInterval(updateTimer, 1000);
        } else {
            setCooldownRemaining(0);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldownEndTime]);

    const isOnCooldown = cooldownRemaining > 0;
    const canWatch = settings.isEnabled && !hasReachedLimit && !isOnCooldown && !isWatching;

    const handleWatchVideo = () => {
        if (!canWatch || !isRewardedReady) return;
        
        setIsWatching(true);

        showRewardedAd(async () => {
            const token = generateApiToken("creditVideoReward", { buttonKey });
            const success = await secureCreditVideoReward(token);
            
            if (!success) {
                alert("There was an issue crediting your reward. Please try again.");
            }
            setIsWatching(false);
        }, { adId: settings.adUnitId });
    };

    if (!settings.isEnabled) {
         return (
            <div className="p-4 flex flex-col h-full animate-fade-in items-center justify-center">
                <GlassCard className="w-full max-w-md text-center">
                    <h3 className="font-bold text-xl text-yellow-400">Feature Unavailable</h3>
                    <p className="text-sm text-gray-400 mt-2">This feature is temporarily disabled. Please check back later.</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col h-full animate-fade-in relative overflow-hidden">
            <div className="w-full max-w-md mx-auto flex flex-col gap-6">
                
                {/* 1. Reward Info Card */}
                <GlassCard className="!p-4 border-t-2 border-brand-gold/50 shadow-glow-gold/40">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex-shrink-0 bg-brand-gold/10 p-2.5 rounded-xl border border-brand-gold/20">
                           <CoinIcon className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-black text-brand-gold tracking-wide">
                                Earn {rewardAmount} Coins <span className="text-gray-400 font-medium text-sm">per Video</span>
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* 2. Main Action Card */}
                <GlassCard className="!p-6 flex flex-col items-center justify-center min-h-[16rem]">
                    <div className="w-full flex flex-col items-center justify-center gap-4 text-center">
                       {hasReachedLimit ? (
                            <div className="text-red-400 p-4 bg-black/30 rounded-2xl border border-red-500/30">
                                <h3 className="font-bold text-xl">Daily Limit Reached</h3>
                                <p className="text-sm text-gray-400 mt-1">Please come back later.</p>
                            </div>
                        ) : isOnCooldown ? (
                            <div className="text-center text-yellow-400 p-4 bg-black/30 rounded-2xl border border-yellow-500/30">
                                <ClockIcon className="w-10 h-10 mx-auto mb-2" />
                                <h3 className="font-bold text-2xl tracking-widest">{formatTime(cooldownRemaining)}</h3>
                                <p className="text-sm text-gray-400 mt-1">Next video available soon</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold text-gray-200">
                                    {isRewardedReady ? 'Ad is Ready!' : 'Loading Ad...'}
                                </h3>
                                <button
                                    onClick={handleWatchVideo}
                                    disabled={!canWatch || !isRewardedReady}
                                    className="relative group w-28 h-28 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple border-4 border-white/10 shadow-[0_15px_40px_-10px_rgba(109,40,217,0.4)] transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait disabled:shadow-none"
                                >
                                    <div className="absolute inset-0 bg-black/20 rounded-full group-hover:bg-black/10 transition-colors"></div>
                                    <div className="absolute inset-0 animate-glow"></div>
                                    <PlayIcon className="w-12 h-12 text-white relative z-10" />
                                </button>
                                <p className="font-bold text-xl mt-2 text-white">{watchCount} / {dailyLimit}</p>
                                <p className="text-xs text-gray-400">Videos Watched Today</p>
                            </>
                        )}
                    </div>
                </GlassCard>
                <BannerAd/>
            </div>
        </div>
    );
};

export default WatchScreen;