import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { User } from '../../types';
import GlassCard from '../../components/GlassPanel';
import PremiumButton from '../../components/PremiumButton';
import { ArrowLeftIcon, CurrencyDollarIcon, ShieldExclamationIcon, ShieldCheckIcon, ArrowPathIcon, StopCircleIcon } from '@heroicons/react/24/solid';

const AdminUserDetail = () => {
    const { userUid } = useParams<{ userUid: string }>();
    const navigate = useNavigate();
    const { allUsers, adminUpdateUser, adminResetUserDailyState, adminResetUserMiningCycle } = useData();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const foundUser = allUsers.find(u => u.uid === userUid);
        setUser(foundUser || null);
    }, [userUid, allUsers]);

    const handleBlockToggle = () => {
        if (user) {
            adminUpdateUser(user.uid, { isBlocked: !user.isBlocked });
        }
    };

    const handleCoinChange = () => {
        if (!user) return;
        const amountStr = prompt(`Enter coin amount to add to ${user.name}'s balance (use '-' for subtraction):`);
        if (amountStr) {
            const amount = parseInt(amountStr, 10);
            if (!isNaN(amount)) {
                adminUpdateUser(user.uid, { coins: Math.max(0, user.coins + amount) });
            } else {
                alert("Invalid number entered.");
            }
        }
    };
    
    const handleResetDaily = () => {
        if (user && window.confirm(`Are you sure you want to reset all daily tasks and video watch counts for ${user.name}? This cannot be undone.`)) {
            adminResetUserDailyState(user.uid);
        }
    };

    const handleResetMining = () => {
        if (user && window.confirm(`Are you sure you want to stop the mining cycle and reset all boosts for ${user.name}?`)) {
            adminResetUserMiningCycle(user.uid);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold">User not found.</h1>
                <PremiumButton onClick={() => navigate('/admin/users')} className="mt-4 !w-auto">
                    Back to User List
                </PremiumButton>
            </div>
        );
    }
    
    const statItemClass = "bg-black/30 p-3 rounded-lg flex justify-between items-center border border-white/5";
    const statLabelClass = "text-sm text-gray-400";
    const statValueClass = "font-bold text-white text-md";

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to User List
            </button>

            <GlassCard>
                <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-white/10">
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">User ID: {user.uid}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                         <PremiumButton 
                            onClick={handleBlockToggle} 
                            icon={user.isBlocked ? <ShieldCheckIcon className="w-5 h-5" /> : <ShieldExclamationIcon className="w-5 h-5" />}
                            className={`!h-12 !text-sm ${user.isBlocked ? '!from-green-500 !to-emerald-600' : '!from-red-600 !to-rose-800'}`}
                        >
                            {user.isBlocked ? 'Unblock' : 'Block'} User
                        </PremiumButton>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Actions</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <PremiumButton onClick={handleCoinChange} icon={<CurrencyDollarIcon className="w-5 h-5" />} className="!h-12 !text-sm !bg-gradient-to-br !from-indigo-500 !to-purple-600">
                            Adjust Coins
                        </PremiumButton>
                         <PremiumButton onClick={handleResetDaily} icon={<ArrowPathIcon className="w-5 h-5" />} className="!h-12 !text-sm !bg-gradient-to-br !from-orange-500 !to-amber-600">
                            Reset Daily State
                        </PremiumButton>
                         <PremiumButton onClick={handleResetMining} icon={<StopCircleIcon className="w-5 h-5" />} className="!h-12 !text-sm !bg-gradient-to-br !from-cyan-500 !to-sky-600">
                            Reset Mining Cycle
                        </PremiumButton>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                    <h2 className="text-xl font-bold mb-4">User Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className={statItemClass}><span className={statLabelClass}>Current Balance</span> <span className={statValueClass}>{user.coins.toLocaleString()} Coins</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Total Ads Watched</span> <span className={statValueClass}>{user.totalAdsWatched.toLocaleString()}</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Daily Videos Today</span> <span className={statValueClass}>{user.dailyVideosWatched}</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Daily Bonus Day</span> <span className={statValueClass}>{user.lastBonusClaimedDay}</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Referral Earnings</span> <span className={statValueClass}>{user.referralEarnings.toLocaleString()} Coins</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Mining Active</span> <span className={statValueClass}>{user.miningStartTime ? 'Yes' : 'No'}</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Device ID</span> <span className={`${statValueClass} text-xs`}>{user.deviceId}</span></div>
                        <div className={statItemClass}><span className={statLabelClass}>Last Login</span> <span className={statValueClass}>{new Date(user.lastLogin).toLocaleString()}</span></div>
                         <div className={statItemClass}><span className={statLabelClass}>First Withdrawal Made</span> <span className={statValueClass}>{user.hasMadeFirstWithdrawal ? 'Yes' : 'No'}</span></div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminUserDetail;
