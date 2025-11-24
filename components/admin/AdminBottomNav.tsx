import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowTrendingUpIcon, UserGroupIcon, ClockIcon, Cog6ToothIcon, PowerIcon, BellIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const NavItem = ({ to, icon, label, badgeCount }: { to: string; icon: React.ReactNode; label: string; badgeCount?: number }) => (
    <NavLink 
        to={to} 
        end={to === '/admin'}
        className="group flex flex-col items-center justify-center gap-1.5 transition-all duration-300 transform text-gray-400 hover:text-white active:scale-90 flex-1 relative"
    >
        {({ isActive }) => (
            <>
                <div className={`relative transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                    {isActive && <div className="absolute -inset-2.5 bg-brand-purple rounded-full blur-xl opacity-40 animate-pulse"></div>}
                    <div className={`relative w-9 h-9 flex items-center justify-center ${isActive ? 'text-white' : ''}`}>
                        {icon}
                        {badgeCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-dark-bg">
                                {badgeCount}
                            </span>
                        )}
                    </div>
                </div>
                <span className={`text-xs font-semibold transition-colors duration-300 ${isActive ? 'text-white' : ''}`}>{label}</span>
            </>
        )}
    </NavLink>
);

const NavButton = ({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center justify-center gap-1.5 transition-all duration-300 transform text-gray-400 hover:text-white active:scale-90 flex-1"
    >
        <div className="relative transition-all duration-300 group-hover:scale-105">
            <div className="relative w-9 h-9 flex items-center justify-center">
                {icon}
            </div>
        </div>
        <span className="text-xs font-semibold">{label}</span>
    </button>
);

const AdminBottomNav = () => {
    const { adminLogout, notifications } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminLogout();
        navigate('/admin-login');
    };
    
    const adminUnreadCount = notifications.filter(n => n.isForAdmin && !n.read).length;

    return (
        <nav className="fixed bottom-4 left-4 right-4 bg-gradient-to-br from-[#110f1b]/80 to-[#0c0a14]/80 backdrop-blur-2xl border border-white/10 p-2 z-50 rounded-2xl shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)]">
            <div className="flex justify-around items-center max-w-lg mx-auto h-16">
                <NavItem to="/admin" icon={<ArrowTrendingUpIcon className="w-7 h-7"/>} label="Dashboard" />
                <NavItem to="/admin/users" icon={<UserGroupIcon className="w-7 h-7"/>} label="Users" />
                <NavItem to="/admin/withdrawals" icon={<ClockIcon className="w-7 h-7"/>} label="Payouts" />
                <NavItem to="/admin/settings" icon={<Cog6ToothIcon className="w-7 h-7"/>} label="Settings" />
                <NavItem to="/admin/security" icon={<ShieldExclamationIcon className="w-7 h-7"/>} label="Security" />
                <NavItem to="/admin/notifications" icon={<BellIcon className="w-7 h-7"/>} label="Alerts" badgeCount={adminUnreadCount} />
                <NavButton onClick={handleLogout} icon={<PowerIcon className="w-7 h-7"/>} label="Logout" />
            </div>
        </nav>
    );
};

export default AdminBottomNav;