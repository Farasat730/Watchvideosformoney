import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassPanel';
import { useData } from '../../context/DataContext';
import { AntiCheatLog } from '../../types';
import { ShieldExclamationIcon, TrashIcon } from '@heroicons/react/24/solid';
import PremiumButton from '../../components/PremiumButton';

const CheatTypeBadge = ({ type }: { type: string }) => {
    const baseClasses = "px-2 py-0.5 text-xs font-bold rounded-full text-white shadow-md inline-block";
    const typeClasses = {
        'Multiple Accounts': "bg-red-500/80",
        'Rapid Invalid Requests': "bg-yellow-500/80",
        'Developer Console Accessed': "bg-purple-500/80",
        'Invalid API Token': "bg-orange-500/80",
        default: "bg-gray-500/80",
    };
    const colorClass = typeClasses[type as keyof typeof typeClasses] || typeClasses.default;
    return <span className={`${baseClasses} ${colorClass}`}>{type}</span>;
};


const AdminSecurityLogs = () => {
    const { antiCheatLogs, adminClearSecurityLogs } = useData();
    const navigate = useNavigate();

    const handleClearLogs = () => {
        if (window.confirm("Are you sure you want to permanently delete all security logs? This action cannot be undone.")) {
            adminClearSecurityLogs();
        }
    };

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in">
            <div className="w-full max-w-4xl space-y-6">

                <div className="flex justify-center items-center gap-4 -mb-2">
                    <div className="w-16 h-16"><ShieldExclamationIcon className="text-red-400"/></div>
                </div>

                <GlassCard className="w-full">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                        <h2 className="text-2xl font-bold text-center sm:text-left">Anti-Cheat Security Logs</h2>
                        <PremiumButton onClick={handleClearLogs} disabled={antiCheatLogs.length === 0} className="!w-full sm:!w-auto !h-10 !text-sm !from-red-600 !to-red-800" icon={<TrashIcon className="w-4 h-4"/>}>
                            Clear All Logs
                        </PremiumButton>
                    </div>

                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {antiCheatLogs.length > 0 ? (
                            antiCheatLogs.map((log: AntiCheatLog) => (
                                <div key={log.id} className={`p-4 rounded-2xl border-l-4 bg-black/40 border-red-500/60`}>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <CheatTypeBadge type={log.cheatType} />
                                                <span className="font-bold text-lg text-white">{log.userName}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-1">{log.details}</p>
                                            <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                                <span>UID: {log.userUid}</span>
                                                <span>Device: {log.deviceId}</span>
                                                <span>Time: {new Date(log.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <PremiumButton onClick={() => navigate(`/admin/users/${log.userUid}`)} className="!h-9 !w-full sm:!w-auto !text-xs">
                                            Manage User
                                        </PremiumButton>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-10">No suspicious activities have been logged.</p>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default AdminSecurityLogs;