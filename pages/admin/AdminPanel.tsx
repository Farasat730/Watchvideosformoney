import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AdminBottomNav from '../../components/admin/AdminBottomNav';
import AdminDashboard from './AdminDashboard';
import AdminUserList from './AdminUserList';
import AdminUserDetail from './AdminUserDetail';
import AdminWithdrawals from './AdminWithdrawals';
import AdminAppSettings from './AdminAppSettings';
import ParticleBackground from '../../components/SparkleBackground';
import AdminNotificationsScreen from './AdminNotificationsScreen';
import AdminSecurityLogs from './AdminSecurityLogs';
import PremiumButton from '../../components/PremiumButton';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

const AdminTopBar = ({ title }: { title: string }) => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-4 left-4 right-4 bg-gradient-to-br from-[#110f1b]/80 to-[#0c0a14]/80 backdrop-blur-2xl p-3 z-50 grid grid-cols-3 items-center shadow-[0_15px_30px_-10px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl">
            <div className="flex justify-start">
                 {/* This empty div helps keep the title centered in the grid. */}
            </div>
            <h1 className="text-xl font-bold text-white tracking-wider text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{title}</h1>
            <div className="flex justify-end">
                <PremiumButton
                    onClick={() => navigate('/')}
                    className="!w-auto !h-10 !text-sm"
                    icon={<ArrowUturnLeftIcon className="w-4 h-4" />}
                >
                    Back to App
                </PremiumButton>
            </div>
        </header>
    );
};

const AdminPanel = () => {
    const location = useLocation();
    
    const getTitle = () => {
        const path = location.pathname;
        if (path.endsWith('/admin/users')) return 'User Management';
        if (path.startsWith('/admin/users/')) return 'User Details';
        if (path.endsWith('/withdrawals')) return 'Withdrawal Management';
        if (path.endsWith('/settings')) return 'Application Settings';
        if (path.endsWith('/notifications')) return 'Admin Notifications';
        if (path.endsWith('/security')) return 'Security Logs';
        if (path.endsWith('/admin')) return 'Dashboard';
        return 'Admin Panel';
    };

    return (
        <div className="min-h-screen w-full font-sans text-white overflow-hidden">
            <ParticleBackground />
            <div className="relative z-10 h-full flex flex-col p-4">
                <AdminTopBar title={getTitle()} />
                <main className="flex-grow overflow-y-auto pt-20 pb-24">
                    <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUserList />} />
                        <Route path="users/:userUid" element={<AdminUserDetail />} />
                        <Route path="withdrawals" element={<AdminWithdrawals />} />
                        <Route path="settings" element={<AdminAppSettings />} />
                        <Route path="notifications" element={<AdminNotificationsScreen />} />
                        <Route path="security" element={<AdminSecurityLogs />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </main>
                <AdminBottomNav />
            </div>
        </div>
    );
};

export default AdminPanel;