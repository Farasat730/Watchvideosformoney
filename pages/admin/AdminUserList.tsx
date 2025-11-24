import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import GlassCard from '../../components/GlassPanel';
import PremiumButton from '../../components/PremiumButton';
import { User } from '../../types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const AdminUserList = () => {
    const { allUsers } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.uid.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">User Management</h1>
                    <p className="text-gray-400">Found {filteredUsers.length} of {allUsers.length} users.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by name, email, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                </div>
            </div>
            
            <GlassCard className="!p-4 sm:!p-6">
                <div className="space-y-4">
                    {filteredUsers.length > 0 ? filteredUsers.map((user: User) => (
                        <div key={user.uid} className="bg-black/40 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-white/10 shadow-inset-deep">
                            <div className="flex-grow">
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-lg">{user.name}</p>
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${user.isBlocked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">{user.email}</p>
                                <p className="text-sm mt-1">Coins: <span className="text-brand-gold font-semibold">{user.coins.toLocaleString()}</span></p>
                            </div>
                            <div className="flex-shrink-0">
                                <PremiumButton 
                                    onClick={() => navigate(`/admin/users/${user.uid}`)} 
                                    className="!h-10 !text-sm !w-full sm:!w-auto"
                                >
                                    Manage User
                                </PremiumButton>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-gray-500">
                            <p className="font-semibold">No users found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminUserList;
