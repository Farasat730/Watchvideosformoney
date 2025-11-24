
import React from 'react';
import GlassCard from '../components/GlassPanel';
import { InfoIcon3D } from '../components/icons/NavIcons';
import { useData } from '../context/DataContext';

const AboutScreen = () => {
    const { appConfig } = useData();
    const { aboutText, rules } = appConfig.globalSettings.content;

    const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in overflow-y-auto">
            <div className="w-full max-w-lg space-y-6">

                <div className="flex justify-center -mb-2">
                    <div className="w-20 h-20"><InfoIcon3D /></div>
                </div>

                {/* About Section */}
                <GlassCard className="w-full border-l-4 border-brand-purple">
                    <h2 className="text-xl font-bold mb-3 text-brand-purple">About The App</h2>
                    <div className="text-gray-300 space-y-3 text-right leading-relaxed whitespace-pre-line" dir="rtl">
                        <p>
                           {aboutText}
                        </p>
                    </div>
                </GlassCard>

                {/* Rules Section */}
                <GlassCard className="w-full border-l-4 border-red-500">
                    <h2 className="text-xl font-bold mb-3 text-red-400">Rules & Regulations</h2>
                    <ul className="text-gray-300 space-y-4 text-right text-sm sm:text-base leading-relaxed" dir="rtl">
                        {rules.map((rule, index) => (
                            <li key={index}>{(emojis[index] || '🔹')} {rule}</li>
                        ))}
                    </ul>
                </GlassCard>
            </div>
        </div>
    );
};

export default AboutScreen;