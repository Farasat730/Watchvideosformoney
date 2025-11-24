import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
            bg-gradient-to-br from-[#110f1b]/80 to-[#0c0a14]/80
            backdrop-blur-2xl
            border border-white/10 rounded-3xl
            shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)]
            p-6
            ${className}
        `}>
            {children}
        </div>
    );
};

export default GlassCard;