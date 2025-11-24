import React from 'react';
import { useData } from '../../context/DataContext';
import StatBox from '../../components/admin/StatBox';
import { UserGroupIcon, ClockIcon, CurrencyDollarIcon, ShieldCheckIcon, EyeIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import GlassCard from '../../components/GlassPanel';
import { WithdrawalStatus } from '../../types';

const AdminDashboard = () => {
    const { allUsers, withdrawals, appConfig, adminActivityLogs } = useData();

    const totalUsers = allUsers.length;
    const pendingWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.PENDING).length;
    const totalCoinsInCirculation = allUsers.reduce((sum, user) => sum + user.coins, 0);
    const totalAdsWatched = allUsers.reduce((sum, user) => sum + user.totalAdsWatched, 0);
    
    const totalEarningsGiven = withdrawals
        .filter(w => w.status === WithdrawalStatus.APPROVED)
        .reduce((sum, w) => sum + w.amountPkr, 0);

    // FIX: Explicitly typed the 'count' accumulator as a number to prevent type inference issues.
    const activeFeaturesCount = Object.values(appConfig.featureFlags).reduce((count: number, status) => {
        if (typeof status === 'string' && status === 'live') {
            return count + 1;
        }
        // FIX: Added a null check for 'status' to ensure type safety with `typeof status === 'object'`.
        if (typeof status === 'object' && status !== null) { // nested ads object
            return count + Object.values(status).filter(s => s === 'live').length;
        }
        return count;
    }, 0);


    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">A high-level overview of your application's metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                <StatBox title="Total Users" value={totalUsers} icon={<UserGroupIcon />} color="purple" />
                <StatBox title="Pending Withdrawals" value={pendingWithdrawals} icon={<ClockIcon />} color="gold" />
                <StatBox title="Total Ads Watched" value={totalAdsWatched.toLocaleString()} icon={<EyeIcon />} color="cyan" />
                <StatBox title="Total Earnings Given" value={`PKR ${totalEarningsGiven.toLocaleString()}`} icon={<CurrencyDollarIcon />} color="purple" />
                <StatBox title="Active Features" value={activeFeaturesCount} icon={<ChartBarIcon />} color="gold" />
                <StatBox title="Coins in Circulation" value={totalCoinsInCirculation.toLocaleString()} icon={<ShieldCheckIcon />} color="cyan" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Latest Logs</h2>
                     <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {adminActivityLogs.slice(0, 10).map(log => (
                            <div key={log.id} className="bg-black/30 p-2.5 rounded-lg border border-white/5 text-xs">
                                <p className="text-gray-300">{log.action}</p>
                                <p className="text-gray-500 text-right mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </GlassCard>
                <GlassCard className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Analytics</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-md font-semibold mb-2 text-gray-300">User Growth</h3>
                            <div className="w-full h-40 bg-black/30 rounded-lg border border-white/10 p-4 flex items-end justify-between">
                                {/* Mock graph with divs */}
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '20%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '35%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '30%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '50%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '65%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '80%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '75%'}}></div>
                                <div className="w-4 bg-gradient-to-t from-brand-purple to-brand-blue rounded-t-sm" style={{height: '95%'}}></div>
                            </div>
                        </div>
                         <p className="text-center text-gray-500 py-2">More graphs & analytics coming soon...</p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default AdminDashboard;