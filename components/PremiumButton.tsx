import React from 'react';

interface PremiumButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({ onClick, type="button", children, className = '', icon, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`
                relative group w-full h-12 px-5
                inline-flex items-center justify-center
                font-bold text-white tracking-wider
                bg-gradient-to-br from-brand-blue to-brand-purple
                rounded-xl border-2 border-transparent
                shadow-lg shadow-brand-purple/40
                transition-all duration-300 ease-in-out
                transform hover:-translate-y-0.5 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-brand-purple/50
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                overflow-hidden
                ${className}
            `}
        >
            <div className="absolute inset-0 bg-black/30 rounded-[10px] group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="absolute inset-0 shadow-inset-deep rounded-[10px]"></div>
            
            <span className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-30 group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

            <div className="relative flex items-center justify-center gap-3 z-10">
                {icon && <span className="w-6 h-6">{icon}</span>}
                {children}
            </div>

            {!disabled && <div className="absolute -inset-1 bg-gradient-to-br from-brand-blue to-brand-purple rounded-xl opacity-0 group-hover:opacity-70 blur-lg transition-opacity duration-500"></div>}
        </button>
    );
};

export default PremiumButton;