import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import WatchScreen from './pages/WatchScreen';
import BonusScreen from './pages/BonusScreen';
import TasksScreen from './pages/TasksScreen';
import ProfileScreen from './pages/ProfileScreen';
import LeaderboardScreen from './pages/LeaderboardScreen';
import AdminPanel from './pages/admin/AdminPanel';
import BottomNav from './components/BottomNav';
import ParticleBackground from './components/SparkleBackground';
import TopBar from './components/TopBar';
import AboutScreen from './pages/AboutScreen';
import { useData, AudioPlayer } from './context/DataContext';
import { useAd } from './context/AdContext';
import LoginScreen from './pages/LoginScreen';
import ContactScreen from './pages/ContactScreen';
import NotificationScreen from './pages/NotificationScreen';
import GlobalRewardAnimation from './components/GlobalRewardAnimation';
import LoadingScreen from './pages/LoadingScreen';
import MoreFeaturesScreen from './pages/MoreFeaturesScreen';
import CloudMiningScreen from './pages/CloudMiningScreen';
import DailyTasksScreen from './pages/DailyTasksScreen';
// FIX: Imported WalletScreen to resolve 'Cannot find name' error.
import WalletScreen from './pages/WalletScreen';
// FIX: Imported TreasureIcon3D to resolve 'Cannot find name' error.
import { TreasureIcon3D } from './components/icons/NavIcons';

// This component contains the layout and logic for the main user-facing app.
const MainAppLayout = () => {
    const { user, isSoundEnabled, generateApiToken, secureLogConsoleAccess } = useData();
    const { isBannerVisible, showInterstitialAd } = useAd();
    const location = useLocation();
    
    React.useEffect(() => {
        if (user && typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification("Notifications Enabled!", {
                        body: "You'll now receive updates for timers and rewards.",
                        icon: '/favicon.ico'
                    });
                }
            });
        }
    }, [user]);

    React.useEffect(() => {
        // Show interstitial ad on navigation, respecting cooldown
        showInterstitialAd();
    }, [location.pathname, showInterstitialAd]);

    React.useEffect(() => {
        const initAudio = () => { AudioPlayer.init(); };
        window.addEventListener('mousedown', initAudio, { once: true });
        window.addEventListener('touchstart', initAudio, { once: true });
        
        const playSoundOnClick = (event: MouseEvent) => {
            if (!isSoundEnabled) return;
            const target = event.target as HTMLElement;
            if (target.closest('button, a, [role="button"], [onclick]')) {
                 AudioPlayer.playTouchSound();
            }
        };
        
        document.addEventListener('mousedown', playSoundOnClick);
        return () => {
            document.removeEventListener('mousedown', playSoundOnClick);
        };
    }, [isSoundEnabled]);
    
    // Anti-Cheat: Developer Console Detection
    React.useEffect(() => {
        if (!user) return;
        const devToolsCheck = () => {
            const threshold = 160;
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                if (!sessionStorage.getItem('devToolsFlagged')) {
                    sessionStorage.setItem('devToolsFlagged', 'true');
                    const token = generateApiToken('logConsoleAccess');
                    secureLogConsoleAccess(token);
                    console.warn("Developer tools access has been logged for security purposes.");
                }
            }
        };
        const intervalId = setInterval(devToolsCheck, 3000); // Check every 3 seconds
        return () => clearInterval(intervalId);
    }, [user, generateApiToken, secureLogConsoleAccess]);
    
    const pathsWithBackButton = ['/about', '/contact', '/notifications', '/more-features', '/cloud-mining', '/daily-tasks'];
    const showBackButton = pathsWithBackButton.includes(location.pathname);

    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Home';
            case '/watch': return 'Watch Videos';
            case '/bonus': return 'Daily Bonus';
            case '/tasks': return 'Earning Features';
            case '/wallet': return 'Wallet';
            case '/leaderboard': return 'Leaderboard';
            case '/profile': return 'Profile';
            case '/about': return 'About & Rules';
            case '/contact': return 'Contact Us';
            case '/notifications': return 'Notifications';
            case '/more-features': return 'More Features';
            case '/cloud-mining': return 'Cloud Mining';
            case '/daily-tasks': return 'Daily Tasks';
            default: return 'Watch & Earn';
        }
    };
    
    return (
        <div className="min-h-screen w-full font-sans text-white overflow-hidden animate-fade-in">
            <ParticleBackground />
            <GlobalRewardAnimation />
            <div className="relative z-10 h-full flex flex-col p-4">
                <TopBar title={getTitle()} showBackButton={showBackButton} />
                <main className={`flex-grow overflow-y-auto pt-20 pb-24 ${isBannerVisible ? 'mb-[50px]' : ''}`}>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/watch" element={<WatchScreen />} />
                        <Route path="/bonus" element={<BonusScreen />} />
                        <Route path="/tasks" element={<TasksScreen />} />
                        <Route path="/wallet" element={<WalletScreen />} />
                        <Route path="/leaderboard" element={<LeaderboardScreen />} />
                        <Route path="/profile" element={<ProfileScreen />} />
                        <Route path="/about" element={<AboutScreen />} />
                        <Route path="/contact" element={<ContactScreen />} />
                        <Route path="/notifications" element={<NotificationScreen />} />
                        <Route path="/more-features" element={<MoreFeaturesScreen />} />
                        <Route path="/cloud-mining" element={<CloudMiningScreen />} />
                        <Route path="/daily-tasks" element={<DailyTasksScreen />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

// AppContent is the main router that decides which layout to render.
const AppContent = () => {
    const { isAuthenticated, authLoading, isAdminAuthenticated } = useData();
    const [isAppLoading, setIsAppLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsAppLoading(false);
        }, 3000); // Display loading screen for 3 seconds
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        // Capture referral code from URL on initial load
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const refCode = params.get('ref');
        if (refCode && !sessionStorage.getItem('referralCode')) {
            sessionStorage.setItem('referralCode', refCode);
        }
    }, []);

    if (isAppLoading || authLoading) {
        return <LoadingScreen />;
    }

    return (
         <Routes>
            {/* Admin Routes: Admin logs in via the main login page. Non-admins are redirected. */}
            <Route path="/admin/*" element={isAdminAuthenticated ? <AdminPanel /> : <Navigate to="/" />} />
            
            {/* User Routes */}
            <Route path="/login" element={!isAuthenticated ? <LoginScreen /> : <Navigate to="/" />} />
            <Route path="/*" element={isAuthenticated ? <MainAppLayout /> : <Navigate to="/login" />} />
        </Routes>
    );
};

const App = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
};

export default App;