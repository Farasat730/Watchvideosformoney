import { User, Withdrawal, Task, DailyBonus, WithdrawalStatus, WithdrawalMethod, TaskType, LeaderboardUser, Notification, AppConfig, AdminActivityLog, AntiCheatLog } from '../types';

export const MOCK_USER: User = {
  uid: 'UID-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  deviceId: 'XYZ-123-ABC-789',
  coins: 0, // Set to 0 for new user
  totalAdsWatched: 0, // Set to 0 for new user
  dailyVideosWatched: 0, // Legacy tracking for tasks
  lastLogin: new Date().toISOString(),
  isBlocked: false,
  lastBonusClaimedDay: 0,
  referralCode: 'JOHNDOE123',
  referralEarnings: 0, // Set to 0 for new user
  miningStartTime: null,
  boostAdsWatched: 0,
  boostCooldownEndTime: 0,
  lastTaskResetDate: new Date().toDateString(),
  hasMadeFirstWithdrawal: false,
  lastMiningCycleCompletionNotified: null,
  lastBoostCooldownNotified: null,
  lastDailyResetNotified: null,
  isNewUser: true, // Flag to trigger welcome bonus
  successfulReferrals: 0,
  referralCreditGiven: false,
  buttonProgress: {
      home_watch: { watched: 0, cooldownEndTime: 0 },
      pro_videos: { watched: 0, cooldownEndTime: 0 },
      master_videos: { watched: 0, cooldownEndTime: 0 },
      elite_videos: { watched: 0, cooldownEndTime: 0 },
      legend_videos: { watched: 0, cooldownEndTime: 0 },
      mining_boost: { watched: 0, cooldownEndTime: 0 },
  },
  suspiciousActivity: {},
};

export const MOCK_ALL_USERS: User[] = [
  MOCK_USER,
  {
    uid: 'UID-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    deviceId: 'DEF-456-GHI-123',
    coins: 12500,
    totalAdsWatched: 150,
    dailyVideosWatched: 25,
    lastLogin: '2023-10-28T11:00:00Z',
    isBlocked: false,
    lastBonusClaimedDay: 3,
    referralCode: 'JANE2024',
    referralEarnings: 500,
    hasMadeFirstWithdrawal: true,
    lastMiningCycleCompletionNotified: null,
    lastBoostCooldownNotified: null,
    lastDailyResetNotified: null,
    isNewUser: false,
    successfulReferrals: 1,
    buttonProgress: {
        home_watch: { watched: 25, cooldownEndTime: 0 },
        pro_videos: { watched: 12, cooldownEndTime: 0 },
        master_videos: { watched: 5, cooldownEndTime: 0 },
    },
    suspiciousActivity: {},
  },
  {
    uid: 'UID-003',
    name: 'Admin User',
    email: 'farasatabbasi7@gmail.com',
    deviceId: 'ADMIN-DEVICE-001',
    coins: 999999,
    totalAdsWatched: 1000,
    dailyVideosWatched: 0,
    lastLogin: '2023-10-28T12:00:00Z',
    isBlocked: false,
    lastBonusClaimedDay: 7,
    referralCode: 'ADMINREF',
    referralEarnings: 0,
    hasMadeFirstWithdrawal: true,
    lastMiningCycleCompletionNotified: null,
    lastBoostCooldownNotified: null,
    lastDailyResetNotified: null,
    isNewUser: false,
    successfulReferrals: 0,
    buttonProgress: {},
    suspiciousActivity: {},
  }
];


export const MOCK_WITHDRAWALS: Withdrawal[] = [
    {
        id: 'WID-12345',
        userUid: 'UID-002',
        userName: 'Jane Smith',
        amountCoins: 50000,
        amountPkr: 500,
        method: WithdrawalMethod.EASYPAISA,
        accountInfo: { fullName: 'Jane Smith', phoneNumber: '03012345678', cnic: '12345-6789012-3' },
        status: WithdrawalStatus.PENDING,
        date: '2023-10-28',
    },
    {
        id: 'WID-67890',
        userUid: 'UID-003',
        userName: 'Admin User',
        amountCoins: 100000,
        amountPkr: 1000,
        method: WithdrawalMethod.JAZZCASH,
        accountInfo: { fullName: 'Admin Istrator', phoneNumber: '03009876543', cnic: '54321-2109876-5' },
        status: WithdrawalStatus.PENDING,
        date: '2023-10-27',
    },
     {
        id: 'WID-11223',
        userUid: 'UID-001',
        userName: 'John Doe',
        amountCoins: 250000,
        amountPkr: 2500,
        method: WithdrawalMethod.JAZZCASH,
        accountInfo: { fullName: 'John Doe', phoneNumber: '03331122334', cnic: '35201-1122334-5' },
        status: WithdrawalStatus.APPROVED,
        date: '2023-10-25',
    }
];

export const MOCK_TASKS: Task[] = [
  {
    id: TaskType.WATCH_3_VIDEOS,
    title: 'Watch 3 Videos',
    description: 'Complete watching 3 videos to claim your reward.',
    reward: 50,
    isCompleted: MOCK_USER.dailyVideosWatched >= 3,
  },
  {
    id: TaskType.WATCH_10_VIDEOS,
    title: 'Video Marathon',
    description: 'Watch 10 videos in total to get a big bonus.',
    reward: 150,
    isCompleted: MOCK_USER.dailyVideosWatched >= 10,
  },
  {
    id: TaskType.WATCH_130_VIDEOS,
    title: 'Daily Mega Challenge',
    description: 'Watch 130 videos today to unlock a massive 1500 coin reward!',
    reward: 1500,
    isCompleted: MOCK_USER.dailyVideosWatched >= 130,
  },
  {
    id: TaskType.BOOST_1000_COINS,
    title: 'Earn 1000 Coins',
    description: 'Watch 30 Boost Ads to unlock this massive reward.',
    reward: 1000,
    isCompleted: (MOCK_USER.boostAdsWatched || 0) >= 30,
  },
  {
    id: TaskType.SHARE_APP,
    title: 'Share the App',
    description: 'Share the app with your friends and earn coins.',
    reward: 100,
    isCompleted: false,
  },
];

export const MOCK_DAILY_BONUSES: DailyBonus[] = [
    { day: 1, reward: 20, claimed: MOCK_USER.lastBonusClaimedDay >= 1 },
    { day: 2, reward: 30, claimed: MOCK_USER.lastBonusClaimedDay >= 2 },
    { day: 3, reward: 40, claimed: MOCK_USER.lastBonusClaimedDay >= 3 },
    { day: 4, reward: 50, claimed: MOCK_USER.lastBonusClaimedDay >= 4 },
    { day: 5, reward: 75, claimed: MOCK_USER.lastBonusClaimedDay >= 5 },
    { day: 6, reward: 100, claimed: MOCK_USER.lastBonusClaimedDay >= 6 },
    { day: 7, reward: 200, claimed: MOCK_USER.lastBonusClaimedDay >= 7 },
];


export const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: 'CryptoKing', coins: 150230 },
    { rank: 2, name: 'AdWatcherPro', coins: 125800 },
    { rank: 3, name: 'CoinMaster', coins: 98540 },
    { rank: 4, name: 'Jane Smith', coins: 75210 },
    { rank: 5, name: 'VirtualTycoon', coins: 68900 },
    { rank: 6, name: 'PixelPioneer', coins: 54120 },
    { rank: 7, name: 'John Doe', coins: 5240 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'NID-001',
    title: 'Welcome to Watch & Earn!',
    message: 'Thanks for joining our app. Start watching videos now to earn coins and claim your daily bonus.',
    date: '2023-10-28',
    read: false,
  },
  {
    id: 'NID-002',
    title: 'New Task Available!',
    message: 'A new high-reward task "Video Marathon" has been added. Complete it to earn a big bonus!',
    date: '2023-10-27',
    read: true,
  },
    {
    id: 'NID-003',
    title: 'Withdrawal Update',
    message: 'Withdrawal methods have been updated. You can now withdraw using Easypaisa for faster transactions.',
    date: '2023-10-26',
    read: false,
  },
];

export const MOCK_ADMIN_LOGS: AdminActivityLog[] = [
    { id: 'LOG-1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), adminUser: 'admin', action: 'Changed Video Reward Amount to 60' },
    { id: 'LOG-2', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), adminUser: 'admin', action: 'Blocked user UID-003' },
    { id: 'LOG-3', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), adminUser: 'admin', action: 'Approved withdrawal WID-11223' },
    { id: 'LOG-4', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), adminUser: 'admin', action: 'Set Mining Feature to live' },
];

export const MOCK_ANTI_CHEAT_LOGS: AntiCheatLog[] = [];


// ============================================================================================
// CENTRALIZED APP CONFIGURATION
// ============================================================================================
export const INITIAL_APP_CONFIG: AppConfig = {
  adSettings: {
    isGlobalTestMode: false,
    adUnitIds: {
      app: 'ca-app-pub-3805360178749293~4484956361',
      rewarded: 'ca-app-pub-3805360178749293/7488617552',
      banner: 'ca-app-pub-3805360178749293/9962027215',
      interstitial: 'ca-app-pub-3805360178749293/9795216691',
    },
    interstitialCooldownMs: 120 * 1000,
    adDurationSeconds: {
        rewarded: 5,
        interstitial: 3,
    },
  },
  adButtonSettings: {
    home_watch: {
      name: 'Home Watch Video',
      isEnabled: true,
      provider: 'AdMob',
      adType: 'Rewarded',
      adUnitId: 'ca-app-pub-3805360178749293/7488617552',
      reward: 16,
      limit: 130,
      cooldownMinutes: 5,
    },
    pro_videos: {
      name: 'Pro Videos',
      isEnabled: true,
      provider: 'AdMob',
      adType: 'Rewarded',
      adUnitId: 'ca-app-pub-3805360178749293/7488617552',
      reward: 50,
      limit: 50,
      cooldownMinutes: 10,
    },
    master_videos: {
      name: 'Master Videos',
      isEnabled: true,
      provider: 'AdMob',
      adType: 'Rewarded',
      adUnitId: 'ca-app-pub-3805360178749293/7488617552',
      reward: 50,
      limit: 50,
      cooldownMinutes: 10,
    },
    elite_videos: {
      name: 'Elite Videos',
      isEnabled: true,
      provider: 'AdMob',
      adType: 'Rewarded',
      adUnitId: 'ca-app-pub-3805360178749293/7488617552',
      reward: 50,
      limit: 50,
      cooldownMinutes: 10,
    },
    legend_videos: {
      name: 'Legend Videos',
      isEnabled: true,
      provider: 'AdMob',
      adType: 'Rewarded',
      adUnitId: 'ca-app-pub-3805360178749293/7488617552',
      reward: 50,
      limit: 50,
      cooldownMinutes: 10,
    },
    mining_boost: {
      name: 'Mining Boost',
      isEnabled: true,
      provider: 'AdMob',
      adType: 'Rewarded',
      adUnitId: 'ca-app-pub-3805360178749293/7488617552',
      reward: 0, // No direct coin reward, gives a boost
      limit: 30,
      cooldownMinutes: 0, // Cooldown is handled by boost logic
      boostMultiplier: 1.5,
      boostDurationMinutes: 60,
    }
  },
  withdrawalSettings: {
    coinsToPkrRate: 0.01,
    firstWithdrawalTargetPkr: 5000,
    subsequentWithdrawalTargetPkr: 1000,
  },
  miningSettings: {
    cycleDurationHours: 24,
    baseRate: 2,
    boostPerAd: 0.8,
  },
  referralSettings: {
    newUserBonus: 250, // This is the "Login Bonus"
    referrerBonus: 1000,
    referralRequirementAds: 3,
  },
  featureFlags: {
    isMiningEnabled: 'live',
    isMiningBoostEnabled: 'live',
    isUpcomingFeaturesEnabled: 'live',
    isReferralSystemEnabled: 'live',
    ads: {
        rewarded: 'live',
        interstitial: 'live',
        banner: 'live',
    },
  },
  dailyBonusSettings: {
    isEnabled: true,
    rewards: [20, 30, 40, 50, 75, 100, 200], // 7 days
  },
  taskSettings: {
    [TaskType.WATCH_3_VIDEOS]: { isEnabled: true, reward: 50 },
    [TaskType.WATCH_10_VIDEOS]: { isEnabled: true, reward: 150 },
    [TaskType.WATCH_130_VIDEOS]: { isEnabled: true, reward: 1500 },
    [TaskType.BOOST_1000_COINS]: { isEnabled: true, reward: 1000 },
    [TaskType.SHARE_APP]: { isEnabled: true, reward: 100 },
  },
  globalSettings: {
      appName: 'Watch & Earn',
      logoUrl: '/logo.png',
      themeColor: '#6d28d9',
      welcomeBonus: 200,
      socialLinks: {
          facebook: 'https://facebook.com',
          telegram: 'https://telegram.org',
          whatsapp: 'https://whatsapp.com',
      },
      supportLink247: 'https://wa.me/923001112222',
      communitySupportLink: 'https://chat.whatsapp.com/sampleinvite123',
      appVersion: '1.0.0',
      forceUpdate: false,
      content: {
          aboutText: `यह ایپ فراست علی خان اور حمزہ کی مشترکہ محنت سے بنائی گئی ہے۔ 
ہم دونوں پارٹنر بھی ہیں اور بہترین دوست بھی۔ 
ہم نے اس ایپ کو اس لیے بنایا ہے تاکہ لوگ آسانی سے ایڈز دیکھ کر پیسے کما سکیں۔ 
پاکستان میں آج کل بہت غربت ہے اور عام عوام ایک ایک پیسے کے لیے پریشان ہیں، 
تو ہم نے سوچا کہ کیوں نہ ایسا پلیٹ فارم بنایا جائے جہاں لوگ آ کر ارننگ کر سکیں۔`,
          rules: [
            "اس ایپ میں اینٹی چیٹ بوٹ موجود ہے، جو بھی رولز کی خلاف ورزی کرے گا وہ پکڑا جائے گا۔",
            "اگر کوئی یوزر چیٹنگ کرے، فیک ایڈز یا کسی بھی طریقے سے ارننگ میں دھوکہ دینے کی کوشش کرے، تو ویڈیو پوری نہیں دکھے گی اور ایڈز بھی نہیں کھلیں گے۔",
            "کسی بھی خلاف ورزی کرنے والے یوزر کا اکاؤنٹ بین ہو سکتا ہے۔",
            "ہر یوزر کو صحیح معلومات دینی ہوں گی (نام، اکاؤنٹ نمبر، CNIC)۔",
            "ایک ڈیوائس پر صرف ایک اکاؤنٹ چلے گا، ورنہ اکاؤنٹ بین ہو جائے گا۔",
            "ویڈرا کے لیے صحیح اور اصل تفصیلات دینا ضروری ہے۔",
            "ایپ صرف اصلی ویڈوز دیکھنے اور ارننگ کے لیے ہے، کوئی فیک کام نہیں چلے گا۔"
          ]
      }
  }
};