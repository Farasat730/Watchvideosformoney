import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ShieldCheckIcon, ArrowTrendingUpIcon, UserGroupIcon, ClockIcon, Cog6ToothIcon, PowerIcon } from '@heroicons/react/24/solid';
import PremiumButton from '../PremiumButton';

const AdminNav = () => {
    const { adminLogout } = useData();
    const navigate = useNavigate();

    const handleLogout = () => {
        adminLogout();
        navigate('/admin-login');
    };

    const navItems = [
        { path: '/admin', exact: true, label: 'Dashboard', icon: <ArrowTrendingUpIcon className="w-5 h-5" /> },
        { path: '/admin/users', label: 'Users', icon: <UserGroupIcon className="w-5 h-5" /> },
        { path: '/admin/withdrawals', label: 'Withdrawals', icon: <ClockIcon className="w-5 h-5" /> },
        { path: '/admin/settings', label: 'App Settings', icon: <Cog6ToothIcon className="w-5 h-5" /> },
    ];

    const baseLinkClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-white/10 hover:text-white";
    const activeLinkClass = "bg-brand-purple/20 text-white font-semibold shadow-inner";

    return (
        <aside className="w-64 bg-gradient-to-br from-[#110f1b]/80 to-[#0c0a14]/80 backdrop-blur-2xl border-r border-white/10 flex-shrink-0 flex flex-col p-4 shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-white/10 mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-brand-gold" />
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-grow space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : ''}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto">
                <PremiumButton 
                    onClick={handleLogout} 
                    icon={<PowerIcon className="w-5 h-5"/>}
                    className="!bg-gradient-to-br !from-red-600/90 !to-red-900/90 focus:!ring-red-500/50"
                >
                    Logout
                </PremiumButton>
            </div>
        </aside>
    );
};

export default AdminNav;