import React from 'react';
import GlassCard from '../components/GlassPanel';
import { MOCK_LEADERBOARD } from '../data/mock';
import { useData } from '../context/DataContext';
import { LeaderboardIcon3D } from '../components/icons/NavIcons';
import { GoldMedalIcon, SilverMedalIcon, BronzeMedalIcon } from '../components/icons/MedalIcons';
import CoinIcon from '../components/icons/CoinIcon';
import BannerAd from '../components/BannerAd';

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return <div className="w-10 h-10"><GoldMedalIcon /></div>;
    if (rank === 2) return <div className="w-10 h-10"><SilverMedalIcon /></div>;
    if (rank === 3) return <div className="w-10 h-10"><BronzeMedalIcon /></div>;

    return (
        <div className="w-10 h-10 flex items-center justify-center">
            <span className="font-bold text-lg text-gray-300">{rank}</span>
        </div>
    );
};

const LeaderboardScreen = () => {
    const { user } = useData();
    const leaderboardData = MOCK_LEADERBOARD;
    
    return (
        <div className="p-6 flex flex-col items-center h-full animate-fade-in">
            <GlassCard className="w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12"><LeaderboardIcon3D /></div>
                    <h1 className="text-2xl font-bold">Leaderboard</h1>
                </div>
                
                <div className="space-y-3">
                    {leaderboardData.map((player, index) => {
                        const isCurrentUser = player.name === user.name;
                        const isTopThree = index < 3;
                        const rankGlowClasses: { [key: number]: string } = {
                            0: 'border-brand-gold/80 shadow-glow-gold',
                            1: 'border-brand-silver/80 shadow-lg shadow-brand-silver/40',
                            2: 'border-brand-bronze/80 shadow-lg shadow-brand-bronze/40',
                        };

                        return (
                             <div 
                                key={player.rank}
                                className={`
                                    flex items-center gap-4 p-3 rounded-2xl transition-all border-2 shadow-inset-deep backdrop-blur-xl
                                    ${isCurrentUser ? 'bg-brand-purple/40 border-white/50 scale-105' : 'bg-black/30 border-white/10'}
                                    ${isTopThree ? rankGlowClasses[index] : ''}
                                `}
                             >
                                <RankBadge rank={player.rank} />
                                <div className="flex-grow">
                                    <p className={`font-bold text-lg ${isCurrentUser ? 'text-white' : 'text-gray-200'}`}>{player.name}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full">
                                    <CoinIcon className="w-5 h-5" />
                                    <span className="font-semibold text-white">{player.coins.toLocaleString()}</span>
                                </div>
                             </div>
                        );
                    })}
                </div>
            </GlassCard>
            <BannerAd />
        </div>
    );
};

export default LeaderboardScreen;