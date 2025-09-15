import { UserList, Task } from '../types';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';
import { achievementNotificationService } from './achievementNotificationService';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  requirement: string;
  reward: {
    xp: number;
    gems: number;
  };
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'legendary';
  isCompleted: boolean;
  completedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface AchievementProgress {
  totalCompleted: number;
  totalAchievements: number;
  completionPercentage: number;
  totalXpEarned: number;
  totalGemsEarned: number;
}

class AchievementService {
  private achievements: Achievement[] = [
    {
      id: 'first-task',
      title: 'Nhà Chính Phục Ti Hon',
      description: 'Hoàn thành task đầu tiên của bạn',
      requirement: 'Hoàn thành 1 task',
      reward: { xp: 50, gems: 25 },
      icon: '🎯',
      category: 'beginner',
      isCompleted: false
    },
    {
      id: 'first-list',
      title: 'Người Tạo Danh Sách',
      description: 'Tạo danh sách đầu tiên của bạn',
      requirement: 'Tạo 1 danh sách',
      reward: { xp: 30, gems: 15 },
      icon: '📝',
      category: 'beginner',
      isCompleted: false
    },
    {
      id: 'task-streak-3',
      title: 'Người Kiên Trì',
      description: 'Hoàn thành task trong 3 ngày liên tiếp',
      requirement: 'Streak 3 ngày',
      reward: { xp: 100, gems: 50 },
      icon: '🔥',
      category: 'beginner',
      isCompleted: false
    },
    {
      id: 'tasks-10',
      title: 'Chiến Binh Nhiệm Vụ',
      description: 'Hoàn thành 10 task',
      requirement: 'Hoàn thành 10 task',
      reward: { xp: 200, gems: 100 },
      icon: '⚔️',
      category: 'intermediate',
      isCompleted: false,
      progress: { current: 0, target: 10 }
    },
    {
      id: 'lists-5',
      title: 'Quản Lý Chuyên Nghiệp',
      description: 'Tạo 5 danh sách khác nhau',
      requirement: 'Tạo 5 danh sách',
      reward: { xp: 150, gems: 75 },
      icon: '📋',
      category: 'intermediate',
      isCompleted: false,
      progress: { current: 0, target: 5 }
    },
    {
      id: 'task-streak-7',
      title: 'Bậc Thầy Kỷ Luật',
      description: 'Hoàn thành task trong 7 ngày liên tiếp',
      requirement: 'Streak 7 ngày',
      reward: { xp: 300, gems: 150 },
      icon: '👑',
      category: 'intermediate',
      isCompleted: false
    },
    {
      id: 'tasks-50',
      title: 'Chiến Thần Nhiệm Vụ',
      description: 'Hoàn thành 50 task',
      requirement: 'Hoàn thành 50 task',
      reward: { xp: 500, gems: 250 },
      icon: '🏆',
      category: 'advanced',
      isCompleted: false,
      progress: { current: 0, target: 50 }
    },
    {
      id: 'lists-20',
      title: 'Kiến Trúc Sư Tổ Chức',
      description: 'Tạo 20 danh sách',
      requirement: 'Tạo 20 danh sách',
      reward: { xp: 400, gems: 200 },
      icon: '🏗️',
      category: 'advanced',
      isCompleted: false,
      progress: { current: 0, target: 20 }
    },
    {
      id: 'task-streak-30',
      title: 'Huyền Thoại Kiên Trì',
      description: 'Hoàn thành task trong 30 ngày liên tiếp',
      requirement: 'Streak 30 ngày',
      reward: { xp: 1000, gems: 500 },
      icon: '🌟',
      category: 'advanced',
      isCompleted: false
    },
    {
      id: 'tasks-100',
      title: 'Thế Lực Nhiệm Vụ',
      description: 'Hoàn thành 100 task',
      requirement: 'Hoàn thành 100 task',
      reward: { xp: 800, gems: 400 },
      icon: '💎',
      category: 'advanced',
      isCompleted: false,
      progress: { current: 0, target: 100 }
    },
    {
      id: 'tasks-500',
      title: 'Hoàng Đế Nhiệm Vụ',
      description: 'Hoàn thành 500 task',
      requirement: 'Hoàn thành 500 task',
      reward: { xp: 2000, gems: 1000 },
      icon: '👑',
      category: 'legendary',
      isCompleted: false,
      progress: { current: 0, target: 500 }
    },
    {
      id: 'tasks-1000',
      title: 'Bậc Thầy Nhiệm Vụ',
      description: 'Hoàn thành 1000 task',
      requirement: 'Hoàn thành 1000 task',
      reward: { xp: 5000, gems: 2500 },
      icon: '🔮',
      category: 'legendary',
      isCompleted: false,
      progress: { current: 0, target: 1000 }
    },
    {
      id: 'lists-100',
      title: 'Đế Chế Tổ Chức',
      description: 'Tạo 100 danh sách',
      requirement: 'Tạo 100 danh sách',
      reward: { xp: 3000, gems: 1500 },
      icon: '🏰',
      category: 'legendary',
      isCompleted: false,
      progress: { current: 0, target: 100 }
    },
    {
      id: 'perfectionist',
      title: 'Người Hoàn Hảo',
      description: 'Hoàn thành tất cả task trong một danh sách',
      requirement: 'Hoàn thành 100% task trong 1 danh sách',
      reward: { xp: 150, gems: 75 },
      icon: '✨',
      category: 'intermediate',
      isCompleted: false
    },
    {
      id: 'speed-demon',
      title: 'Tốc Độ Ánh Sáng',
      description: 'Hoàn thành 10 task trong một ngày',
      requirement: 'Hoàn thành 10 task trong 1 ngày',
      reward: { xp: 250, gems: 125 },
      icon: '⚡',
      category: 'intermediate',
      isCompleted: false
    }
  ];

  private readonly STORAGE_KEY = 'achievements';
  private readonly STATS_KEY = 'achievement_stats';

  constructor() {
    this.loadAchievements();
  }

  private loadAchievements(): void {
    const stored = loadFromLocalStorage(this.STORAGE_KEY, []);
    if (stored && Array.isArray(stored)) {
      // Merge stored data with default achievements
      this.achievements = this.achievements.map(achievement => {
        const storedAchievement = stored.find(s => s.id === achievement.id);
        return storedAchievement ? { ...achievement, ...storedAchievement } : achievement;
      });
    }
  }

  private saveAchievements(): void {
    saveToLocalStorage(this.STORAGE_KEY, this.achievements);
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(achievement => achievement.category === category);
  }

  getProgress(): AchievementProgress {
    const completed = this.achievements.filter(a => a.isCompleted);
    const totalXpEarned = completed.reduce((sum, a) => sum + a.reward.xp, 0);
    const totalGemsEarned = completed.reduce((sum, a) => sum + a.reward.gems, 0);
    
    return {
      totalCompleted: completed.length,
      totalAchievements: this.achievements.length,
      completionPercentage: Math.round((completed.length / this.achievements.length) * 100),
      totalXpEarned,
      totalGemsEarned
    };
  }

  checkTaskCompletion(tasks: Task[]): Achievement[] {
    const newlyCompleted: Achievement[] = [];
    const completedTasks = tasks.filter(task => task.isCompleted);
    const totalCompletedTasks = completedTasks.length;

    // Check task count achievements
    const taskCountAchievements = [
      { id: 'first-task', target: 1 },
      { id: 'tasks-10', target: 10 },
      { id: 'tasks-50', target: 50 },
      { id: 'tasks-100', target: 100 },
      { id: 'tasks-500', target: 500 },
      { id: 'tasks-1000', target: 1000 }
    ];

    taskCountAchievements.forEach(({ id, target }) => {
      const achievement = this.achievements.find(a => a.id === id);
      if (achievement && !achievement.isCompleted && totalCompletedTasks >= target) {
        achievement.isCompleted = true;
        achievement.completedAt = new Date();
        if (achievement.progress) {
          achievement.progress.current = totalCompletedTasks;
        }
        newlyCompleted.push(achievement);
      } else if (achievement && achievement.progress) {
        achievement.progress.current = Math.min(totalCompletedTasks, target);
      }
    });

    // Check daily task completion
    const today = new Date().toDateString();
    const todayTasks = completedTasks.filter(task => 
      task.updatedAt && new Date(task.updatedAt).toDateString() === today
    );

    if (todayTasks.length >= 10) {
      const speedAchievement = this.achievements.find(a => a.id === 'speed-demon');
      if (speedAchievement && !speedAchievement.isCompleted) {
        speedAchievement.isCompleted = true;
        speedAchievement.completedAt = new Date();
        newlyCompleted.push(speedAchievement);
      }
    }

    if (newlyCompleted.length > 0) {
      this.saveAchievements();
      // Gửi thông báo cho mỗi achievement mới hoàn thành
      newlyCompleted.forEach(achievement => {
        achievementNotificationService.addNotification(achievement);
      });
    }

    return newlyCompleted;
  }

  checkListCreation(lists: UserList[]): Achievement[] {
    const newlyCompleted: Achievement[] = [];
    const totalLists = lists.length;

    // Check list count achievements
    const listCountAchievements = [
      { id: 'first-list', target: 1 },
      { id: 'lists-5', target: 5 },
      { id: 'lists-20', target: 20 },
      { id: 'lists-100', target: 100 }
    ];

    listCountAchievements.forEach(({ id, target }) => {
      const achievement = this.achievements.find(a => a.id === id);
      if (achievement && !achievement.isCompleted && totalLists >= target) {
        achievement.isCompleted = true;
        achievement.completedAt = new Date();
        if (achievement.progress) {
          achievement.progress.current = totalLists;
        }
        newlyCompleted.push(achievement);
      } else if (achievement && achievement.progress) {
        achievement.progress.current = Math.min(totalLists, target);
      }
    });

    if (newlyCompleted.length > 0) {
      this.saveAchievements();
      // Gửi thông báo cho mỗi achievement mới hoàn thành
      newlyCompleted.forEach(achievement => {
        achievementNotificationService.addNotification(achievement);
      });
    }

    return newlyCompleted;
  }

  checkPerfectList(list: UserList, tasks: Task[]): Achievement[] {
    const newlyCompleted: Achievement[] = [];
    const listTasks = tasks.filter(task => task.listId === list.id);
    
    if (listTasks.length > 0 && listTasks.every(task => task.isCompleted)) {
      const perfectAchievement = this.achievements.find(a => a.id === 'perfectionist');
      if (perfectAchievement && !perfectAchievement.isCompleted) {
        perfectAchievement.isCompleted = true;
        perfectAchievement.completedAt = new Date();
        newlyCompleted.push(perfectAchievement);
      }
    }

    if (newlyCompleted.length > 0) {
      this.saveAchievements();
      // Gửi thông báo cho mỗi achievement mới hoàn thành
      newlyCompleted.forEach(achievement => {
        achievementNotificationService.addNotification(achievement);
      });
    }

    return newlyCompleted;
  }

  checkStreakAchievements(streakDays: number): Achievement[] {
    const newlyCompleted: Achievement[] = [];
    
    const streakAchievements = [
      { id: 'task-streak-3', target: 3 },
      { id: 'task-streak-7', target: 7 },
      { id: 'task-streak-30', target: 30 }
    ];

    streakAchievements.forEach(({ id, target }) => {
      const achievement = this.achievements.find(a => a.id === id);
      if (achievement && !achievement.isCompleted && streakDays >= target) {
        achievement.isCompleted = true;
        achievement.completedAt = new Date();
        newlyCompleted.push(achievement);
      }
    });

    if (newlyCompleted.length > 0) {
      this.saveAchievements();
      // Gửi thông báo cho mỗi achievement mới hoàn thành
      newlyCompleted.forEach(achievement => {
        achievementNotificationService.addNotification(achievement);
      });
    }

    return newlyCompleted;
  }

  resetAchievements(): void {
    this.achievements.forEach(achievement => {
      achievement.isCompleted = false;
      achievement.completedAt = undefined;
      if (achievement.progress) {
        achievement.progress.current = 0;
      }
    });
    this.saveAchievements();
  }
}

export const achievementService = new AchievementService();
export default achievementService;