

import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassPanel';
import { useData } from '../context/DataContext';
import { WithdrawalMethod, WithdrawalStatus } from '../types';
import CoinIcon from '../components/icons/CoinIcon';
import { LockClosedIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import BannerAd from '../components/BannerAd';

const StatusBadge = ({ status }: { status: WithdrawalStatus }) => {
    const baseClasses = "px-3 py-1 text-xs font-bold rounded-full text-white shadow-md";
    const statusClasses = {
        [WithdrawalStatus.PENDING]: "bg-yellow-500/80",
        [WithdrawalStatus.APPROVED]: "bg-green-500/80",
        [WithdrawalStatus.REJECTED]: "bg-red-500/80",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const WalletScreen = () => {
    const { user, withdrawals, secureRequestWithdrawal, generateApiToken, appConfig } = useData();
    const { withdrawalSettings } = appConfig;

    const [fullName, setFullName] = useState(user.name);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cnic, setCnic] = useState('');
    const [method, setMethod] = useState<WithdrawalMethod>(WithdrawalMethod.JAZZCASH);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [justUnlocked, setJustUnlocked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Core Withdrawal Logic (now driven by dynamic config) ---
    const isFirstWithdrawal = !user.hasMadeFirstWithdrawal;
    const currentTargetPkr = isFirstWithdrawal ? withdrawalSettings.firstWithdrawalTargetPkr : withdrawalSettings.subsequentWithdrawalTargetPkr;
    const currentTargetCoins = currentTargetPkr / withdrawalSettings.coinsToPkrRate;
    
    const canWithdraw = user.coins >= currentTargetCoins;
    const currentPkrValue = user.coins * withdrawalSettings.coinsToPkrRate;
    const progressPercentage = Math.min((user.coins / currentTargetCoins) * 100, 100);

    // --- Unlock Animation Trigger ---
    const [wasLocked, setWasLocked] = useState(!canWithdraw);
    useEffect(() => {
        if (wasLocked && canWithdraw) {
            setJustUnlocked(true);
            setTimeout(() => setJustUnlocked(false), 2500); // Match animation duration
        }
        setWasLocked(!canWithdraw);
    }, [canWithdraw, wasLocked]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!canWithdraw) {
            setError(`You need at least ${currentTargetCoins.toLocaleString()} coins (${currentTargetPkr} PKR) to withdraw.`);
            return;
        }

        if (!fullName.trim() || !phoneNumber || !cnic) {
            setError('Please fill in all account details.');
            return;
        }
        if (!/^\d{11}$/.test(phoneNumber)) {
            setError('Please enter a valid 11-digit phone number.');
            return;
        }
        if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
            setError('Please enter a valid CNIC format (e.g., 12345-1234567-1).');
            return;
        }
        
        setIsProcessing(true);
        const token = generateApiToken('requestWithdrawal', { method, fullName, phoneNumber, cnic });
        const result = await secureRequestWithdrawal({
            method,
            fullName,
            phoneNumber,
            cnic,
        }, token);
        
        if (result.success) {
            setSuccess(result.message);
            setPhoneNumber('');
            setCnic('');
        } else {
            setError(result.message);
        }
        
        setIsProcessing(false);
    };
    
    const inputStyles = "w-full bg-black/40 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300 shadow-inset-3d placeholder-gray-400";
    const labelStyles = "block text-sm font-semibold text-gray-200 mb-2 ml-1";

    return (
        <div className="p-4 flex flex-col h-full animate-fade-in overflow-y-auto pb-24 space-y-5">
            
            {/* Balance Overview Card */}
            <GlassCard className="w-full max-w-md mx-auto !p-5 flex items-center justify-between border-brand-purple/40 shadow-glow-purple flex-shrink-0">
                <div>
                    <p className="text-sm text-gray-300 tracking-wider">BALANCE</p>
                    <p className="text-4xl font-bold text-white tracking-tighter" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        {user.coins.toLocaleString()}
                    </p>
                    <p className="font-semibold text-brand-gold mt-1">≈ {currentPkrValue.toFixed(2)} PKR</p>
                </div>
                <div className="relative">
                    <CoinIcon className="w-20 h-20 animate-float" />
                    <div className="absolute inset-0 rounded-full bg-brand-gold/20 blur-2xl"></div>
                </div>
            </GlassCard>

            {/* Withdrawal Section */}
            <GlassCard className="w-full max-w-md mx-auto text-center !p-6 relative overflow-hidden border-t border-white/20 flex-shrink-0">
                <h2 className="text-xl font-bold text-white mb-2">Withdrawal</h2>
                <p className="text-sm text-gray-400 mb-5">
                    {isFirstWithdrawal 
                        ? `Reach ${withdrawalSettings.firstWithdrawalTargetPkr.toLocaleString()} PKR (${currentTargetCoins.toLocaleString()} coins) for your first withdrawal.`
                        : `Minimum withdrawal is ${withdrawalSettings.subsequentWithdrawalTargetPkr.toLocaleString()} PKR (${currentTargetCoins.toLocaleString()} coins).`}
                </p>

                <div className="mb-5">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-300 mb-2 px-1"><span>Progress to {currentTargetPkr.toLocaleString()} PKR</span><span>{user.coins.toLocaleString()} / {currentTargetCoins.toLocaleString()}</span></div>
                    <div className="w-full h-5 bg-black/50 rounded-full shadow-inset-deep border-2 border-white/10 p-1"><div className="relative h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}><div className="absolute inset-0 bg-white/20 rounded-full" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 0% 40%)'}}></div>{progressPercentage > 5 && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-white">{Math.floor(progressPercentage)}%</span>}</div></div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <button
                        type="submit"
                        disabled={!canWithdraw || isProcessing}
                        className={`relative group w-full h-16 px-6 inline-flex items-center justify-center font-black text-lg tracking-wider rounded-2xl border-2 shadow-lg transition-all duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand-gold/50 overflow-hidden ${canWithdraw ? 'bg-gradient-to-br from-brand-gold to-yellow-500 text-black border-yellow-300 shadow-yellow-400/40 hover:-translate-y-1' : 'bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed shadow-none grayscale'} ${justUnlocked ? 'animate-unlock-glow' : ''} disabled:opacity-70 disabled:cursor-wait`}
                    >
                        <div className="absolute inset-0 bg-black/20 rounded-[14px] group-hover:bg-black/10 transition-colors duration-300"></div>
                        <div className="absolute inset-0 shadow-inset-deep rounded-[14px]"></div>
                        {canWithdraw && <div className="absolute inset-0 animate-glow-gold-strong"></div>}
                        <div className="relative flex items-center justify-center gap-3 z-10">
                            {isProcessing ? <div className="w-6 h-6 border-4 border-black/50 border-t-black rounded-full animate-spin"></div>
                            : canWithdraw ? <ArrowDownTrayIcon className="w-7 h-7" />
                            : <LockClosedIcon className="w-7 h-7" />}
                            <span>{isProcessing ? "Processing..." : canWithdraw ? `Withdraw ${(isFirstWithdrawal ? currentTargetPkr : currentPkrValue).toLocaleString(undefined, {maximumFractionDigits: 0})} PKR` : 'Locked'}</span>
                        </div>
                    </button>
                    
                    <div className={`transition-all duration-500 ease-in-out grid ${canWithdraw ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden space-y-4">
                             <div><label className={labelStyles}>Method</label><div className="grid grid-cols-2 gap-3">{[WithdrawalMethod.JAZZCASH, WithdrawalMethod.EASYPAISA].map(m => (<button key={m} type="button" onClick={() => setMethod(m)} className={`py-3 rounded-xl border-2 transition-all duration-200 font-semibold ${method === m ? 'bg-brand-purple border-white/50 ring-2 ring-white' : 'bg-black/30 border-white/10 hover:bg-white/10'}`}>{m}</button>))}</div></div>
                            <div><label htmlFor="fullName" className={labelStyles}>Full Name</label><input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyles} placeholder="Account Holder Name"/></div>
                            <div><label htmlFor="phoneNumber" className={labelStyles}>Phone Number</label><input id="phoneNumber" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className={inputStyles} placeholder="03xxxxxxxxx"/></div>
                            <div><label htmlFor="cnic" className={labelStyles}>CNIC</label><input id="cnic" type="text" value={cnic} onChange={e => setCnic(e.target.value)} className={inputStyles} placeholder="12345-1234567-1"/></div>
                        </div>
                    </div>
                </form>

                {error && <p className="mt-4 text-sm font-semibold text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
                {success && <p className="mt-4 text-sm font-semibold text-green-400 bg-green-500/10 p-2 rounded-lg border border-green-500/20">{success}</p>}
            </GlassCard>

            <GlassCard className="w-full max-w-md mx-auto flex-shrink-0">
                <h3 className="text-lg font-bold mb-4 text-center">History</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {withdrawals.length > 0 ? withdrawals.map(w => (
                        <div key={w.id} className="bg-black/40 p-3 rounded-xl flex justify-between items-center border border-white/10 shadow-inset-3d">
                            <div><p className="font-bold text-white">{w.amountPkr} PKR</p><p className="text-xs text-gray-400">{new Date(w.date).toLocaleDateString()}</p></div>
                            <StatusBadge status={w.status} />
                        </div>
                    )) : <p className="text-center text-gray-500 py-4">No withdrawal history.</p>}
                </div>
            </GlassCard>
            <BannerAd />
        </div>
    );
};

export default WalletScreen;