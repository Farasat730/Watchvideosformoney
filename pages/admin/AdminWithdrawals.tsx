import React from 'react';
import { useData } from '../../context/DataContext';
import { Withdrawal, WithdrawalStatus } from '../../types';
import GlassCard from '../../components/GlassPanel';
import PremiumButton from '../../components/PremiumButton';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface WithdrawalCardProps {
    w: Withdrawal;
    onApprove: () => void;
    onReject: () => void;
}

const WithdrawalCard: React.FC<WithdrawalCardProps> = ({ w, onApprove, onReject }) => (
    <div className="bg-black/40 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-white/10 shadow-inset-deep">
        <div>
            <p className="font-bold text-lg">{w.userName} <span className="text-sm text-gray-400 font-normal">({w.userUid})</span></p>
            <p className="text-sm">Amount: <span className="text-green-400 font-semibold">{w.amountPkr} PKR</span> ({w.amountCoins.toLocaleString()} coins)</p>
            <p className="text-sm">Method: <span className="font-semibold">{w.method}</span></p>
            <p className="text-sm">Account: <span className="font-semibold">{w.accountInfo.phoneNumber}</span></p>
            <p className="text-sm">CNIC: <span className="font-semibold">{w.accountInfo.cnic}</span></p>
            <p className="text-xs text-gray-500 mt-1">Date: {new Date(w.date).toLocaleDateString()}</p>
        </div>
        {w.status === WithdrawalStatus.PENDING && (
            <div className="flex gap-3">
                <PremiumButton 
                    onClick={onApprove} 
                    className="!h-10 !text-xs !px-3 !from-green-500 !to-green-700" 
                    icon={<CheckCircleIcon className="w-4 h-4"/>}
                >
                    Approve
                </PremiumButton>
                <PremiumButton 
                    onClick={onReject} 
                    className="!h-10 !text-xs !px-3 !from-red-500 !to-red-700" 
                    icon={<XCircleIcon className="w-4 h-4"/>}
                >
                    Reject
                </PremiumButton>
            </div>
        )}
    </div>
);

const AdminWithdrawals = () => {
    const { withdrawals, updateWithdrawalStatus } = useData();

    const pendingWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.PENDING);
    const approvedWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.APPROVED);
    const rejectedWithdrawals = withdrawals.filter(w => w.status === WithdrawalStatus.REJECTED);

    return (
        <div className="animate-fade-in flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Withdrawal Management</h1>
                <p className="text-gray-400">Review and process user withdrawal requests.</p>
            </div>
            
            <GlassCard>
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Pending Requests ({pendingWithdrawals.length})</h2>
                <div className="space-y-4">
                    {pendingWithdrawals.length > 0 ? (
                        pendingWithdrawals.map((w: Withdrawal) => (
                            <WithdrawalCard
                                key={w.id}
                                w={w}
                                onApprove={() => updateWithdrawalStatus(w.id, WithdrawalStatus.APPROVED)}
                                onReject={() => updateWithdrawalStatus(w.id, WithdrawalStatus.REJECTED)}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">No pending withdrawals.</p>
                    )}
                </div>
            </GlassCard>

            <GlassCard>
                <h2 className="text-xl font-bold mb-4 text-green-400">Approved History ({approvedWithdrawals.length})</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                     {approvedWithdrawals.length > 0 ? (
                        approvedWithdrawals.map(w => (
                           <div key={w.id} className="bg-black/20 p-4 rounded-xl flex justify-between items-center gap-4 border border-white/5 opacity-80">
                                <div>
                                     <p className="font-bold text-md">{w.userName}</p>
                                     <p className="text-sm">{w.amountPkr} PKR via {w.method}</p>
                                     <p className="text-xs text-gray-500 mt-1">Date: {new Date(w.date).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 text-xs font-bold rounded-full text-white shadow bg-green-500/80">
                                    {w.status}
                                </span>
                           </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">No approved withdrawals.</p>
                    )}
                </div>
            </GlassCard>

            <GlassCard>
                <h2 className="text-xl font-bold mb-4 text-red-400">Rejected History ({rejectedWithdrawals.length})</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                     {rejectedWithdrawals.length > 0 ? (
                        rejectedWithdrawals.map(w => (
                           <div key={w.id} className="bg-black/20 p-4 rounded-xl flex justify-between items-center gap-4 border border-white/5 opacity-80">
                                <div>
                                     <p className="font-bold text-md">{w.userName}</p>
                                     <p className="text-sm">{w.amountPkr} PKR via {w.method}</p>
                                     <p className="text-xs text-gray-500 mt-1">Date: {new Date(w.date).toLocaleDateString()}</p>
                                </div>
                                <span className="px-3 py-1 text-xs font-bold rounded-full text-white shadow bg-red-500/80">
                                    {w.status}
                                </span>
                           </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">No rejected withdrawals.</p>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminWithdrawals;