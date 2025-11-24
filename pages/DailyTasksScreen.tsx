

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassPanel';
import CoinIcon from '../components/icons/CoinIcon';
import PremiumButton from '../components/PremiumButton';
import { CheckCircleIcon, ForwardIcon } from '@heroicons/react/24/solid';
import { MiningIcon3D, WatchVideosIcon3D, ShareIcon3D, TasksIcon3D } from '../components/icons/TaskIcons';
import { Task, TaskType, User } from '../types';
import BannerAd from '../components/BannerAd';


// Helper function to get a specific icon for each task type
const getTaskIcon = (taskType: TaskType) => {
    switch (taskType) {
        case TaskType.WATCH_3_VIDEOS:
        case TaskType.WATCH_10_VIDEOS:
        case TaskType.WATCH_130_VIDEOS:
            return <WatchVideosIcon3D />;
        case TaskType.BOOST_1000_COINS:
            return <MiningIcon3D />;
        case TaskType.SHARE_APP:
            return <ShareIcon3D />;
        default:
            return <TasksIcon3D />;
    }
};

interface TaskCardProps {
    task: Task;
    user: User;
    onClaim: (taskId: TaskType) => void;
    claimingTaskId: TaskType | null;
    onNavigate: (path: string) => void;
    reward: number; // Reward is now passed from config
}

const TaskCard: React.FC<TaskCardProps> = ({ task, user, onClaim, claimingTaskId, onNavigate, reward }) => {
    const getTaskProgress = (task: Task) => {
        switch (task.id) {
            case TaskType.WATCH_3_VIDEOS: return { progress: user.dailyVideosWatched, target: 3 };
            case TaskType.WATCH_10_VIDEOS: return { progress: user.dailyVideosWatched, target: 10 };
            case TaskType.WATCH_130_VIDEOS: return { progress: user.dailyVideosWatched, target: 130 };
            case TaskType.BOOST_1000_COINS: return { progress: user.boostAdsWatched || 0, target: 30 };
            case TaskType.SHARE_APP: return { progress: 0, target: 1 };
            default: return { progress: 0, target: 1 };
        }
    };

    const { progress, target } = getTaskProgress(task);
    const isCompleted = task.isCompleted;
    const isShareTask = task.id === TaskType.SHARE_APP;
    const isProgressSufficient = progress >= target;
    const isClaimable = !isCompleted && (isProgressSufficient || isShareTask);
    const progressPercent = target > 0 ? Math.min((progress / target) * 100, 100) : 0;

    return (
        <GlassCard className={`!p-4 relative overflow-hidden transition-all duration-300 ${isCompleted ? 'opacity-50' : 'hover:border-brand-purple/50 hover:-translate-y-1'}`}>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-black/30 rounded-xl flex items-center justify-center p-2 border border-white/10">
                    {getTaskIcon(task.id)}
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold text-white text-lg">{task.title}</h3>
                    <p className="text-xs text-gray-400">{task.description}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                    <CoinIcon className="w-5 h-5" />
                    <span className="font-bold text-brand-gold text-lg">{reward}</span>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <div className="flex-grow">
                    {!isCompleted && !isShareTask && (
                        <div>
                            <div className="w-full bg-black/50 rounded-full h-4 shadow-inset-deep border border-white/10 p-1">
                                <div
                                    className="relative bg-gradient-to-r from-brand-blue to-brand-purple h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                >
                                    <span className="absolute inset-0 text-center text-[10px] font-bold text-white leading-tight">{Math.floor(progressPercent)}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                     {isCompleted && <div className="h-4"></div>} {/* Placeholder for alignment */}
                </div>
                <div className="w-48 flex-shrink-0">
                    {isCompleted ? (
                        <div className="w-full h-11 flex items-center justify-center font-bold text-sm rounded-lg bg-green-500/30 text-green-200 border border-green-500/30">
                            <CheckCircleIcon className="w-5 h-5 mr-2" /> Completed
                        </div>
                    ) : isClaimable ? (
                        <PremiumButton
                            onClick={() => onClaim(task.id)}
                            disabled={claimingTaskId === task.id}
                            className="!h-11 !text-sm !from-brand-gold !to-yellow-500 !text-black"
                        >
                            {claimingTaskId === task.id ? 'Claiming...' : 'Claim Reward'}
                        </PremiumButton>
                    ) : (
                        <PremiumButton
                            onClick={() => {
                                if (task.id.startsWith('WATCH_')) onNavigate('/watch');
                                if (task.id === TaskType.BOOST_1000_COINS) onNavigate('/cloud-mining');
                                if (task.id === TaskType.SHARE_APP) onNavigate('/profile');
                            }}
                            className="!h-11 !text-sm !bg-gray-700/50 !shadow-none"
                            icon={<ForwardIcon className="w-4 h-4" />}
                        >
                            Progress ({progress}/{target})
                        </PremiumButton>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};

const DailyTasksScreen = () => {
    const { user, tasks, appConfig, generateApiToken, secureClaimTask } = useData();
    const navigate = useNavigate();
    const [claimingTaskId, setClaimingTaskId] = useState<TaskType | null>(null);

    const handleClaimTask = async (taskId: TaskType) => {
        if (claimingTaskId) return;
        setClaimingTaskId(taskId);
        
        const token = generateApiToken('claimTask', { taskId });
        const success = await secureClaimTask(taskId, token);
        
        if (!success) {
            alert("Failed to claim task. You may not have met the requirements, or you have already claimed it.");
        }
        setClaimingTaskId(null);
    };

    return (
         <div className="p-4 flex flex-col items-center h-full animate-fade-in overflow-y-auto pb-24 space-y-5">
            <GlassCard className="w-full max-w-lg">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-12"><TasksIcon3D /></div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">Daily Tasks</h2>
                </div>
                <div className="space-y-4">
                    {tasks.map(task => {
                        const taskConfig = appConfig.taskSettings?.[task.id];
                        if (!taskConfig || !taskConfig.isEnabled) {
                            return null; // Don't render disabled tasks
                        }
                        return (
                            <TaskCard 
                                key={task.id}
                                task={task}
                                user={user}
                                onClaim={handleClaimTask}
                                claimingTaskId={claimingTaskId}
                                onNavigate={navigate}
                                reward={taskConfig.reward}
                            />
                        );
                    })}
                </div>
            </GlassCard>
            <BannerAd />
        </div>
    );
};

export default DailyTasksScreen;