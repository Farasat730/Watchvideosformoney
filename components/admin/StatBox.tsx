import React from 'react';
import GlassCard from '../GlassPanel';

interface StatBoxProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'purple' | 'blue' | 'gold' | 'cyan';
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, icon, color }) => {
    const colorClasses = {
        purple: 'border-brand-purple/50 shadow-glow-purple/40',
        blue: 'border-brand-blue/50 shadow-glow-blue/40',
        gold: 'border-brand-gold/50 shadow-glow-gold/40',
        cyan: 'border-brand-cyan/50 shadow-glow-cyan/40',
    };

    const iconBgClasses = {
        purple: 'bg-brand-purple/20 text-brand-purple',
        blue: 'bg-brand-blue/20 text-brand-blue',
        gold: 'bg-brand-gold/20 text-brand-gold',
        cyan: 'bg-brand-cyan/20 text-brand-cyan',
    }

    return (
        <GlassCard className={`!p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 ${colorClasses[color]}`}>
            <div>
                <p className="text-sm text-gray-400 tracking-wider uppercase">{title}</p>
                <p className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    {value}
                </p>
            </div>
            <div className={`p-4 rounded-full ${iconBgClasses[color]}`}>
                <div className="w-7 h-7 text-white">
                    {icon}
                </div>
            </div>
        </GlassCard>
    );
};

export default StatBox;