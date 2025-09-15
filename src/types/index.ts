export interface Task {
  id: string;
  title: string;
  note?: string;
  isCompleted: boolean;
  dueDate?: Date;
  reminder?: Date;
  priority: 'none' | 'important' | 'urgent';
  listId: string;
  createdAt: Date;
  updatedAt: Date;
  subTasks?: SubTask[];
  isDeleted?: boolean;
  isTemplate?: boolean;
  templateId?: string;
  repeat?: 'never' | 'hourly' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'yearly';
  productivityPoints?: number;
  type?: 'task' | 'goal';
  timeSettings?: {
    time?: string;
    earlyReminder: 'none' | '10min' | '30min' | '1hour' | '1week' | '1month' | 'custom';
    customReminderValue?: number;
    customReminderUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
    repeat: 'never' | 'hourly' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'yearly';
    endRepeat: 'forever' | 'date';
    endRepeatDate?: Date;
    repeatSettings?: {
      type: 'never' | 'hourly' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'yearly';
      interval: number;
      endType: 'never' | 'date' | 'count';
      endDate?: Date;
      endCount?: number;
    };
  };
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface UserList {
  id: string;
  name: string;
  icon: string;
  iconName?: string; // Fluent UI icon name for customization
  color: string;
  isPinned: boolean;
  ownerId: string;
  taskCount?: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

export type ViewMode = 'list' | 'calendar' | 'analytics' | 'settings' | 'recently-edited' | 'recently-deleted';

export interface RecentlyDeletedItem {
  id: string;
  originalItem: Task | UserList;
  type: 'task' | 'list';
  deletedAt: Date;
  originalLocation?: string;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  mindGems: number;
  streakFreezes: number;
  weeklyXP: number;
  leaguePosition: number;
  leagueName: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'starter' | 'streak' | 'performance' | 'special' | 'social' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  reward: {
    xp: number;
    mindGems: number;
    title?: string;
  };
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  userLists: UserList[];
  currentView: ViewMode;
  selectedListId: string | null;
  showTaskEditor: boolean;
  showAddListInput: boolean;
  streak: number;
  bestStreak: number;
  recentlyDeleted: RecentlyDeletedItem[];
  gamification: GamificationStats;
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  themeColor?: string;
  userProfile: {
    id: string;
    username: string;
    email: string;
    level: number;
    mind_gems: number;
    unlocked_items: string[];
    avatar?: string;
  } | null;
  productivityPoints: number;
  dailyProductivityGoal: number;
  lastProductivityDate: string | null;
  levelData: UserLevelData;
  pendingLevelUpEvents: LevelUpEvent[];
  recentXPEvents: XPGainEvent[];
}

export interface SystemList {
  id: string;
  name: string;
  icon: string;
  filter: (tasks: Task[]) => Task[];
}

export interface NotificationChannel {
  inApp: boolean;
  push: boolean;
  email: boolean;
}

export interface NotificationSettings {
  masterControl: boolean;
  taskNotifications: {
    assignedToMe: NotificationChannel;
    taskCompleted: NotificationChannel;
    commentAdded: NotificationChannel;
    subtaskCompleted: NotificationChannel;
  };
  reminders: {
    dueDate: NotificationChannel;
    earlyReminder: NotificationChannel;
  };
  motivation: {
    dailyStreak: NotificationChannel;
    levelUp: NotificationChannel;
  };
  systemUpdates: {
    newFeatures: NotificationChannel;
    tips: NotificationChannel;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationSetting {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: any; // React component
  enabled: boolean;
  category: string;
  requiresAuth?: boolean;
}

// Comment & Collaboration System Types
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // For threaded replies
  reactions: { [emoji: string]: { count: number; users: string[] } };
  mentions: string[]; // User IDs mentioned in comment
  // Additional properties for compatibility
  userId?: string;
  userName?: string;
  userAvatar?: string;
  timestamp?: Date;
  replies?: Comment[];
}

export interface CommentReaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface ActivityItem {
  id: string;
  type: 'comment' | 'system';
  taskId?: string;
  createdAt?: Date;
  timestamp: Date;
  // For comments
  userId?: string;
  userName?: string;
  userAvatar?: string;
  content?: string;
  reactions?: { [emoji: string]: { count: number; users: string[] } };
  replies?: Comment[];
  // For Comment compatibility
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  updatedAt?: Date;
  mentions?: string[];
  // For system activities
  action?: string;
  details?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    userId?: string;
    userName?: string;
  };
}

export interface SystemActivity {
  id: string;
  type: 'system';
  action: 'task_created' | 'task_updated' | 'task_deleted' | 'task_completed' | 'due_date_changed' | 'priority_changed' | 'assigned' | 'unassigned' | 'assignee_changed' | 'status_changed' | 'subtask_added' | 'subtask_removed' | 'subtask_completed' | 'subtask_uncompleted' | 'attachment_added' | 'attachment_removed';
  details: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    userId: string;
    userName: string;
  };
  timestamp: Date;
}

export interface TaskCollaborator {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  permission: 'view' | 'edit' | 'admin';
  addedAt: Date;
  addedBy: string;
}

// Level & XP System Types
export interface LevelTier {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  icon: string;
}

export interface LevelReward {
  type: 'gems' | 'unlock' | 'theme' | 'icon_pack' | 'special';
  amount?: number;
  itemId?: string;
  description: string;
}

export interface LevelInfo {
  level: number;
  tier: LevelTier;
  title: string;
  xpRequired: number;
  rewards: LevelReward[];
}

export interface UserLevelData {
  level: number;
  currentXP: number;
  totalXPEarned: number;
  mindGems: number;
  unlockedItems: string[];
  currentTier: LevelTier;
  nextLevelXP: number;
  progressToNextLevel: number;
}

export interface XPGainEvent {
  type: 'task_complete' | 'on_time_bonus' | 'priority_bonus' | 'streak_bonus';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface LevelUpEvent {
  newLevel: number;
  newTier?: LevelTier;
  rewards: LevelReward[];
  totalXPEarned: number;
  timestamp: Date;
}