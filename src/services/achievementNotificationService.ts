import { Achievement } from './achievementService';

export interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: Date;
  isShown: boolean;
}

class AchievementNotificationService {
  private notifications: AchievementNotification[] = [];
  private listeners: ((notification: AchievementNotification) => void)[] = [];

  // Thêm thông báo mới khi hoàn thành achievement
  addNotification(achievement: Achievement): void {
    const notification: AchievementNotification = {
      id: `achievement-${achievement.id}-${Date.now()}`,
      achievement,
      timestamp: new Date(),
      isShown: false
    };

    this.notifications.push(notification);
    
    // Thông báo cho tất cả listeners
    this.listeners.forEach(listener => listener(notification));
  }

  // Đăng ký listener để nhận thông báo
  subscribe(listener: (notification: AchievementNotification) => void): () => void {
    this.listeners.push(listener);
    
    // Trả về function để unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Đánh dấu thông báo đã được hiển thị
  markAsShown(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isShown = true;
    }
  }

  // Lấy tất cả thông báo chưa hiển thị
  getUnshownNotifications(): AchievementNotification[] {
    return this.notifications.filter(n => !n.isShown);
  }

  // Xóa thông báo cũ (giữ lại 50 thông báo gần nhất)
  cleanup(): void {
    if (this.notifications.length > 50) {
      this.notifications = this.notifications
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 50);
    }
  }
}

export const achievementNotificationService = new AchievementNotificationService();
export default achievementNotificationService;