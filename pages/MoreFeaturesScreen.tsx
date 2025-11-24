import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassPanel';
import BannerAd from '../components/BannerAd';
import { useData } from '../context/DataContext';
import { useAd } from '../context/AdContext';
import { PlayIcon } from '@heroicons/react/24/solid';
import CoinIcon from '../components/icons/CoinIcon';
import { tierDetails } from '../data/constants';
import { AdButtonConfig } from '../types';

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};


const TierTaskCard: React.FC<{ tierKey: string; settings: AdButtonConfig }> = ({ tierKey, settings }) => {
    const { user, generateApiToken, secureCreditVideoReward } = useData();
    const { showRewardedAd, isRewardedReady } = useAd();
    const [isWatching, setIsWatching] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    const tierProgress = user.buttonProgress?.[tierKey] || { watched: 0, cooldownEndTime: 0 };
    const { watched: watchCount, cooldownEndTime } = tierProgress;
    const { limit, reward, adUnitId } = settings;

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
    const hasReachedLimit = watchCount >= limit;
    const canWatch = !hasReachedLimit && !isOnCooldown && !isWatching;

    const handleWatchVideo = () => {
        if (!canWatch || !isRewardedReady) return;
        
        setIsWatching(true);

        showRewardedAd(async () => {
            const token = generateApiToken("creditVideoReward", { buttonKey: tierKey });
            await secureCreditVideoReward(token);
            setIsWatching(false);
        }, { adId: adUnitId });
    };

    const progressPercentage = Math.min((watchCount / limit) * 100, 100);

    return (
        <GlassCard className="!p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 bg-black/30 rounded-xl flex items-center justify-center border border-white/10">
                    {tierDetails[tierKey]?.icon}
                </div>
                <div>
                    <h3 className="font-bold text-white">{tierDetails[tierKey]?.name}</h3>
                    <p className="text-sm font-semibold text-brand-gold flex items-center gap-1">
                        <CoinIcon className="w-4 h-4"/>
                        <span>{reward} Coins per Ad</span>
                    </p>
                </div>
            </div>
            
             <div>
                <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-300">Daily Progress</p>
                    <p className="text-xs font-bold text-white bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                        {watchCount} <span className="text-gray-400">/ {limit}</span>
                    </p>
                </div>
                <div className="w-full bg-black/50 rounded-full h-3.5 shadow-inset-deep border border-white/10 p-0.5">
                    <div 
                        className="relative bg-gradient-to-r from-brand-blue to-brand-purple h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            <div className="h-12 flex items-center justify-center">
                {hasReachedLimit ? (
                    <p className="font-bold text-red-400">Daily limit reached. Come back tomorrow.</p>
                ) : isOnCooldown ? (
                    <div className="text-center">
                        <p className="text-yellow-400 font-bold text-xl">{formatTime(cooldownRemaining)}</p>
                        <p className="text-xs text-gray-400">Cooldown Active</p>
                    </div>
                ) : (
                    <button
                        onClick={handleWatchVideo}
                        disabled={!isRewardedReady || isWatching}
                        className="relative group w-full h-12 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple border-2 border-transparent shadow-lg shadow-brand-purple/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <div className="absolute inset-0 bg-black/20 rounded-[6px] group-hover:bg-black/10 transition-colors"></div>
                        <div className="relative z-10 flex items-center justify-center text-white font-bold gap-2">
                            {isWatching ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> 
                            : isRewardedReady ? <> <PlayIcon className="w-5 h-5"/> Watch Ad </>
                            : <> <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Loading... </> }
                        </div>
                    </button>
                )}
            </div>

        </GlassCard>
    );
};


const MoreFeaturesScreen = () => {
    const { appConfig } = useData();
    const { adButtonSettings } = appConfig;
    const tierOrder = ['pro_videos', 'master_videos', 'elite_videos', 'legend_videos'];

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in overflow-y-auto pb-24">
            <div className="w-full max-w-lg space-y-5">
                <GlassCard>
                    <h2 className="text-xl font-bold mb-2 text-center">Premium Earning Features</h2>
                    <p className="text-center text-gray-400 mb-6 text-sm">
                        Complete these tasks daily for high rewards. Each task is independent.
                    </p>
                </GlassCard>

                {tierOrder.map((key) => {
                    const tierKey = key as keyof typeof adButtonSettings;
                    const settings = adButtonSettings[tierKey];
                    if (!settings || !settings.isEnabled) return null;

                    return (
                        <TierTaskCard
                            key={key}
                            tierKey={key}
                            settings={settings}
                        />
                    );
                })}

                <BannerAd />
            </div>
        </div>
    );
};

export default MoreFeaturesScreen;