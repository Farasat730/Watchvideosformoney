

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CategoryCard from '../components/CategoryCard';
import { MiningIcon3D } from '../components/icons/TaskIcons';
import { TasksIcon3D } from '../components/icons/NavIcons';
import { BoltIcon } from '@heroicons/react/24/solid';
import { InviteIcon3D } from '../components/icons/NavIcons';
import BannerAd from '../components/BannerAd';
import GlassCard from '../components/GlassPanel';

const TasksScreen = () => {
    const navigate = useNavigate();
    const { appConfig } = useData();

    return (
        <div className="p-4 flex flex-col gap-5 animate-fade-in">

             <GlassCard className="w-full max-w-md mx-auto text-center">
                <h1 className="text-2xl font-bold text-white drop-shadow-md">Earning Features</h1>
                <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                    Explore different ways to earn coins within the app.
                </p>
            </GlassCard>
            
            <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-4">
                <CategoryCard
                    onClick={() => navigate('/cloud-mining')}
                    icon={<MiningIcon3D />}
                    label="Cloud Mining"
                    disabled={appConfig.featureFlags.isMiningEnabled !== 'live'}
                />
                <CategoryCard
                    onClick={() => navigate('/daily-tasks')}
                    icon={<TasksIcon3D />}
                    label="Daily Tasks"
                />
                <CategoryCard
                    onClick={() => navigate('/profile')}
                    icon={<InviteIcon3D />}
                    label="Refer & Earn"
                    disabled={appConfig.featureFlags.isReferralSystemEnabled !== 'live'}
                />
                <CategoryCard
                    onClick={() => navigate('/more-features')}
                    icon={<div className="w-12 h-12 flex items-center justify-center"><BoltIcon className="w-8 h-8 text-yellow-400"/></div>}
                    label="More Earnings"
                    disabled={appConfig.featureFlags.isUpcomingFeaturesEnabled !== 'live'}
                />
            </div>
            <BannerAd />
        </div>
    );
};

export default TasksScreen;