import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon3D, TasksIcon3D, WalletIcon3D, LeaderboardIcon3D, ProfileIcon3D } from './icons/NavIcons';

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    return (
        <NavLink 
            to={to} 
            className="group flex flex-col items-center justify-center gap-1.5 transition-all duration-300 transform text-gray-400 hover:text-white active:scale-90"
        >
            {({ isActive }) => (
                <>
                    <div className={`relative transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                        {isActive && <div className="absolute -inset-2.5 bg-brand-purple rounded-full blur-xl opacity-40 animate-pulse"></div>}
                        <div className="relative w-9 h-9">
                            {icon}
                        </div>
                    </div>
                    <span className={`text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-white' : ''}`}>{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNav = () => {
    return (
        <nav className="fixed bottom-4 left-4 right-4 bg-gradient-to-br from-[#110f1b]/80 to-[#0c0a14]/80 backdrop-blur-2xl border border-white/10 p-2 z-50 rounded-2xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)]">
            <div className="flex justify-around items-center max-w-lg mx-auto h-16">
                <NavItem to="/" icon={<HomeIcon3D />} label="Home" />
                <NavItem to="/tasks" icon={<TasksIcon3D />} label="Tasks" />
                <NavItem to="/wallet" icon={<WalletIcon3D />} label="Wallet" />
                <NavItem to="/leaderboard" icon={<LeaderboardIcon3D />} label="Top" />
                <NavItem to="/profile" icon={<ProfileIcon3D />} label="Profile" />
            </div>
        </nav>
    );
}

export default BottomNav;