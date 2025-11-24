import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Withdrawal, Task, DailyBonus, WithdrawalStatus, TaskType, WithdrawalMethod, Notification, AppConfig, AdminActivityLog, AntiCheatLog, CheatType } from '../types';
import { MOCK_TASKS, MOCK_DAILY_BONUSES, MOCK_NOTIFICATIONS, MOCK_ALL_USERS, INITIAL_APP_CONFIG, MOCK_ADMIN_LOGS, MOCK_ANTI_CHEAT_LOGS } from '../data/mock';
import { auth, googleProvider } from '../firebase';
import { onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser, sendPasswordResetEmail } from 'firebase/auth';

// ============================================================================================
// 🔊 Audio Player Utility
// ============================================================================================
// Manages all in-app sound effects using the Web Audio API for performance.
export class AudioPlayer {
    private static audioCtx: AudioContext | null = null;
    private static isInitialized = false;

    // Must be called by a user gesture (e.g., click) to initialize.
    public static init() {
        if (this.isInitialized || typeof window === 'undefined') return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.isInitialized = true;
        } catch (e) {
            console.error("Web Audio API is not supported.", e);
        }
    }

    // Plays a subtle "pop" for UI interactions.
    public static playTouchSound() {
        if (!this.audioCtx) return;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, this.audioCtx.currentTime);
        oscillator.start(this.audioCtx.currentTime);
        oscillator.stop(this.audioCtx.currentTime + 0.1);
    }
    
    // Plays a metallic "clink" for coin rewards.
    public static playCoinSound() {
        if (!this.audioCtx) return;
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        gainNode.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(700, this.audioCtx.currentTime + 0.3);
        oscillator.start(this.audioCtx.currentTime);
        oscillator.stop(this.audioCtx.currentTime + 0.3);
    }
}

const API_SECRET_KEY = "THIS_IS_A_MOCK_SERVER_SECRET_KEY";

interface DataContextType {
  user: User | null;
  allUsers: User[]; 
  withdrawals: Withdrawal[];
  tasks: Task[];
  dailyBonuses: DailyBonus[];
  notifications: Notification[];
  appConfig: AppConfig;
  adminActivityLogs: AdminActivityLog[];
  antiCheatLogs: AntiCheatLog[];
  rewardTrigger: { amount: number; key: number } | null;
  triggerRewardAnimation: (amount: number) => void;
  
  // --- SECURE, SERVER-VERIFIED ACTIONS ---
  secureClaimDailyBonus: (day: number, token: string) => Promise<boolean>;
  secureClaimTask: (taskId: TaskType, token: string) => Promise<boolean>;
  secureCreditVideoReward: (token: string) => Promise<boolean>;
  secureStartMining: (token: string) => Promise<boolean>;
  secureBoostMining: (token: string) => Promise<boolean>;
  secureRequestWithdrawal: (data: { method: WithdrawalMethod; fullName: string; phoneNumber: string; cnic: string; }, token: string) => Promise<{ success: boolean; message: string; }>;
  secureUpdateUserName: (name: string, token: string) => Promise<boolean>;
  secureSubmitContactForm: (data: { name: string; email: string; subject: string; message: string; }, token: string) => Promise<{ success: boolean; }>;
  generateApiToken: (action: string, payload?: object) => string;
  secureLogConsoleAccess: (token: string) => Promise<void>;
  
  // --- Auth & Settings ---
  isAuthenticated: boolean;
  authLoading: boolean;
  signInWithGoogle: () => Promise<any>;
  loginWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  
  // --- ADMIN AUTH & ACTIONS ---
  isAdminAuthenticated: boolean;
  adminLogout: () => void;
  adminUpdateUser: (userId: string, updates: Partial<User>) => void;
  adminUpdateTask: (updatedTask: Task) => void;
  adminUpdateDailyBonus: (updatedBonus: DailyBonus) => void;
  adminUpdateAppConfig: (newConfig: AppConfig) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: WithdrawalStatus) => void;
  markNotificationAsRead: (notificationId: string) => void;
  adminResetUserDailyState: (userId: string) => void;
  adminResetUserMiningCycle: (userId: string) => void;
  adminSendGlobalNotification: (title: string, message: string) => void;
  adminResetCooldown: (buttonKey: string) => void;
  adminResetDailyBonusForAllUsers: () => void;
  adminClearSecurityLogs: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_ALL_USERS);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [dailyBonuses, setDailyBonuses] = useState<DailyBonus[]>(MOCK_DAILY_BONUSES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [appConfig, setAppConfig] = useState<AppConfig>(INITIAL_APP_CONFIG);
  const [adminActivityLogs, setAdminActivityLogs] = useState<AdminActivityLog[]>(MOCK_ADMIN_LOGS);
  const [antiCheatLogs, setAntiCheatLogs] = useState<AntiCheatLog[]>(MOCK_ANTI_CHEAT_LOGS);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [rewardTrigger, setRewardTrigger] = useState<{ amount: number; key: number } | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
        const saved = localStorage.getItem('soundEnabled');
        return saved !== null ? JSON.parse(saved) : true;
    } catch {
        return true;
    }
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
        return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    } catch {
        return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };
  
  const generateApiToken = (action: string, payload: object = {}) => {
      const timestamp = Date.now();
      const data = `${action}:${timestamp}:${JSON.stringify(payload)}:${API_SECRET_KEY}`;
      const checksum = btoa(data).slice(-10);
      return btoa(JSON.stringify({ action, payload, timestamp, checksum }));
  };

  const verifyApiToken = (token: string): { valid: boolean, action: string, payload: any } => {
      try {
          const decoded = JSON.parse(atob(token));
          const { action, payload, timestamp, checksum } = decoded;
          if (Date.now() - timestamp > 30000) {
              console.error("TOKEN VERIFICATION FAILED: Expired token.");
              return { valid: false, action: '', payload: null };
          }
          const expectedData = `${action}:${timestamp}:${JSON.stringify(payload)}:${API_SECRET_KEY}`;
          const expectedChecksum = btoa(expectedData).slice(-10);
          if (checksum !== expectedChecksum) {
              console.error("TOKEN VERIFICATION FAILED: Invalid checksum.");
              if (user) _flagSuspiciousActivity_SERVER(user, CheatType.INVALID_API_TOKEN, `Invalid checksum for action: ${action}.`);
              return { valid: false, action: '', payload: null };
          }
          return { valid: true, action, payload };
      } catch (e) {
          console.error("TOKEN VERIFICATION FAILED: Invalid token format.");
          if (user) _flagSuspiciousActivity_SERVER(user, CheatType.INVALID_API_TOKEN, `Malformed token submitted.`);
          return { valid: false, action: '', payload: null };
      }
  };

  const triggerRewardAnimation = (amount: number) => {
    setRewardTrigger({ amount, key: Date.now() });
    if (isSoundEnabled) {
      AudioPlayer.playCoinSound();
    }
  };
  
  const _addCoins_SERVER = (amount: number, userId: string) => {
    setAllUsers(prevUsers => 
        prevUsers.map(u => 
            u.uid === userId ? { ...u, coins: Math.max(0, u.coins + amount) } : u
        )
    );
    if (user && userId === user.uid && amount > 0) {
      triggerRewardAnimation(amount);
    }
  };

  const _updateUser_SERVER = (userId: string, updates: Partial<User>) => {
      setAllUsers(prevUsers => 
          prevUsers.map(u => 
              u.uid === userId ? { ...u, ...updates } : u
          )
      );
  };
  
    const _addNotification_SERVER = (title: string, message: string, isForAdmin: boolean = false) => {
        const newNotification: Notification = {
            id: `NID-${Date.now()}`,
            title,
            message,
            date: new Date().toISOString().split('T')[0],
            read: false,
            isForAdmin,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const _logAdminAction_SERVER = (action: string) => {
        const newLog: AdminActivityLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            adminUser: 'admin', // Hardcoded for this mock setup
            action,
        };
        setAdminActivityLogs(prev => [newLog, ...prev]);
    }
    
    // --- ANTI-CHEAT ---
    const _flagSuspiciousActivity_SERVER = (user: User, cheatType: CheatType, details: string) => {
        const newLog: AntiCheatLog = {
            id: `AC-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userUid: user.uid,
            userName: user.name,
            deviceId: user.deviceId,
            cheatType,
            details,
        };
        setAntiCheatLogs(prev => [newLog, ...prev]);
        _addNotification_SERVER(
            `Anti-Cheat Alert: ${cheatType}`,
            `User: ${user.name} (${user.uid})\nDetails: ${details}`,
            true // Mark as admin notification
        );
        console.warn(`[ANTI-CHEAT] Flagged user ${user.uid} for ${cheatType}. Details: ${details}`);
    };

  useEffect(() => {
    if (user) {
        const mainUser = allUsers.find(u => u.uid === user.uid);
        if (mainUser) setUser(mainUser);
    }
  }, [allUsers, user?.uid]);
  
  // Welcome bonus for new users
  useEffect(() => {
    if (user && user.isNewUser) {
        // Base welcome bonus for everyone
        const welcomeBonus = appConfig.globalSettings.welcomeBonus || 200;
        _addCoins_SERVER(welcomeBonus, user.uid);
        _addNotification_SERVER("🎉 Welcome Bonus!", `${welcomeBonus} Coins as New User Welcome Bonus have been added to your account.`);

        // Additional notification if they were referred (coins were added at creation)
        if (user.referredBy) {
             const referrer = allUsers.find(u => u.referralCode === user.referredBy);
             if (referrer) {
                _addNotification_SERVER("🤝 Referral Bonus!", `You received ${appConfig.referralSettings.newUserBonus} extra coins for being referred by ${referrer.name}!`);
             }
        }
        
        // Mark onboarding as complete
        _updateUser_SERVER(user.uid, { isNewUser: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ============================================================================================
  // 🕒 Timer-based Push Notifications
  // ============================================================================================
  useEffect(() => {
    const sendNotification = (title: string, body: string) => {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico', silent: false });
        }
    };
    
    const checkTimersForNotifications = () => {
        if (!user) return;
        
        const now = Date.now();
        const today = new Date().toDateString();
        let updates: Partial<User> = {};
        let shouldUpdate = false;

        // 1. Check for Mining Cycle Completion
        if (user.miningStartTime) {
            const cycleEndTime = user.miningStartTime + appConfig.miningSettings.cycleDurationHours * 3600 * 1000;
            if (now > cycleEndTime && user.lastMiningCycleCompletionNotified !== user.miningStartTime) {
                sendNotification("Mining Complete!", "Your mining cycle has finished. Start a new session to keep earning.");
                updates.lastMiningCycleCompletionNotified = user.miningStartTime;
                shouldUpdate = true;
            }
        }

        // 2. Check for Boost Cooldown
        if (user.boostCooldownEndTime && user.boostCooldownEndTime > 0) {
             if (now > user.boostCooldownEndTime && user.lastBoostCooldownNotified !== user.boostCooldownEndTime) {
                sendNotification("Boost Ready!", "Your mining boost is available again. Watch an ad to increase your rate.");
                updates.lastBoostCooldownNotified = user.boostCooldownEndTime;
                shouldUpdate = true;
            }
        }

        // 3. Check for Daily Reset
        if (user.lastTaskResetDate !== today && user.lastDailyResetNotified !== today) {
            sendNotification("Daily Reset!", "Your daily tasks and bonuses are now available.");
            updates.lastDailyResetNotified = today;
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            _updateUser_SERVER(user.uid, updates);
        }
    };

    const intervalId = setInterval(checkTimersForNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, [user, appConfig.miningSettings.cycleDurationHours]);


  const secureClaimDailyBonus = async (day: number, token: string): Promise<boolean> => {
      return new Promise(resolve => {
          setTimeout(() => {
              if (!user) return resolve(false);
              const { valid } = verifyApiToken(token);
              if (!valid) return resolve(false);

              if (!appConfig.dailyBonusSettings.isEnabled) {
                  console.error("Daily bonus system is disabled.");
                  return resolve(false);
              }

              const bonusReward = appConfig.dailyBonusSettings.rewards[day - 1];
              const isClaimable = day === user.lastBonusClaimedDay + 1;

              if (bonusReward && isClaimable) {
                  _addCoins_SERVER(bonusReward, user.uid);
                  _updateUser_SERVER(user.uid, { lastBonusClaimedDay: day });
                  resolve(true);
              } else {
                  resolve(false);
              }
          }, 500);
      });
  };
  
  const secureClaimTask = async (taskId: TaskType, token: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!user) return resolve(false);
        const { valid } = verifyApiToken(token);
        if (!valid) return resolve(false);

        const task = tasks.find(t => t.id === taskId);
        const taskConfig = appConfig.taskSettings?.[taskId];

        if (task && !task.isCompleted && taskConfig && taskConfig.isEnabled) {
            const isProgressMet = () => {
              switch(taskId) {
                case TaskType.WATCH_3_VIDEOS: return user.dailyVideosWatched >= 3;
                case TaskType.WATCH_10_VIDEOS: return user.dailyVideosWatched >= 10;
                case TaskType.WATCH_130_VIDEOS: return user.dailyVideosWatched >= 130;
                case TaskType.BOOST_1000_COINS: return (user.boostAdsWatched || 0) >= 30;
                case TaskType.SHARE_APP: return true;
                default: return false;
              }
            };
            
            if(isProgressMet()) {
              _addCoins_SERVER(taskConfig.reward, user.uid);
              setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: true } : t));
              resolve(true);
            } else {
              resolve(false);
            }
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

    const _checkAndCreditReferral_SERVER = (newUser: User) => {
        if (newUser.referredBy && !newUser.referralCreditGiven && newUser.totalAdsWatched >= appConfig.referralSettings.referralRequirementAds) {
            const referrer = allUsers.find(u => u.referralCode === newUser.referredBy);
            if (referrer) {
                console.log(`[SERVER] Crediting referral to ${referrer.name} from new user ${newUser.name}`);
                
                const bonus = appConfig.referralSettings.referrerBonus;
                _addCoins_SERVER(bonus, referrer.uid);
                _updateUser_SERVER(referrer.uid, {
                    referralEarnings: (referrer.referralEarnings || 0) + bonus,
                    successfulReferrals: (referrer.successfulReferrals || 0) + 1,
                });
                _addNotification_SERVER("🎉 Referral Success!", `${bonus} coins have been added for your successful referral of ${newUser.name}.`);

                _updateUser_SERVER(newUser.uid, { referralCreditGiven: true });
            }
        }
    };


  const secureCreditVideoReward = async (token: string): Promise<boolean> => {
      return new Promise(resolve => {
        setTimeout(() => {
          if (!user) return resolve(false);
          const { valid, payload } = verifyApiToken(token);
          if (!valid || !payload || !payload.buttonKey) {
              console.error("Video reward failed: Invalid token or missing buttonKey.");
              return resolve(false);
          }
          
          const { buttonKey } = payload;
          
          const settings = appConfig.adButtonSettings[buttonKey as keyof typeof appConfig.adButtonSettings];
          if (!settings || !settings.isEnabled) {
              console.error(`Invalid or inactive button: ${buttonKey}`);
              return resolve(false);
          }

          const buttonProgress = user.buttonProgress || {};
          const progress = buttonProgress[buttonKey] || { watched: 0, cooldownEndTime: 0 };
          
          const failAndTrackSuspicion = () => {
              const now = Date.now();
              const activityKey = 'rapidRewardClaim';
              const currentActivity = user.suspiciousActivity?.[activityKey] || { count: 0, lastTimestamp: 0 };
              
              const updates: Partial<User> = {};
              if (now - currentActivity.lastTimestamp < 60000) { // within 1 minute
                  const newCount = currentActivity.count + 1;
                  updates.suspiciousActivity = { ...user.suspiciousActivity, [activityKey]: { count: newCount, lastTimestamp: now } };
                  if (newCount > 5) { // Threshold for flagging
                      _flagSuspiciousActivity_SERVER(user, CheatType.RAPID_INVALID_REQUESTS, `User triggered invalid reward claim ${newCount} times in under a minute for button ${buttonKey}.`);
                      updates.suspiciousActivity[activityKey].count = 0; // Reset after flagging
                  }
              } else {
                  updates.suspiciousActivity = { ...user.suspiciousActivity, [activityKey]: { count: 1, lastTimestamp: now } };
              }
              _updateUser_SERVER(user.uid, updates);
              return resolve(false);
          };

          if (progress.watched >= settings.limit) {
              console.error(`Button ${buttonKey} limit reached.`);
              return failAndTrackSuspicion();
          }
          if (Date.now() < progress.cooldownEndTime) {
              console.error(`Button ${buttonKey} is on cooldown.`);
              return failAndTrackSuspicion();
          }

          const newWatched = progress.watched + 1;
          const newCooldownEndTime = Date.now() + settings.cooldownMinutes * 60 * 1000;

          const userUpdates: Partial<User> = {
              buttonProgress: {
                  ...buttonProgress,
                  [buttonKey]: {
                      watched: newWatched,
                      cooldownEndTime: newCooldownEndTime
                  }
              },
              // Update legacy fields for tasks compatibility
              totalAdsWatched: user.totalAdsWatched + 1,
              dailyVideosWatched: user.dailyVideosWatched + 1,
          };

          _addCoins_SERVER(settings.reward, user.uid);
          _updateUser_SERVER(user.uid, userUpdates);

          const updatedUserForReferralCheck = { ...user, ...userUpdates };
          _checkAndCreditReferral_SERVER(updatedUserForReferralCheck);
          
          const newDaily = userUpdates.dailyVideosWatched!;
          setTasks(currentTasks => currentTasks.map(task => {
              if (!task.isCompleted) {
                  if (task.id === TaskType.WATCH_3_VIDEOS && newDaily >= 3) return { ...task, isCompleted: true };
                  if (task.id === TaskType.WATCH_10_VIDEOS && newDaily >= 10) return { ...task, isCompleted: true };
                  if (task.id === TaskType.WATCH_130_VIDEOS && newDaily >= 130) return { ...task, isCompleted: true };
              }
              return task;
          }));
          resolve(true);

        }, 300);
      });
  };

  const secureStartMining = async (token: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!user) return resolve(false);
        const { valid } = verifyApiToken(token);
        if (!valid) return resolve(false);
        if (user.miningStartTime && (Date.now() - user.miningStartTime < appConfig.miningSettings.cycleDurationHours * 3600 * 1000)) {
          return resolve(false);
        }
        _updateUser_SERVER(user.uid, { miningStartTime: Date.now() });
        resolve(true);
      }, 500);
    });
  };
  
  const secureBoostMining = async (token: string): Promise<boolean> => {
      return new Promise(resolve => {
          setTimeout(() => {
            if (!user) return resolve(false);
            const { valid } = verifyApiToken(token);
            if (!valid) return resolve(false);

            const now = Date.now();
            if (user.boostCooldownEndTime && now < user.boostCooldownEndTime) {
                return resolve(false);
            }

            const currentBoosts = user.boostAdsWatched || 0;
            const newBoosts = currentBoosts + 1;
            let newCooldown = user.boostCooldownEndTime || 0;

            if (newBoosts >= 30) {
                newCooldown = now + (24 * 60 * 60 * 1000);
            }
             _updateUser_SERVER(user.uid, { boostAdsWatched: newBoosts, boostCooldownEndTime: newCooldown });

            if(newBoosts >= 30) {
                setTasks(currentTasks => currentTasks.map(task => {
                    if (task.id === TaskType.BOOST_1000_COINS) return { ...task, isCompleted: true };
                    return task;
                }));
            }

            resolve(true);
          }, 300);
      });
  };

  const secureRequestWithdrawal = async (data: { method: WithdrawalMethod; fullName: string; phoneNumber: string; cnic: string; }, token: string): Promise<{ success: boolean; message: string; }> => {
      return new Promise(resolve => {
          setTimeout(() => {
              if (!user) return resolve({ success: false, message: "User not authenticated." });
              const { valid } = verifyApiToken(token);
              if (!valid) {
                  return resolve({ success: false, message: "Invalid request. Please try again." });
              }
              
              const isFirstWithdrawal = !user.hasMadeFirstWithdrawal;
              const currentTargetPkr = isFirstWithdrawal ? appConfig.withdrawalSettings.firstWithdrawalTargetPkr : appConfig.withdrawalSettings.subsequentWithdrawalTargetPkr;
              const currentTargetCoins = currentTargetPkr / appConfig.withdrawalSettings.coinsToPkrRate;

              if (user.coins < currentTargetCoins) {
                  return resolve({ success: false, message: `Insufficient coins. You need ${currentTargetCoins.toLocaleString()} coins.` });
              }

              const amountToWithdraw = isFirstWithdrawal ? currentTargetCoins : user.coins;
              const pkrToWithdraw = amountToWithdraw * appConfig.withdrawalSettings.coinsToPkrRate;

              const newWithdrawal: Withdrawal = {
                  id: `WID-${Date.now()}`,
                  userUid: user.uid,
                  userName: user.name,
                  amountCoins: amountToWithdraw,
                  amountPkr: pkrToWithdraw,
                  method: data.method,
                  accountInfo: { fullName: data.fullName, phoneNumber: data.phoneNumber, cnic: data.cnic },
                  status: WithdrawalStatus.PENDING,
                  date: new Date().toISOString(),
              };

              setWithdrawals(prev => [newWithdrawal, ...prev]);
              _addCoins_SERVER(-amountToWithdraw, user.uid);
              _updateUser_SERVER(user.uid, { hasMadeFirstWithdrawal: true });

              resolve({ success: true, message: "Withdrawal request submitted successfully. It will be processed within 24-48 hours." });

          }, 1000);
      });
  };

  const secureUpdateUserName = async (name: string, token: string): Promise<boolean> => {
      return new Promise(resolve => {
          setTimeout(() => {
              if (!user) return resolve(false);
              const { valid } = verifyApiToken(token);
              if (!valid) return resolve(false);

              if (name.trim()) {
                  _updateUser_SERVER(user.uid, { name: name.trim() });
                  resolve(true);
              } else {
                  resolve(false);
              }
          }, 300);
      });
  };
  
    const secureSubmitContactForm = async (data: { name: string; email: string; subject: string; message: string; }, token: string): Promise<{ success: boolean; }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const { valid } = verifyApiToken(token);
                if (!valid) return resolve({ success: false });

                _addNotification_SERVER(
                    `New Contact Message: ${data.subject}`,
                    `From: ${data.name} (${data.email})\n\n${data.message}`,
                    true // Mark as admin notification
                );
                
                resolve({ success: true });
            }, 1000);
        });
    };

    const secureLogConsoleAccess = async (token: string): Promise<void> => {
        return new Promise(resolve => {
            if (!user) return resolve();
            const { valid } = verifyApiToken(token);
            if (!valid) return resolve();
            _flagSuspiciousActivity_SERVER(user, CheatType.CONSOLE_ACCESS, 'User opened browser developer tools during session.');
            resolve();
        });
    };

    const _createNewUser_SERVER = (firebaseUser: FirebaseUser): User => {
        const refCode = sessionStorage.getItem('referralCode');
        if (refCode) {
            sessionStorage.removeItem('referralCode');
        }
        
        const randomId = Math.random().toString(36).substring(2, 15);
        const deviceId = `web-user-${randomId}`;

        const newUser: User = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || `User${firebaseUser.uid.substring(0, 5)}`,
            email: firebaseUser.email!,
            deviceId: deviceId,
            coins: 0,
            totalAdsWatched: 0,
            dailyVideosWatched: 0,
            lastLogin: new Date().toISOString(),
            isBlocked: false,
            lastBonusClaimedDay: 0,
            referralCode: `REF-${firebaseUser.uid.substring(0, 6).toUpperCase()}`,
            referralEarnings: 0,
            miningStartTime: null,
            boostAdsWatched: 0,
            boostCooldownEndTime: 0,
            lastTaskResetDate: new Date().toDateString(),
            hasMadeFirstWithdrawal: false,
            isNewUser: true,
            referredBy: refCode || undefined,
            successfulReferrals: 0,
            referralCreditGiven: false,
            buttonProgress: {}, // Initialize empty
            suspiciousActivity: {}, // Initialize empty
        };

        if (refCode) {
            const referrerExists = MOCK_ALL_USERS.some(u => u.referralCode === refCode);
            if (referrerExists) {
                newUser.coins += appConfig.referralSettings.newUserBonus;
            }
        }
        return newUser;
    };


    // --- AUTH FUNCTIONS ---
    const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
    const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
    const signUpWithEmail = async (email: string, pass: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        // User creation logic is now handled by onAuthStateChanged to centralize it.
        return userCredential;
    };
    const logout = () => signOut(auth);
    const sendPasswordReset = (email: string) => {
        return sendPasswordResetEmail(auth, email);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            setAuthLoading(true);
            if (firebaseUser) {
                // Automatically detect and grant admin privileges on login
                if (firebaseUser.email?.toLowerCase() === 'farasatabbasi7@gmail.com') {
                    setIsAdminAuthenticated(true);
                    sessionStorage.setItem('isAdminAuthenticated', 'true');
                    _logAdminAction_SERVER('Admin auto-logged in via Firebase');
                }

                let appUser = allUsers.find(u => u.uid === firebaseUser.uid);
                let isNewSignUp = false;
                if (!appUser) {
                    isNewSignUp = true;
                    appUser = _createNewUser_SERVER(firebaseUser);
                    
                    // ANTI-CHEAT: Check for multiple accounts on the same (simulated) device
                    const existingUser = allUsers.find(u => u.deviceId === appUser!.deviceId);
                    if(existingUser) {
                        _flagSuspiciousActivity_SERVER(appUser, CheatType.MULTIPLE_ACCOUNTS, `New user registration from a deviceId (${appUser.deviceId}) already associated with user ${existingUser.uid}. Auto-blocking.`);
                        appUser.isBlocked = true; // Block immediately
                    }

                    setAllUsers(prev => [...prev, appUser!]);
                } else {
                    // Daily Reset Check
                    const today = new Date().toDateString();
                    if (appUser.lastTaskResetDate !== today) {
                        console.log(`[SERVER] Performing daily reset for user ${appUser.name}`);
                        const defaultButtonProgress: { [key: string]: { watched: number; cooldownEndTime: number } } = {};
                        for (const key in appConfig.adButtonSettings) {
                            defaultButtonProgress[key] = { watched: 0, cooldownEndTime: 0 };
                        }
                        const updates: Partial<User> = {
                            dailyVideosWatched: 0,
                            lastTaskResetDate: today,
                            buttonProgress: defaultButtonProgress,
                        };
                        const updatedUser = { ...appUser, ...updates };
                        setAllUsers(prevUsers => prevUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u));
                        appUser = updatedUser;
                        setTasks(MOCK_TASKS.map(t => ({...t, isCompleted: false})));
                    }
                }
                
                // If it was a new sign-up, also update the user object with the latest state
                 if (isNewSignUp) {
                    const finalUser = allUsers.find(u => u.uid === firebaseUser.uid) || appUser;
                    setUser(finalUser);
                } else {
                    setUser(appUser);
                }

                setIsAuthenticated(true);
                setAuthLoading(false);

            } else {
                // Clear all authentication state on logout
                setUser(null);
                setIsAuthenticated(false);
                setIsAdminAuthenticated(false);
                sessionStorage.removeItem('isAdminAuthenticated');
                setAuthLoading(false);
            }
        });
        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // --- ADMIN AUTH ---
    const adminLogout = () => {
        setIsAdminAuthenticated(false);
        sessionStorage.removeItem('isAdminAuthenticated');
        logout(); // Also sign out from Firebase
    };
  
    const adminUpdateUser = (userId: string, updates: Partial<User>) => {
      _updateUser_SERVER(userId, updates);
      _logAdminAction_SERVER(`Updated user ${userId}: ${JSON.stringify(updates)}`);
    };
  
    const adminUpdateTask = (updatedTask: Task) => {
      setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
       _logAdminAction_SERVER(`Updated task ${updatedTask.id}`);
    };
  
    const adminUpdateDailyBonus = (updatedBonus: DailyBonus) => {
      setDailyBonuses(prevBonuses => prevBonuses.map(b => b.day === updatedBonus.day ? updatedBonus : b));
      _logAdminAction_SERVER(`Updated daily bonus for day ${updatedBonus.day}`);
    };

    const adminUpdateAppConfig = (newConfig: AppConfig) => {
      setAppConfig(newConfig);
      _logAdminAction_SERVER(`Updated app configuration`);
    };

    const updateWithdrawalStatus = (withdrawalId: string, status: WithdrawalStatus) => {
      setWithdrawals(prev => prev.map(w => {
          if (w.id === withdrawalId && w.status === WithdrawalStatus.PENDING && status === WithdrawalStatus.REJECTED) {
              _addCoins_SERVER(w.amountCoins, w.userUid);
              _logAdminAction_SERVER(`Rejected withdrawal ${withdrawalId} and refunded ${w.amountCoins} coins to user ${w.userUid}`);
          } else if (w.id === withdrawalId) {
             _logAdminAction_SERVER(`Set withdrawal ${withdrawalId} status to ${status}`);
          }
          return w.id === withdrawalId ? { ...w, status } : w;
      }));
    };
  
    const markNotificationAsRead = (notificationId: string) => {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    };

    const adminResetUserDailyState = (userId: string) => {
        const defaultButtonProgress: { [key: string]: { watched: number; cooldownEndTime: number } } = {};
        for (const key in appConfig.adButtonSettings) {
            defaultButtonProgress[key] = { watched: 0, cooldownEndTime: 0 };
        }
      _updateUser_SERVER(userId, { 
          dailyVideosWatched: 0, 
          lastTaskResetDate: new Date().toDateString(),
          buttonProgress: defaultButtonProgress
      });
      setTasks(MOCK_TASKS.map(t => ({...t, isCompleted: false})));
      _logAdminAction_SERVER(`Reset daily state for user ${userId}`);
    };
  
    const adminResetUserMiningCycle = (userId: string) => {
      _updateUser_SERVER(userId, { 
          miningStartTime: null, 
          boostAdsWatched: 0, 
          boostCooldownEndTime: 0 
      });
       _logAdminAction_SERVER(`Reset mining cycle for user ${userId}`);
    };

    const adminSendGlobalNotification = (title: string, message: string) => {
        _addNotification_SERVER(title, message, false);
        _logAdminAction_SERVER(`Sent global notification: "${title}"`);
    };

    const adminResetCooldown = (buttonKey: string) => {
        setAllUsers(prevUsers =>
            prevUsers.map(u => {
                if (u.buttonProgress && u.buttonProgress[buttonKey]) {
                    const newButtonProgress = { ...u.buttonProgress };
                    newButtonProgress[buttonKey] = { watched: 0, cooldownEndTime: 0 };
                    return { ...u, buttonProgress: newButtonProgress };
                }
                // If user doesn't have button progress yet, initialize it
                const newButtonProgress = { ...(u.buttonProgress || {}) };
                newButtonProgress[buttonKey] = { watched: 0, cooldownEndTime: 0 };
                return { ...u, buttonProgress: newButtonProgress };
            })
        );
        _logAdminAction_SERVER(`Reset progress for all users on button: ${buttonKey}`);
    };

    const adminResetDailyBonusForAllUsers = () => {
        setAllUsers(prevUsers =>
            prevUsers.map(u => ({ ...u, lastBonusClaimedDay: 0 }))
        );
        _logAdminAction_SERVER(`Reset daily bonus progress for all users.`);
    };
    
    const adminClearSecurityLogs = () => {
        setAntiCheatLogs([]);
        _logAdminAction_SERVER(`Cleared all anti-cheat security logs.`);
    };

  return (
    <DataContext.Provider value={{
      user,
      allUsers,
      withdrawals,
      tasks,
      dailyBonuses,
      notifications,
      appConfig,
      adminActivityLogs,
      antiCheatLogs,
      rewardTrigger,
      triggerRewardAnimation,
      secureClaimDailyBonus,
      secureClaimTask,
      secureCreditVideoReward,
      secureStartMining,
      secureBoostMining,
      secureRequestWithdrawal,
      secureUpdateUserName,
      secureSubmitContactForm,
      generateApiToken,
      secureLogConsoleAccess,
      isAuthenticated,
      authLoading,
      signInWithGoogle,
      loginWithEmail,
      signUpWithEmail,
      logout,
      sendPasswordReset,
      isSoundEnabled,
      toggleSound,
      isAdminAuthenticated,
      adminLogout,
      adminUpdateUser,
      adminUpdateTask,
      adminUpdateDailyBonus,
      adminUpdateAppConfig,
      updateWithdrawalStatus,
      markNotificationAsRead,
      adminResetUserDailyState,
      adminResetUserMiningCycle,
      adminSendGlobalNotification,
      adminResetCooldown,
      adminResetDailyBonusForAllUsers,
      adminClearSecurityLogs,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};