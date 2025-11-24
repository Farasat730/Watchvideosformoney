import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface CategoryCardProps {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    className?: string;
    disabled?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ onClick, icon, label, className, disabled = false }) => (
    <div
        onClick={!disabled ? onClick : undefined}
        className={`
            relative group overflow-hidden
            bg-[#110f1b]/80 backdrop-blur-xl border border-white/10 rounded-2xl
            p-4 flex flex-col items-center justify-center gap-3 h-32
            transform transition-all duration-300
            shadow-xl shadow-black/50
            ${disabled
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer hover:bg-brand-purple/20 hover:border-brand-purple/80 hover:-translate-y-1.5 hover:shadow-glow-purple active:scale-95 active:translate-y-0'
            }
            ${className}
        `}
    >
        {/* Inner shadow for 3D effect */}
        <div className="absolute inset-0 shadow-inset-deep rounded-[22px] opacity-50"></div>

        {/* Shine effect on hover */}
        {!disabled && <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-700 ease-in-out"></div>}
        
        <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
            {icon}
        </div>
        <span className="relative font-semibold text-white text-center text-sm tracking-wide">{label}</span>

        {disabled && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 rounded-2xl">
                <LockClosedIcon className="w-8 h-8 text-gray-400" />
            </div>
        )}
    </div>
);

export default CategoryCard;
