import React from 'react';
import { useData } from '../../context/DataContext';
import GlassCard from '../../components/GlassPanel';
import PremiumButton from '../../components/PremiumButton';
import ToggleSwitch from '../../components/ToggleSwitch';
import { AppConfig, AdButtonConfig, TaskType } from '../../types';
import { ArrowPathIcon, Cog6ToothIcon, EyeIcon, GiftIcon, BeakerIcon, UserPlusIcon, RocketLaunchIcon, StarIcon } from '@heroicons/react/24/solid';

// Helper component for consistent setting rows
// FIX: Changed to React.FC to correctly handle the 'key' prop in lists.
const SettingRow: React.FC<{ title: React.ReactNode, subtitle?: string, children: React.ReactNode, className?: string }> = ({ title, subtitle, children, className = '' }) => (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-2 py-3 border-b border-white/10 last:border-b-0 ${className}`}>
        <div className="flex-grow">
            <h4 className="font-semibold text-md text-white">{title}</h4>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto flex items-center justify-end gap-2">
            {children}
        </div>
    </div>
);

// Reusable editor for a single ad button's configuration
const AdButtonSettingsEditor: React.FC<{ buttonKey: string, config: AdButtonConfig, onConfigChange: (key: string, field: keyof AdButtonConfig, value: any) => void, onReset: (key: string) => void }> = ({ buttonKey, config, onConfigChange, onReset }) => {
    const inputClass = "w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple";
    const selectClass = "bg-black/50 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple";
    const providers = ['AdMob', 'AdManager', 'Test', 'None'];
    const adTypes = ['Rewarded', 'Interstitial', 'Banner'];

    return (
        <div className="bg-black/20 p-4 rounded-lg border border-white/10 space-y-2 mt-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="font-bold text-lg text-brand-cyan">{config.name} <code className="text-xs text-gray-500">({buttonKey})</code></h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400">Enable Button</span>
                    <ToggleSwitch enabled={config.isEnabled} onChange={val => onConfigChange(buttonKey, 'isEnabled', val)} />
                </div>
            </div>
            
            {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
            <SettingRow title={<span className="font-bold">Ad Unit ID</span>} subtitle="This controls AD UNIT for this button.">
                <input type="text" value={config.adUnitId} onChange={e => onConfigChange(buttonKey, 'adUnitId', e.target.value)} className={`${inputClass} !text-left sm:w-64`} placeholder="e.g., ca-app-pub-.../..."/>
            </SettingRow>

            {/* FIX: Wrapped select elements inside SettingRow to provide the required 'children' prop. */}
            <SettingRow title="Ad Provider & Type" subtitle="Select where the ad comes from and its format.">
                <select value={config.provider} onChange={e => onConfigChange(buttonKey, 'provider', e.target.value)} className={`${selectClass} w-1/2 sm:w-auto`}>
                    {providers.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={config.adType} onChange={e => onConfigChange(buttonKey, 'adType', e.target.value)} className={`${selectClass} w-1/2 sm:w-auto`}>
                    {adTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </SettingRow>

            {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
            <SettingRow title={<span className="font-bold">Reward (Coins)</span>} subtitle="This controls REWARD COINS for this button.">
                <input type="number" value={config.reward} onChange={e => onConfigChange(buttonKey, 'reward', parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
            </SettingRow>
            
            {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
            <SettingRow title="Ads Count" subtitle="Daily watch limit for this specific button.">
                <input type="number" value={config.limit} onChange={e => onConfigChange(buttonKey, 'limit', parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
            </SettingRow>

            {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
            <SettingRow title="Cooldown (minutes)" subtitle="Time user must wait after watching.">
                <input type="number" value={config.cooldownMinutes} onChange={e => onConfigChange(buttonKey, 'cooldownMinutes', parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
            </SettingRow>

            {/* Mining Specific Settings */}
            {buttonKey === 'mining_boost' && (
                <>
                    {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                    <SettingRow title="Boost Multiplier" subtitle="e.g., 1.5 for a 50% boost.">
                        <input type="number" step="0.1" value={config.boostMultiplier} onChange={e => onConfigChange(buttonKey, 'boostMultiplier', parseFloat(e.target.value) || 0)} className={`${inputClass} w-24 text-right`} />
                    </SettingRow>
                    {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                    <SettingRow title="Boost Duration (minutes)" subtitle="How long the boost lasts.">
                        <input type="number" value={config.boostDurationMinutes} onChange={e => onConfigChange(buttonKey, 'boostDurationMinutes', parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
                    </SettingRow>
                </>
            )}

            <div className="flex justify-end pt-3">
                <PremiumButton onClick={() => onReset(buttonKey)} className="!w-auto !h-9 !text-xs !from-orange-500 !to-amber-600" icon={<ArrowPathIcon className="w-4 h-4" />}>
                    Reset Progress For All Users
                </PremiumButton>
            </div>
        </div>
    );
};


const AdminAppSettings = () => {
    const { appConfig, adminUpdateAppConfig, adminResetCooldown, adminResetDailyBonusForAllUsers } = useData();
    const inputClass = "w-full bg-black/50 border border-white/10 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple";

    const handleConfigChange = (newConfig: AppConfig) => {
        adminUpdateAppConfig(newConfig);
    };
    
    // Generic handler for nested properties
    const handleNestedChange = (path: (string | number | symbol)[], value: any) => {
        const newConfig = JSON.parse(JSON.stringify(appConfig));
        let current: any = newConfig;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i] as any];
        }
        
        const finalKey = path[path.length - 1];
        
        // FIX: The error indicates a type mismatch when indexing. `finalKey` could be `undefined` if the path is empty,
        // and TypeScript may infer a wider type including `symbol`. This guard ensures `finalKey` is a valid
        // string or number before using it as an index, resolving the type error.
        if (typeof finalKey === 'string' || typeof finalKey === 'number') {
            current[finalKey] = value;
        }

        handleConfigChange(newConfig);
    };

    const handleButtonConfigChange = (buttonKey: string, field: keyof AdButtonConfig, value: any) => {
        handleNestedChange(['adButtonSettings', buttonKey, field], value);
    };

    const handleGlobalAdSettingChange = (field: keyof typeof appConfig.adSettings, value: any) => {
        handleNestedChange(['adSettings', field], value);
    };
    
    const handleResetProgress = (buttonKey: string) => {
        if(window.confirm(`Are you sure you want to reset ALL user progress (watch count and cooldown) for the "${appConfig.adButtonSettings[buttonKey as keyof typeof appConfig.adButtonSettings].name}" button? This cannot be undone.`)) {
            adminResetCooldown(buttonKey);
            alert(`Progress for "${appConfig.adButtonSettings[buttonKey as keyof typeof appConfig.adButtonSettings].name}" has been reset for all users.`);
        }
    };

    const handleResetDailyBonus = () => {
        if(window.confirm(`Are you sure you want to reset ALL users' daily bonus claim progress? They will start back at Day 1. This cannot be undone.`)) {
            adminResetDailyBonusForAllUsers();
            alert(`Daily bonus progress has been reset for all users.`);
        }
    }
    
    const sectionTitleClass = "text-xl font-bold mb-4 pb-2 border-b-2 border-white/10 flex items-center gap-3";
    const buttonKeys = Object.keys(appConfig.adButtonSettings) as (keyof typeof appConfig.adButtonSettings)[];
    const premiumButtonKeys = buttonKeys.filter(k => typeof k === 'string' && k.endsWith('_videos'));
    const homeButtonKey = buttonKeys.find(k => k === 'home_watch');
    const miningBoostKey = buttonKeys.find(k => k === 'mining_boost');
    const taskKeys = Object.keys(appConfig.taskSettings || {}) as TaskType[];

    return (
        <div className="animate-fade-in flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Application Settings</h1>
                <p className="text-gray-400">Manage core application features, rewards, and ad configurations in real-time.</p>
            </div>
            
            <GlassCard>
                <h2 className={sectionTitleClass}><BeakerIcon className="w-6 h-6"/> Global Ad Settings</h2>
                {/* FIX: Wrapped ToggleSwitch element inside SettingRow to provide the required 'children' prop. */}
                <SettingRow title="Admin: Enable Test Ads" subtitle="Forces all ad units to use a 'Test' provider for all users. USE WITH CAUTION.">
                    <ToggleSwitch enabled={appConfig.adSettings.isGlobalTestMode} onChange={val => handleGlobalAdSettingChange('isGlobalTestMode', val)} />
                </SettingRow>
            </GlassCard>

             <GlassCard>
                <h2 className={sectionTitleClass}><Cog6ToothIcon className="w-6 h-6"/> General & Feature Management</h2>
                {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                <SettingRow title="Welcome Bonus" subtitle="Coins given to a new user on their first login.">
                     <input type="number" value={appConfig.globalSettings.welcomeBonus} onChange={e => handleNestedChange(['globalSettings', 'welcomeBonus'], parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
                </SettingRow>
                {/* FIX: Wrapped ToggleSwitch element inside SettingRow to provide the required 'children' prop. */}
                <SettingRow title="Daily Bonus System" subtitle="Enable or disable the entire daily bonus feature.">
                    <ToggleSwitch enabled={appConfig.dailyBonusSettings.isEnabled} onChange={val => handleNestedChange(['dailyBonusSettings', 'isEnabled'], val)} />
                </SettingRow>
                 {/* FIX: Wrapped ToggleSwitch element inside SettingRow to provide the required 'children' prop. */}
                 <SettingRow title="Mining System" subtitle="Enable or disable the cloud mining feature.">
                    <ToggleSwitch enabled={appConfig.featureFlags.isMiningEnabled === 'live'} onChange={val => handleNestedChange(['featureFlags', 'isMiningEnabled'], val ? 'live' : 'maintenance')} />
                </SettingRow>
                 {/* FIX: Wrapped ToggleSwitch element inside SettingRow to provide the required 'children' prop. */}
                 <SettingRow title="Referral System" subtitle="Enable or disable the referral feature.">
                    <ToggleSwitch enabled={appConfig.featureFlags.isReferralSystemEnabled === 'live'} onChange={val => handleNestedChange(['featureFlags', 'isReferralSystemEnabled'], val ? 'live' : 'maintenance')} />
                </SettingRow>
            </GlassCard>
            
            <GlassCard>
                 <h2 className={sectionTitleClass}><RocketLaunchIcon className="w-6 h-6"/> Core Reward Settings</h2>
                 {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                 <SettingRow title="Base Mining Rate (coins/hr)" subtitle="Initial mining speed before any boosts.">
                    <input type="number" step="0.1" value={appConfig.miningSettings.baseRate} onChange={e => handleNestedChange(['miningSettings', 'baseRate'], parseFloat(e.target.value) || 0)} className={`${inputClass} w-24 text-right`} />
                 </SettingRow>
                 {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                 <SettingRow title="Referrer Bonus" subtitle="Coins given to the referrer when their friend joins and watches enough ads.">
                    <input type="number" value={appConfig.referralSettings.referrerBonus} onChange={e => handleNestedChange(['referralSettings', 'referrerBonus'], parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
                 </SettingRow>
                 {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                 <SettingRow title="New User Referral Bonus" subtitle="Bonus coins for a new user who joins using a referral code.">
                    <input type="number" value={appConfig.referralSettings.newUserBonus} onChange={e => handleNestedChange(['referralSettings', 'newUserBonus'], parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
                 </SettingRow>
                 {/* FIX: Wrapped input element inside SettingRow to provide the required 'children' prop. */}
                 <SettingRow title="Referral Ad Requirement" subtitle="Number of ads a new user must watch to credit their referrer.">
                    <input type="number" value={appConfig.referralSettings.referralRequirementAds} onChange={e => handleNestedChange(['referralSettings', 'referralRequirementAds'], parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
                 </SettingRow>
            </GlassCard>
            
            <GlassCard>
                <div className="flex justify-between items-center">
                    <h2 className={sectionTitleClass}><GiftIcon className="w-6 h-6"/> Daily Bonus Rewards</h2>
                    <PremiumButton onClick={handleResetDailyBonus} className="!w-auto !h-9 !text-xs !from-orange-500 !to-amber-600" icon={<ArrowPathIcon className="w-4 h-4" />}>
                        Reset All User Progress
                    </PremiumButton>
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
                    {appConfig.dailyBonusSettings.rewards.map((reward, index) => (
                        <div key={index} className="bg-black/20 p-2 rounded-md text-center">
                             <label className="text-xs font-bold text-gray-300">Day {index + 1}</label>
                             <input 
                                type="number" 
                                value={reward} 
                                onChange={e => handleNestedChange(['dailyBonusSettings', 'rewards', index], parseInt(e.target.value, 10) || 0)}
                                className={`${inputClass} text-center mt-1`} 
                             />
                        </div>
                    ))}
                 </div>
            </GlassCard>

            <GlassCard>
                <h2 className={sectionTitleClass}><StarIcon className="w-6 h-6"/> Daily Task Configuration</h2>
                {taskKeys.map(key => {
                    const taskConfig = appConfig.taskSettings?.[key];
                    const taskInfo = { title: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) };
                    if (!taskConfig) return null;
                    return (
                        // FIX: Ensured the SettingRow component correctly wraps its children to resolve 'children' prop missing error.
                        <SettingRow key={key} title={taskInfo.title}>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-gray-400">Reward</label>
                                <input type="number" value={taskConfig.reward} onChange={e => handleNestedChange(['taskSettings', key, 'reward'], parseInt(e.target.value, 10) || 0)} className={`${inputClass} w-24 text-right`} />
                                <ToggleSwitch enabled={taskConfig.isEnabled} onChange={val => handleNestedChange(['taskSettings', key, 'isEnabled'], val)} />
                            </div>
                        </SettingRow>
                    )
                })}
            </GlassCard>


            {homeButtonKey && (
                 <GlassCard>
                    <h2 className={sectionTitleClass}><EyeIcon className="w-6 h-6"/> Home → Watch Video Button</h2>
                    <AdButtonSettingsEditor 
                        buttonKey={homeButtonKey}
                        config={appConfig.adButtonSettings[homeButtonKey]}
                        onConfigChange={handleButtonConfigChange}
                        onReset={handleResetProgress}
                    />
                </GlassCard>
            )}

            <GlassCard>
                <h2 className={sectionTitleClass}><UserPlusIcon className="w-6 h-6" /> Tasks → Premium Earning Buttons</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {premiumButtonKeys.map(key => (
                         <AdButtonSettingsEditor 
                            key={key}
                            buttonKey={key}
                            config={appConfig.adButtonSettings[key]}
                            onConfigChange={handleButtonConfigChange}
                            onReset={handleResetProgress}
                        />
                    ))}
                </div>
            </GlassCard>

             {miningBoostKey && (
                <GlassCard>
                    <h2 className={sectionTitleClass}><RocketLaunchIcon className="w-6 h-6" /> Tasks → Cloud Mining Boost Button</h2>
                    <AdButtonSettingsEditor 
                        buttonKey={miningBoostKey}
                        config={appConfig.adButtonSettings[miningBoostKey]}
                        onConfigChange={handleButtonConfigChange}
                        onReset={handleResetProgress}
                    />
                </GlassCard>
            )}

             <div className="mt-4 flex justify-end">
                <p className="text-sm text-gray-500 mr-4">Settings are saved automatically on change.</p>
            </div>
        </div>
    );
};

export default AdminAppSettings;