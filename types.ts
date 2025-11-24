export interface User {
  uid: string; // Changed from id to uid for Firebase compatibility
  name: string;
  email: string;
  deviceId: string;
  coins: number;
  totalAdsWatched: number;
  dailyVideosWatched: number; // For legacy daily tasks
  lastLogin: string;
  isBlocked: boolean;
  lastBonusClaimedDay: number;
  referralCode: string;
  referralEarnings: number;
  miningStartTime?: number | null;
  boostAdsWatched?: number;
  boostCooldownEndTime?: number; // Legacy, may be deprecated
  lastTaskResetDate?: string; // Tracks the last date tasks were reset
  hasMadeFirstWithdrawal?: boolean;
  // New fields for notification tracking
  lastMiningCycleCompletionNotified?: number | null;
  lastBoostCooldownNotified?: number | null;
  lastDailyResetNotified?: string | null;
  isNewUser?: boolean; // Flag for first-time user welcome bonus
  // New fields for referral system
  referredBy?: string; // Referral code of the user who referred them
  successfulReferrals?: number; // Count of users they successfully referred
  referralCreditGiven?: boolean; // For the new user, tracks if their referrer has been credited
  // New generalized progress tracking
  buttonProgress?: {
      [key: string]: {
          watched: number;
          cooldownEndTime: number;
      }
  };
  // Anti-Cheat field
  suspiciousActivity?: {
      [key: string]: {
          count: number;
          lastTimestamp: number;
      }
  };
}

export interface VideoTierProgress {
    watched: number;
    cooldownEndTime: number;
}

export enum WithdrawalMethod {
  JAZZCASH = 'JazzCash',
  EASYPAISA = 'Easypaisa',
}

export enum WithdrawalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface Withdrawal {
  id: string;
  userUid: string; // Changed from userId to userUid
  userName: string;
  amountCoins: number;
  amountPkr: number;
  method: WithdrawalMethod;
  accountInfo: {
    fullName: string;
    phoneNumber: string;
    cnic: string;
  };
  status: WithdrawalStatus;
  date: string;
}

export enum TaskType {
    WATCH_3_VIDEOS = 'WATCH_3_VIDEOS',
    // FIX: Corrected typo in enum value from 'WATCH_10_VIDOS' to 'WATCH_10_VIDEOS'.
    WATCH_10_VIDEOS = 'WATCH_10_VIDEOS',
    WATCH_130_VIDEOS = 'WATCH_130_VIDEOS',
    SHARE_APP = 'SHARE_APP',
    BOOST_1000_COINS = 'BOOST_1000_COINS',
}

export interface Task {
  id: TaskType;
  title: string;
  description: string;
  reward: number; // This will now be sourced from appConfig but kept for structure
  isCompleted: boolean;
}

export interface DailyBonus {
    day: number;
    reward: number; // This will now be sourced from appConfig
    claimed: boolean;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    coins: number;
}

export interface Notification {
  id:string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  isForAdmin?: boolean;
}

// ============================================================================================
// ANTI-CHEAT & SECURITY TYPES
// ============================================================================================
export enum CheatType {
    MULTIPLE_ACCOUNTS = 'Multiple Accounts',
    RAPID_INVALID_REQUESTS = 'Rapid Invalid Requests',
    CONSOLE_ACCESS = 'Developer Console Accessed',
    INVALID_API_TOKEN = 'Invalid API Token',
}

export interface AntiCheatLog {
    id: string;
    timestamp: string;
    userUid: string;
    userName: string;
    deviceId: string;
    cheatType: CheatType;
    details: string;
}


// ============================================================================================
// ADMIN PANEL & APP CONFIGURATION TYPES
// ============================================================================================

export interface AdButtonConfig {
    name: string;
    isEnabled: boolean;
    provider: 'AdMob' | 'AdManager' | 'Test' | 'None';
    adType: 'Rewarded' | 'Interstitial' | 'Banner';
    adUnitId: string;
    reward: number;
    limit: number;
    cooldownMinutes: number;
    // Mining-specific
    boostMultiplier?: number;
    boostDurationMinutes?: number;
}


export interface AdSettings {
  isGlobalTestMode: boolean; // Global toggle for test ads
  adUnitIds: { // Fallback IDs
    app: string;
    rewarded: string;
    banner: string;
    interstitial: string;
  };
  interstitialCooldownMs: number; // For general navigation interstitials
  adDurationSeconds: {
    rewarded: number;
    interstitial: number;
  };
}

export interface WithdrawalSettings {
  firstWithdrawalTargetPkr: number;
  subsequentWithdrawalTargetPkr: number;
  coinsToPkrRate: number;
}

export interface MiningSettings {
  cycleDurationHours: number;
  baseRate: number; // coins per hour
  boostPerAd: number; // additional coins per hour, per ad watched
}

export interface ReferralSettings {
  newUserBonus: number; // Also used as a general "Login Bonus" for new users
  referrerBonus: number;
  referralRequirementAds: number;
}

export type FeatureStatus = 'live' | 'coming_soon' | 'maintenance';

export interface FeatureFlags {
  isMiningEnabled: FeatureStatus;
  isMiningBoostEnabled: FeatureStatus; // Kept for overall feature toggle
  isUpcomingFeaturesEnabled: FeatureStatus; // Controls the "More Features" section
  isReferralSystemEnabled: FeatureStatus;
  ads: {
    rewarded: FeatureStatus;
    interstitial: FeatureStatus;
    banner: FeatureStatus;
  };
}

export interface GlobalSettings {
    appName: string;
    logoUrl: string; // URL to the app logo
    themeColor: string; // Primary theme color
    welcomeBonus: number; // For new users on first login
    socialLinks: {
        facebook: string;
        telegram: string;
        whatsapp: string;
    };
    supportLink247: string;
    communitySupportLink: string;
    appVersion: string;
    forceUpdate: boolean;
    content: {
        aboutText: string;
        rules: string[];
    };
}

export interface AdminActivityLog {
    id: string;
    timestamp: string;
    adminUser: string;
    action: string;
}

export interface DailyBonusSettings {
    isEnabled: boolean;
    rewards: number[]; // Index 0 = Day 1, Index 1 = Day 2, etc.
}

export interface TaskSetting {
    isEnabled: boolean;
    reward: number;
}


export interface AppConfig {
  adSettings: AdSettings;
  adButtonSettings: {
      home_watch: AdButtonConfig;
      pro_videos: AdButtonConfig;
      master_videos: AdButtonConfig;
      elite_videos: AdButtonConfig;
      legend_videos: AdButtonConfig;
      mining_boost: AdButtonConfig;
  };
  withdrawalSettings: WithdrawalSettings;
  miningSettings: MiningSettings;
  featureFlags: FeatureFlags;
  referralSettings: ReferralSettings;
  globalSettings: GlobalSettings;
  dailyBonusSettings: DailyBonusSettings;
  taskSettings: {
      [key in TaskType]?: TaskSetting;
  };
}