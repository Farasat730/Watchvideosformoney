import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import GlassCard from '../components/GlassPanel';
import PremiumButton from '../components/PremiumButton';
import { ShieldCheckIcon, KeyIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const AdminLoginScreen = () => {
    const { adminLogin } = useData();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (adminLogin(username, password)) {
            navigate('/admin');
        } else {
            setError('Invalid Admin Login');
        }
    };
    
    const inputStyles = "w-full bg-black/40 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300 shadow-inset-3d placeholder-gray-400";
    const labelStyles = "block text-sm font-semibold text-gray-200 mb-2 ml-1";

    return (
        <div className="p-4 flex flex-col items-center justify-center h-screen animate-fade-in">
            <GlassCard className="w-full max-w-sm">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-20 h-20 mb-2 p-3 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-full shadow-lg shadow-yellow-500/30">
                        <ShieldCheckIcon />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Login</h1>
                    <p className="text-gray-300">Enter your credentials to access the panel.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className={labelStyles}>Username</label>
                        <div className="relative">
                            <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input 
                                id="username" 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                                className={`${inputStyles} pl-12`} 
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className={labelStyles}>Password</label>
                         <div className="relative">
                            <KeyIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className={`${inputStyles} pl-12`}
                            />
                        </div>
                    </div>

                    {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-red-200 text-xs text-center font-semibold">{error}</div>}
                    
                    <PremiumButton type="submit">
                        Login
                    </PremiumButton>
                </form>
                
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminLoginScreen;