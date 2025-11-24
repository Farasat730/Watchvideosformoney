import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassPanel';
import { useData } from '../context/DataContext';
import PremiumButton from '../components/PremiumButton';
import { ProfileIcon3D, ContactIcon3D, TreasureIcon3D } from '../components/icons/NavIcons';
import { DevicePhoneMobileIcon, FilmIcon, PencilSquareIcon, InformationCircleIcon, PowerIcon, CheckIcon, XMarkIcon, Cog6ToothIcon, ShareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import BannerAd from '../components/BannerAd';
import WhatsAppSupportWidget from '../components/WhatsAppSupportWidget';

const StatCard = ({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string | number, delay: number }) => (
    <div 
        className="relative overflow-hidden bg-gradient-to-br from-[#1a1b2e]/80 to-[#151621]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 group hover:-translate-y-1 hover:shadow-glow-purple hover:border-brand-purple/50"
        style={{ animation: `fade-in 0.8s ease-out ${delay}ms forwards`, opacity: 0 }}
    >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 ease-in-out -translate-x-full group-hover:translate-x-0"></div>
        <div className="bg-black/40 p-3 rounded-full shadow-inset-deep border border-white/10 z-10">
            {icon}
        </div>
        <div className="z-10">
            <p className="font-extrabold text-white text-xl tracking-wide">{value}</p>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">{label}</p>
        </div>
    </div>
);


const ProfileScreen = () => {
    const { user, appConfig, secureUpdateUserName, logout, generateApiToken, isSoundEnabled, toggleSound, isAdminAuthenticated } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const navigate = useNavigate();
    
    const inputStyles = "w-full text-center text-3xl font-black bg-black/40 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300 shadow-inset-3d placeholder-gray-400";

    const handleSave = async () => {
        if (name.trim()) {
            const token = generateApiToken("updateUserName", { name });
            const success = await secureUpdateUserName(name, token);
            if (success) {
                setIsEditing(false);
            } else {
                alert("Failed to update name. Please try again.");
            }
        }
    };
    
    const handleShare = async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#/login?ref=${user.referralCode}`;
        const shareText = `Join Watch & Earn! Use my code ${user.referralCode} to get a bonus of ${appConfig.referralSettings.newUserBonus} coins! You can earn too.`;
    
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Watch & Earn!',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error: any) {
                if (error.name !== 'AbortError') console.error('Web Share API error:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert('Invite link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy link:', err);
                alert('Could not copy invite link.');
            }
        }
    };
    
    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(user.referralCode);
            alert('Referral code copied!');
        } catch (err) {
            console.error('Failed to copy code:', err);
            alert('Could not copy code.');
        }
    };


    const SectionHeader = ({ title, delay }: { title: string; delay: number }) => (
        <div 
            className="flex items-center justify-center"
            style={{ animation: `fade-in 0.6s ease-out ${delay}ms forwards`, opacity: 0 }}
        >
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest text-center">
                {title}
            </h2>
        </div>
    );

    return (
        <div className="p-4 flex flex-col items-center justify-start h-full animate-fade-in overflow-y-auto pb-24 space-y-5">
            
            <GlassCard className="w-full max-w-md !p-6 sm:!p-8 relative">
                <WhatsAppSupportWidget />
                
                {/* Header Section */}
                <div 
                    className="flex flex-col items-center text-center pb-5"
                    style={{ animation: 'fade-in 0.6s ease-out 0ms forwards', opacity: 0 }}
                >
                    <div className="relative mb-4">
                        <div className="w-28 h-28 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center shadow-2xl shadow-brand-purple/40 p-1">
                             <div className="absolute -inset-1 rounded-full border-2 border-brand-purple/50 animate-pulse" style={{animationDuration: '4s'}}></div>
                            <div className="w-full h-full bg-dark-bg rounded-full flex items-center justify-center">
                                <div className="scale-125"><ProfileIcon3D /></div>
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="w-full flex flex-col items-center gap-4 mt-2 animate-fade-in">
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputStyles}
                                autoFocus
                            />
                            <div className="flex w-full gap-3 mt-2">
                                <PremiumButton onClick={handleSave} className="w-full !from-green-500 !to-emerald-600 !shadow-green-500/40" icon={<CheckIcon className="w-5 h-5"/>}>Save</PremiumButton>
                                <button onClick={() => setIsEditing(false)} className="w-1/3 h-12 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm border-2 border-white/10 font-bold text-white tracking-wider transition-all duration-300 hover:border-red-500/50 hover:bg-red-900/30 active:scale-95 gap-2">
                                   <XMarkIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-1 mt-2">
                             <div className="flex items-center gap-2 group">
                                 <h1 className="text-3xl font-black text-white transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300" style={{textShadow: '0 0 25px rgba(255,255,255,0.7), 0 0 10px rgba(109,40,217,0.5)'}}>{user.name}</h1>
                                 <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10 active:scale-90 opacity-50 group-hover:opacity-100">
                                    <PencilSquareIcon className="w-5 h-5" />
                                 </button>
                             </div>
                             <p className="font-semibold text-gray-400 text-sm">{user.email}</p>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className="py-5 border-t border-white/10 space-y-4">
                    <SectionHeader title="Statistics" delay={200} />
                    <div className="grid grid-cols-2 gap-4 pt-3">
                         <StatCard 
                            icon={<DevicePhoneMobileIcon className="w-6 h-6 text-white" />}
                            label="Device ID"
                            value={user.deviceId}
                            delay={300}
                         />
                         <StatCard 
                            icon={<FilmIcon className="w-6 h-6 text-white" />}
                            label="Ads Watched"
                            value={user.totalAdsWatched.toLocaleString()}
                            delay={400}
                         />
                    </div>
                </div>

                {/* Refer & Earn Section */}
                {appConfig.featureFlags.isReferralSystemEnabled === 'live' && (
                    <div className="py-5 border-t border-white/10" style={{ animation: `fade-in 0.6s ease-out 500ms forwards`, opacity: 0 }}>
                        <SectionHeader title="Refer & Earn" delay={0} />
                        <GlassCard className="!bg-black/20 !p-4 mt-3">
                            <div className="text-center space-y-4">
                                <p className="text-gray-300 text-sm">Share your code! When a friend watches {appConfig.referralSettings.referralRequirementAds} ads, you get <span className="font-bold text-brand-gold">{appConfig.referralSettings.referrerBonus}</span> coins and they get <span className="font-bold text-brand-gold">{appConfig.referralSettings.newUserBonus}</span> coins!</p>
                                <div className="bg-dark-bg p-3 rounded-lg border-2 border-dashed border-white/20">
                                    <p className="text-xs text-gray-400">YOUR REFERRAL CODE</p>
                                    <p className="text-2xl font-bold tracking-[0.2em] text-brand-gold">{user.referralCode}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleCopyCode} className="w-1/3 h-12 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-sm border-2 border-white/10 font-bold text-white tracking-wider transition-all duration-300 hover:border-brand-purple/50 hover:bg-brand-purple/20 active:scale-95 gap-2">
                                        <DocumentDuplicateIcon className="w-5 h-5"/>
                                    </button>
                                    <PremiumButton onClick={handleShare} className="w-2/3" icon={<ShareIcon className="w-5 h-5"/>}>Share Link</PremiumButton>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                                    <p className="text-xl font-bold text-white">{user.successfulReferrals || 0}</p>
                                    <p className="text-xs text-gray-400 uppercase">Friends Joined</p>
                                </div>
                                <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                                    <p className="text-xl font-bold text-brand-gold">{user.referralEarnings.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400 uppercase">Referral Coins</p>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}


                {/* Settings Section */}
                <div className="py-5 border-t border-white/10 space-y-3">
                    <SectionHeader title="Settings" delay={500} />
                    <div 
                        className="pt-3 space-y-3"
                        style={{ animation: 'fade-in 0.6s ease-out 600ms forwards', opacity: 0 }}
                    >
                        {isAdminAuthenticated && (
                            <PremiumButton
                                onClick={() => navigate('/admin')}
                                icon={<div className="w-6 h-6"><TreasureIcon3D /></div>}
                                className="!bg-gradient-to-br !from-amber-400 !to-yellow-600 !shadow-lg !shadow-yellow-500/40 focus:!ring-amber-400/50 animate-glow-gold-strong hover:brightness-110"
                            >
                                Admin Panel
                            </PremiumButton>
                        )}
                        <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Cog6ToothIcon className="w-6 h-6 text-gray-300"/>
                                <span className="font-semibold text-white">UI Sound Effects</span>
                            </div>
                            <button
                                onClick={toggleSound}
                                aria-pressed={isSoundEnabled}
                                className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple ${
                                    isSoundEnabled ? 'bg-brand-purple' : 'bg-gray-600'
                                }`}
                            >
                                <span className="sr-only">Toggle sound effects</span>
                                <span
                                    className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 shadow-md ${
                                        isSoundEnabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="py-5 border-t border-white/10 space-y-3">
                    <SectionHeader title="More" delay={600} />
                     <div 
                        className="space-y-3 pt-3"
                        style={{ animation: 'fade-in 0.6s ease-out 700ms forwards', opacity: 0 }}
                    >
                        <PremiumButton
                            onClick={() => navigate('/about')}
                            icon={<InformationCircleIcon className="w-6 h-6" />}
                        >
                            About & Rules
                        </PremiumButton>
                        <PremiumButton
                            onClick={() => navigate('/contact')}
                            icon={<ContactIcon3D />}
                        >
                            Contact Us
                        </PremiumButton>
                    </div>
                </div>

                 {/* Logout Section */}
                <div className="pt-5 border-t border-white/10">
                     <PremiumButton
                        onClick={logout}
                        icon={<PowerIcon className="w-6 h-6" />}
                        className="!bg-gradient-to-br !from-red-600/90 !to-red-900/90 focus:!ring-red-500/50"
                        style={{ animation: 'fade-in 0.6s ease-out 800ms forwards', opacity: 0 }}
                    >
                        Logout
                    </PremiumButton>
                </div>
            </GlassCard>

            {/* Banner Ad at the bottom, within the scrollable content area */}
            <BannerAd />

        </div>
    );
};

export default ProfileScreen;