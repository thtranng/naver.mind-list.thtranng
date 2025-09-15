import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, Task, UserList, ViewMode, User, RecentlyDeletedItem, GamificationStats, NotificationSettings } from '@/types';
import { guestStorage, useGuestDataSync } from '@/utils/guestStorage';
import { calculateUserLevelData } from '@/services/levelSystem';
import { StreakProtectionService } from '@/services/streakProtectionService';
import { useDataSync } from '@/hooks/useDataSync';
import { achievementService } from '@/services/achievementService';

const defaultNotificationSettings: NotificationSettings = {
  masterControl: true,
  taskNotifications: {
    assignedToMe: { inApp: true, push: false, email: false },
    taskCompleted: { inApp: true, push: false, email: false },
    commentAdded: { inApp: true, push: false, email: false },
    subtaskCompleted: { inApp: true, push: false, email: false },
  },
  reminders: {
    dueDate: { inApp: true, push: false, email: false },
    earlyReminder: { inApp: true, push: false, email: false },
  },
  motivation: {
    dailyStreak: { inApp: true, push: false, email: false },
    levelUp: { inApp: true, push: false, email: false },
  },
  systemUpdates: {
    newFeatures: { inApp: true, push: false, email: false },
    tips: { inApp: true, push: false, email: false },
  },
};

// Default level data for guest mode
const defaultLevelData = calculateUserLevelData(1, 0, 0, 0, []);

// Default level data for default state (level 12)
const defaultLevelDataForDefault = calculateUserLevelData(12, 2450, 2450, 1250, []);

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SOFT_DELETE_TASK'; payload: string }
  | { type: 'DELETE_TASK_PERMANENTLY'; payload: string }
  | { type: 'SET_USER_LISTS'; payload: UserList[] }
  | { type: 'ADD_USER_LIST'; payload: UserList }
  | { type: 'UPDATE_USER_LIST'; payload: { id: string; updates: Partial<UserList> } }
  | { type: 'DELETE_USER_LIST'; payload: string }
  | { type: 'SOFT_DELETE_USER_LIST'; payload: string }
  | { type: 'DELETE_LIST_PERMANENTLY'; payload: string }
  | { type: 'UPDATE_LIST'; payload: UserList }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SET_SELECTED_LIST'; payload: string | null }
  | { type: 'SET_STREAK'; payload: number }
  | { type: 'SET_BEST_STREAK'; payload: number }
  | { type: 'ADD_TO_RECENTLY_DELETED'; payload: { item: Task | UserList; type: 'task' | 'list' } }
  | { type: 'REMOVE_FROM_RECENTLY_DELETED'; payload: string }
  | { type: 'RESTORE_FROM_RECENTLY_DELETED'; payload: string }
  | { type: 'PERMANENTLY_DELETE'; payload: string }
  | { type: 'EMPTY_RECENTLY_DELETED' }
  | { type: 'CLEANUP_OLD_DELETED_ITEMS' }
  | { type: 'CLEAR_ALL_RECENTLY_DELETED' }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'ADD_MIND_GEMS'; payload: number }
  | { type: 'SPEND_MIND_GEMS'; payload: number }
  | { type: 'USE_STREAK_FREEZE'; payload: void }
  | { type: 'ADD_STREAK_FREEZE'; payload: number }
  | { type: 'UPDATE_GAMIFICATION'; payload: Partial<GamificationStats> }
  | { type: 'SET_PENDING_LEVEL_UP_EVENTS'; payload: AppState['pendingLevelUpEvents'] }
  | { type: 'PURCHASE_STREAK_FREEZE'; payload: void }
  | { type: 'REPAIR_STREAK'; payload: void }
  | { type: 'MARK_STREAK_BROKEN'; payload: number }
  | { type: 'SHOW_TASK_EDITOR'; payload: boolean }
  | { type: 'SHOW_ADD_LIST_INPUT'; payload: boolean }
  | { type: 'SET_THEME_COLOR'; payload: string }
  | { type: 'SET_USER_PROFILE'; payload: AppState['userProfile'] }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<NonNullable<AppState['userProfile']>> };

// Tạo initial state cho guest mode
const createInitialState = (): AppState => {
  // Kiểm tra xem có dữ liệu guest trong localStorage không
  const guestData = guestStorage.getGuestData();

  if (guestData) {
    // Nếu có dữ liệu guest, load từ localStorage
    return {
      user: null, // Guest mode - không có user
      tasks: guestData.tasks || [],
      userLists: guestData.userLists || [],
      gamification: guestData.gamification || {
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        mindGems: 0,
        streakFreezes: 0,
        weeklyXP: 0,
        leaguePosition: 0,
        leagueName: 'Đồng',
        achievements: []
      },
      streak: guestData.streak || 0,
      bestStreak: guestData.bestStreak || 0,
      userProfile: null,
      currentView: 'list',
      selectedListId: 'all',
      showTaskEditor: false,
      showAddListInput: false,
      recentlyDeleted: [],
      notifications: [],
      notificationSettings: defaultNotificationSettings,
      productivityPoints: 0,
      dailyProductivityGoal: 10,
      lastProductivityDate: null,
      levelData: defaultLevelData,
      pendingLevelUpEvents: [],
      recentXPEvents: []
    };
  }
  
  // Nếu không có dữ liệu guest, tạo state zero cho onboarding
  return {
    user: null, // Guest mode - không có user
    userProfile: null,
    tasks: [], // Zero state - không có task mẫu
    userLists: [], // Zero state - không có list mẫu
    currentView: 'list',
    selectedListId: 'all',
    showTaskEditor: false,
    showAddListInput: false,
    streak: 0, // Zero state - streak bắt đầu từ 0
    bestStreak: 0, // Zero state - best streak bắt đầu từ 0
    recentlyDeleted: [],
    notifications: [],
    notificationSettings: defaultNotificationSettings,
    gamification: {
      level: 0, // Zero state - level bắt đầu từ 0
      xp: 0, // Zero state - XP bắt đầu từ 0
      xpToNextLevel: 100, // XP cần để lên level 1
      mindGems: 0, // Zero state - gems bắt đầu từ 0
      streakFreezes: 0, // Zero state - không có streak freeze
      weeklyXP: 0,
      leaguePosition: 0,
      leagueName: 'Đồng',
      achievements: [] // Zero state - không có achievement
    },
    productivityPoints: 0,
    dailyProductivityGoal: 10,
    lastProductivityDate: null,
    levelData: defaultLevelData, // Sử dụng level data cho level 0
    pendingLevelUpEvents: [],
    recentXPEvents: []
  };
};

const initialState: AppState = createInitialState();

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates, updatedAt: new Date() }
          : task
      );
      
      // Kiểm tra achievement khi task được hoàn thành
      const updatedTask = updatedTasks.find(task => task.id === action.payload.id);
      if (updatedTask && action.payload.updates.isCompleted === true) {
        // Kiểm tra achievement cho task completion
        const newAchievements = achievementService.checkTaskCompletion(updatedTasks);
        
        // TODO: Hiển thị thông báo achievement (sẽ implement ở task tiếp theo)
        if (newAchievements.length > 0) {
          console.log('New achievements unlocked:', newAchievements);
        }
      }
      
      return {
        ...state,
        tasks: updatedTasks,
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'SOFT_DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, isDeleted: true, updatedAt: new Date() } : task
        ),
      };
    case 'DELETE_TASK_PERMANENTLY':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case 'SET_USER_LISTS':
      return { ...state, userLists: action.payload };
    case 'ADD_USER_LIST':
      const newUserLists = [...state.userLists, action.payload];
      
      // Kiểm tra achievement khi list được tạo
      const listAchievements = achievementService.checkListCreation(newUserLists);
      
      // TODO: Hiển thị thông báo achievement (sẽ implement ở task tiếp theo)
      if (listAchievements.length > 0) {
        console.log('New list achievements unlocked:', listAchievements);
      }
      
      return { ...state, userLists: newUserLists };
    case 'UPDATE_USER_LIST':
      return {
        ...state,
        userLists: state.userLists.map(list =>
          list.id === action.payload.id ? { ...list, ...action.payload.updates, updatedAt: new Date() } : list
        ),
      };
    case 'DELETE_USER_LIST':
      return { ...state, userLists: state.userLists.filter(list => list.id !== action.payload) };
    case 'SOFT_DELETE_USER_LIST':
      return {
        ...state,
        userLists: state.userLists.map(list =>
          list.id === action.payload ? { ...list, isDeleted: true, updatedAt: new Date() } : list
        ),
      };
    case 'DELETE_LIST_PERMANENTLY':
      return { ...state, userLists: state.userLists.filter(list => list.id !== action.payload) };
    case 'UPDATE_LIST':
      return {
        ...state,
        userLists: state.userLists.map(list =>
          list.id === action.payload.id ? action.payload : list
        ),
      };
    case 'DELETE_LIST':
      return { ...state, userLists: state.userLists.filter(list => list.id !== action.payload) };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SELECTED_LIST':
      return { ...state, selectedListId: action.payload };
    case 'SET_STREAK':
      return { ...state, streak: action.payload };
    case 'SET_BEST_STREAK':
      return { ...state, bestStreak: action.payload };
    case 'ADD_TO_RECENTLY_DELETED':
      const newDeletedItem: RecentlyDeletedItem = {
        id: Date.now().toString(),
        originalItem: action.payload.item,
        type: action.payload.type,
        deletedAt: new Date(),
        originalLocation: action.payload.type === 'task' ? (action.payload.item as Task).listId : undefined
      };
      return {
        ...state,
        recentlyDeleted: [...state.recentlyDeleted, newDeletedItem]
      };
    case 'REMOVE_FROM_RECENTLY_DELETED':
      return {
        ...state,
        recentlyDeleted: state.recentlyDeleted.filter(item => item.id !== action.payload)
      };
    case 'RESTORE_FROM_RECENTLY_DELETED':
      const itemToRestore = state.recentlyDeleted.find(item => item.id === action.payload);
      if (!itemToRestore) return state;

      const newState = {
        ...state,
        recentlyDeleted: state.recentlyDeleted.filter(item => item.id !== action.payload)
      };

      if (itemToRestore.type === 'task') {
        newState.tasks = [...newState.tasks, itemToRestore.originalItem as Task];
      } else {
        newState.userLists = [...newState.userLists, itemToRestore.originalItem as UserList];
      }

      return newState;
    case 'PERMANENTLY_DELETE':
      return {
        ...state,
        recentlyDeleted: []
      };
    case 'EMPTY_RECENTLY_DELETED':
      return {
        ...state,
        recentlyDeleted: []
      };
    case 'CLEANUP_OLD_DELETED_ITEMS':
       const thirtyDaysAgo = new Date();
       thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
       return {
         ...state,
         recentlyDeleted: state.recentlyDeleted.filter(item => item.deletedAt > thirtyDaysAgo)
       };
     case 'CLEAR_ALL_RECENTLY_DELETED':
       return {
         ...state,
         recentlyDeleted: []
       };
    case 'ADD_XP':
      const newXP = state.gamification.xp + action.payload;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return {
        ...state,
        gamification: {
          ...state.gamification,
          xp: newXP,
          level: newLevel,
          xpToNextLevel: (newLevel * 1000) - newXP
        }
      };
    case 'SET_LEVEL':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          level: action.payload,
          xpToNextLevel: (action.payload * 1000) - state.gamification.xp
        }
      };
    case 'ADD_MIND_GEMS':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          mindGems: state.gamification.mindGems + action.payload
        }
      };
    case 'SPEND_MIND_GEMS':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          mindGems: Math.max(0, state.gamification.mindGems - action.payload)
        }
      };
    case 'USE_STREAK_FREEZE':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          streakFreezes: Math.max(0, state.gamification.streakFreezes - 1)
        }
      };
    case 'ADD_STREAK_FREEZE':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          streakFreezes: state.gamification.streakFreezes + action.payload
        }
      };
    case 'UPDATE_GAMIFICATION':
      return {
        ...state,
        gamification: {
          ...state.gamification,
          ...action.payload
        }
      };
    case 'SET_PENDING_LEVEL_UP_EVENTS':
      return {
        ...state,
        pendingLevelUpEvents: action.payload
      };
    case 'SHOW_TASK_EDITOR':
      return {
        ...state,
        showTaskEditor: action.payload
      };
    case 'SHOW_ADD_LIST_INPUT':
      return {
        ...state,
        showAddListInput: action.payload
      };
    case 'SET_THEME_COLOR':
      return {
        ...state,
        themeColor: action.payload
      };
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile ? { ...state.userProfile, ...action.payload } : null
      };
    case 'PURCHASE_STREAK_FREEZE':
      if (state.gamification.mindGems >= StreakProtectionService.getStreakFreezeCost()) {
        const purchaseResult = StreakProtectionService.purchaseStreakFreeze();
        if (purchaseResult.success) {
          return {
            ...state,
            gamification: {
              ...state.gamification,
              mindGems: state.gamification.mindGems - StreakProtectionService.getStreakFreezeCost()
            }
          };
        }
      }
      return state;
    case 'REPAIR_STREAK':
      const offer = StreakProtectionService.getStreakRepairOffer();
      if (offer && offer.isAvailable && state.gamification.mindGems >= offer.cost) {
        const repairResult = StreakProtectionService.repairStreak(offer.previousStreak, offer.cost);
        if (repairResult.success) {
          return {
            ...state,
            streak: repairResult.restoredStreak,
            gamification: {
              ...state.gamification,
              mindGems: state.gamification.mindGems - offer.cost
            }
          };
        }
      }
      return state;
    case 'MARK_STREAK_BROKEN':
      StreakProtectionService.markStreakBroken(action.payload);
      return {
        ...state,
        streak: 0
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  user: User | null;
  goals: Task[];
  tasks: Task[];
  settings: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { syncGuestData } = useGuestDataSync();

  // Prepare data for cloud sync
  const contextValue = {
    state,
    dispatch,
    user: state.user,
    goals: state.tasks.filter(task => task.type === 'goal'),
    tasks: state.tasks,
    settings: {
      theme: state.themeColor,
      notifications: state.notificationSettings,
      gamification: state.gamification
    }
  };

  // Tự động sync dữ liệu guest khi state thay đổi
  useEffect(() => {
    syncGuestData(state);
  }, [state.tasks, state.userLists, state.gamification, state.streak, state.bestStreak]);

  return (
    <AppContext.Provider value={contextValue}>
      <DataSyncProvider>
        {children}
      </DataSyncProvider>
    </AppContext.Provider>
  );
}

// Component riêng để sử dụng useDataSync hook
function DataSyncProvider({ children }: { children: ReactNode }) {
  // Sử dụng useDataSync hook để tự động lưu dữ liệu
  useDataSync();
  
  return <>{children}</>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}