import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CoinIcon from '../components/icons/CoinIcon';
import { PlayIcon3D, GiftIcon3D, TasksIcon3D, WalletIcon3D, LeaderboardIcon3D, ProfileIcon3D } from '../components/icons/NavIcons';
import GlassCard from '../components/GlassPanel';
import BannerAd from '../components/BannerAd';
import CategoryCard from '../components/CategoryCard';


const HomeScreen = () => {
    const navigate = useNavigate();
    const { user } = useData();

    return (
        <div className="p-4 flex flex-col gap-5 animate-fade-in">
            
            {/* Balance Card */}
            <div className="w-full max-w-md mx-auto">
                <GlassCard className="!p-5 flex items-center justify-between border-brand-purple/40 shadow-glow-purple">
                    <div>
                        <p className="text-sm text-gray-300 tracking-wider">BALANCE</p>
                        <p className="text-4xl font-bold text-white tracking-tighter" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                            {user.coins.toLocaleString()}
                        </p>
                    </div>
                    <div className="relative">
                        <CoinIcon className="w-20 h-20 animate-float" />
                         <div className="absolute inset-0 rounded-full bg-brand-gold/20 blur-2xl"></div>
                    </div>
                </GlassCard>
            </div>
            
            {/* Navigation Buttons */}
            <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-4">
                <CategoryCard onClick={() => navigate('/watch')} icon={<PlayIcon3D />} label="Watch Videos" />
                <CategoryCard onClick={() => navigate('/bonus')} icon={<GiftIcon3D />} label="Daily Bonus" />
                <CategoryCard onClick={() => navigate('/tasks')} icon={<TasksIcon3D />} label="Tasks" />
                <CategoryCard onClick={() => navigate('/wallet')} icon={<WalletIcon3D />} label="Wallet" />
                <CategoryCard onClick={() => navigate('/leaderboard')} icon={<LeaderboardIcon3D />} label="Leaderboard" />
                <CategoryCard onClick={() => navigate('/profile')} icon={<ProfileIcon3D />} label="Profile" />
            </div>
            <BannerAd />
        </div>
    );
};

export default HomeScreen;