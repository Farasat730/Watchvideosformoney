import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import GlassCard from '../components/GlassPanel';
import PremiumButton from '../components/PremiumButton';
import ParticleBackground from '../components/SparkleBackground';
import { AppLogo3D } from '../components/icons/NavIcons';
import GoogleIcon from '../components/icons/GoogleIcon';
import { EnvelopeIcon, KeyIcon, XMarkIcon } from '@heroicons/react/24/solid';

const LoginScreen = () => {
    const { signInWithGoogle, loginWithEmail, signUpWithEmail, sendPasswordReset } = useData();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(''); // Can be 'google', 'login', 'signup'
    
    // State for Forgot Password Modal
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');


    // Helper function for user-friendly error messages
    const getFirebaseErrorMessage = (error: any) => {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                return 'Invalid email or password. Please try again.';
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please log in.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/popup-closed-by-user':
                return 'Sign-in process cancelled.';
            default:
                console.error("Firebase Auth Error:", error);
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading('google');
        try {
            await signInWithGoogle();
            // onAuthStateChanged will handle navigation
        } catch (err: any) {
            setError(getFirebaseErrorMessage(err));
        }
        setLoading('');
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        setError('');
        setLoading('login');
        try {
            await loginWithEmail(email, password);
        } catch (err: any) {
            setError(getFirebaseErrorMessage(err));
        }
        setLoading('');
    };

    const handleEmailSignUp = async () => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }
        setError('');
        setLoading('signup');
        try {
            await signUpWithEmail(email, password);
        } catch (err: any) {
            setError(getFirebaseErrorMessage(err));
        }
        setLoading('');
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');
        setResetMessage('');
        if (!resetEmail) {
            setResetError("Please enter your email address.");
            return;
        }
        try {
            await sendPasswordReset(resetEmail);
            setResetMessage("If an account with that email exists, a password reset link has been sent. Please check your inbox (and spam folder).");
            setResetEmail('');
        } catch (err: any) {
            if (err.code === 'auth/invalid-email') {
                 setResetError('Please enter a valid email address.');
            } else {
                 setResetError('An error occurred. Please try again later.');
                 console.error("Password Reset Error:", err);
            }
        }
    };

    const inputStyles = "w-full bg-black/40 backdrop-blur-sm border-2 border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all duration-300 shadow-inset-3d placeholder-gray-400";

    return (
        <div className="min-h-screen w-full font-sans bg-gradient-to-br from-dark-bg via-brand-blue/50 to-dark-bg text-white overflow-hidden flex items-center justify-center p-4">
            <ParticleBackground />
            <div className="relative z-10 w-full max-w-sm animate-fade-in">
                <GlassCard className="text-center !p-6 sm:!p-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24">
                            <AppLogo3D />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Watch & Earn</h1>
                    <p className="text-gray-300 mb-6">
                        Sign in or create an account to start.
                    </p>
                    
                    <form className="space-y-4" onSubmit={handleEmailLogin}>
                        <div className="relative">
                            <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyles}
                                required
                                disabled={!!loading}
                            />
                        </div>
                         <div className="relative">
                            <KeyIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyles}
                                required
                                disabled={!!loading}
                            />
                        </div>

                        <div className="text-right -mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(true);
                                    setError(''); // Clear main form error
                                }}
                                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {error && <p className="text-sm text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg py-2 px-3">{error}</p>}
                        
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                             <PremiumButton type="submit" disabled={!!loading} className="w-full">
                                {loading === 'login' ? 'Logging in...' : 'Login'}
                            </PremiumButton>
                             <PremiumButton onClick={handleEmailSignUp} type="button" disabled={!!loading} className="w-full !from-brand-cyan !to-brand-blue !shadow-brand-cyan/40">
                                {loading === 'signup' ? 'Signing up...' : 'Sign Up'}
                            </PremiumButton>
                        </div>
                    </form>

                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    
                    <PremiumButton
                        onClick={handleGoogleSignIn}
                        icon={<GoogleIcon />}
                        className="w-full"
                        disabled={!!loading}
                    >
                        {loading === 'google' ? 'Redirecting...' : 'Continue with Google'}
                    </PremiumButton>
                </GlassCard>
            </div>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <GlassCard className="w-full max-w-sm !p-6 sm:!p-8 relative">
                        <button 
                            onClick={() => { 
                                setShowForgotPassword(false); 
                                setResetMessage(''); 
                                setResetError('');
                                setResetEmail('');
                            }} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-transform duration-200 active:scale-90"
                            aria-label="Close"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
                        <p className="text-center text-gray-300 mb-6 text-sm">
                            Enter your email. If an account exists, we'll send a reset link.
                        </p>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div className="relative">
                                <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="email"
                                    placeholder="Your registered email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className={inputStyles}
                                    required
                                    autoFocus
                                />
                            </div>
                            
                            {resetMessage && <p className="text-sm text-green-400 bg-green-900/30 border border-green-500/50 rounded-lg py-2 px-3">{resetMessage}</p>}
                            {resetError && <p className="text-sm text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg py-2 px-3">{resetError}</p>}
                            
                            <PremiumButton type="submit" className="w-full mt-2">
                                Send Reset Link
                            </PremiumButton>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default LoginScreen;