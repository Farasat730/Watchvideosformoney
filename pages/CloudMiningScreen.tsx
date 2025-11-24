import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAd } from '../context/AdContext';
import GlassCard from '../components/GlassPanel';
import PremiumButton from '../components/PremiumButton';
import { BoltIcon, ClockIcon } from '@heroicons/react/24/solid';
import { MiningIcon3D } from '../components/icons/TaskIcons';
import BannerAd from '../components/BannerAd';

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const CloudMiningScreen = () => {
    const { user, appConfig, generateApiToken, secureStartMining, secureBoostMining } = useData();
    const { showRewardedAd, isRewardedReady } = useAd();
    
    const [minedCoins, setMinedCoins] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isStartingMining, setIsStartingMining] = useState(false);
    const [isBoosting, setIsBoosting] = useState(false);
    
    const { miningSettings, featureFlags, adButtonSettings } = appConfig;
    const isMiningActive = user.miningStartTime && (Date.now() - user.miningStartTime < miningSettings.cycleDurationHours * 3600 * 1000);
    
    const baseRate = miningSettings.baseRate;
    const boostPerAd = miningSettings.boostPerAd;
    const boostAmount = (user.boostAdsWatched || 0) * boostPerAd;
    const totalRate = baseRate + boostAmount;
    const isBoostEnabled = featureFlags.isMiningBoostEnabled === 'live';
    const boostButtonSettings = adButtonSettings.mining_boost;


    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isMiningActive && user.miningStartTime) {
            const cycleEndTime = user.miningStartTime + miningSettings.cycleDurationHours * 3600 * 1000;
            
            const updateValues = () => {
                const now = Date.now();
                const elapsedMs = now - (user.miningStartTime || 0);
                const elapsedSeconds = elapsedMs / 1000;
                
                const currentMined = (elapsedSeconds / 3600) * totalRate;
                setMinedCoins(currentMined);
                
                const remaining = cycleEndTime - now;
                setTimeRemaining(remaining > 0 ? remaining : 0);
            };
            
            updateValues();
            interval = setInterval(updateValues, 1000);
        } else {
            setMinedCoins(0);
            setTimeRemaining(0);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isMiningActive, user.miningStartTime, totalRate, miningSettings.cycleDurationHours]);

    const handleStartMining = async () => {
        setIsStartingMining(true);
        const token = generateApiToken('startMining');
        await secureStartMining(token);
        setIsStartingMining(false);
    };

    const handleBoost = () => {
        if (!isRewardedReady || isBoosting || !isBoostEnabled || !boostButtonSettings.isEnabled) return;
        setIsBoosting(true);
        showRewardedAd(async () => {
            const token = generateApiToken('boostMining');
            const success = await secureBoostMining(token);
            if (!success) {
                alert("Boost failed. You might be in a cooldown period.");
            }
            setIsBoosting(false);
        }, { adId: boostButtonSettings.adUnitId });
    };

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in space-y-5">
             <GlassCard className="w-full max-w-lg text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12"><MiningIcon3D /></div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">Cloud Mining</h2>
                </div>

                <div className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-inset-deep">
                    <p className="text-sm text-gray-400">Coins Mined This Session</p>
                    <p className="text-4xl font-black text-brand-gold tracking-tighter my-2" style={{textShadow: '0 0 15px rgba(255,215,0,0.6)'}}>{minedCoins.toFixed(4)}</p>
                    <div className="flex justify-around items-center text-xs">
                        <div className="text-center">
                            <p className="text-gray-400">Base Rate</p>
                            <p className="font-bold text-white">{baseRate.toFixed(1)}/hr</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400">Boost</p>
                            <p className="font-bold text-white">+{boostAmount.toFixed(1)}/hr</p>
                        </div>
                        <div className="text-center text-brand-cyan">
                            <p>Total Rate</p>
                            <p className="font-bold">{totalRate.toFixed(1)}/hr</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-4">
                    {isMiningActive ? (
                        <div className="space-y-3">
                            <div className="bg-green-500/20 text-green-300 font-semibold p-3 rounded-xl border border-green-500/30 flex items-center justify-center gap-2">
                                <ClockIcon className="w-6 h-6"/>
                                <span>Time Remaining: {formatTime(timeRemaining)}</span>
                            </div>
                            <PremiumButton onClick={handleBoost} disabled={!isRewardedReady || isBoosting || !isBoostEnabled || !boostButtonSettings.isEnabled} icon={<BoltIcon className="w-5 h-5"/>}>
                                {isBoosting ? 'Boosting...' : `Boost Speed (+${boostPerAd}/hr)`}
                            </PremiumButton>
                        </div>
                    ) : (
                        <PremiumButton onClick={handleStartMining} disabled={isStartingMining}>
                            {isStartingMining ? 'Starting...' : 'Start 24-Hour Mining Session'}
                        </PremiumButton>
                    )}
                </div>
            </GlassCard>
            <BannerAd />
        </div>
    );
};

export default CloudMiningScreen;