import React, { useEffect } from 'react';
import GlassCard from '../../components/GlassPanel';
import { useData } from '../../context/DataContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const AdminNotificationsScreen = () => {
    const { notifications, markNotificationAsRead } = useData();
    const adminNotifications = notifications.filter(n => n.isForAdmin);

    useEffect(() => {
        adminNotifications.forEach(notification => {
            if (!notification.read) {
                markNotificationAsRead(notification.id);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminNotifications]);

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in">
            <GlassCard className="w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4 text-center">Admin Notifications</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {adminNotifications.length > 0 ? (
                        adminNotifications.slice().reverse().map(notification => (
                            <div key={notification.id} className={`p-4 rounded-2xl border-l-4 bg-black/30 border-brand-purple`}>
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <h3 className="font-bold text-white">{notification.title}</h3>
                                        <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{notification.message}</p>
                                    </div>
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                </div>
                                <p className="text-right text-xs text-gray-400 mt-2">{new Date(notification.date).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-6">No admin notifications.</p>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminNotificationsScreen;
