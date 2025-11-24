
import React, { useEffect } from 'react';
import GlassCard from '../components/GlassPanel';
import { useData } from '../context/DataContext';
import { NotificationIcon3D } from '../components/icons/NavIcons';
import { BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const NotificationScreen = () => {
    const { notifications, markNotificationAsRead } = useData();
    const userNotifications = notifications.filter(n => !n.isForAdmin);

    // Mark unread notifications as read when the component mounts
    useEffect(() => {
        userNotifications.forEach(notification => {
            if (!notification.read) {
                markNotificationAsRead(notification.id);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-4 flex flex-col items-center h-full animate-fade-in overflow-y-auto">
            <div className="w-full max-w-lg space-y-6">

                <div className="flex justify-center items-center gap-4 -mb-2">
                    <div className="w-16 h-16"><NotificationIcon3D /></div>
                </div>

                <GlassCard className="w-full">
                    <h2 className="text-xl font-bold mb-4 text-center">Your Messages</h2>
                    <div className="space-y-4">
                        {userNotifications.length > 0 ? (
                            userNotifications.slice().reverse().map(notification => (
                                <div key={notification.id} className={`p-4 rounded-2xl border-l-4 transition-all duration-300 ${notification.read ? 'bg-black/30 border-white/10' : 'bg-brand-purple/20 border-brand-purple'}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-bold text-white">{notification.title}</h3>
                                            <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                                        </div>
                                        {notification.read ? 
                                            <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /> : 
                                            <BellAlertIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1 animate-pulse" />
                                        }
                                    </div>
                                    <p className="text-right text-xs text-gray-400 mt-2">{notification.date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-6">You have no notifications yet.</p>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default NotificationScreen;