import React, { useEffect, useState } from 'react';
import { X, Trophy, Gem } from 'lucide-react';
import { achievementNotificationService, AchievementNotification } from '@/services/achievementNotificationService';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  notification: AchievementNotification;
  onClose: () => void;
}

const AchievementNotificationCard: React.FC<AchievementNotificationProps> = ({ notification, onClose }) => {
  const { achievement } = notification;
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Animation entrance
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      achievementNotificationService.markAsShown(notification.id);
      onClose();
    }, 300);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-blue-500 to-indigo-600';
      case 'advanced': return 'from-purple-500 to-violet-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryBorder = (category: string) => {
    switch (category) {
      case 'beginner': return 'border-green-400';
      case 'intermediate': return 'border-blue-400';
      case 'advanced': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 transform transition-all duration-300 ease-out',
        getCategoryBorder(achievement.category),
        isVisible && !isClosing ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
        isClosing && 'translate-x-full opacity-0 scale-95'
      )}
    >
      {/* Header với gradient */}
      <div className={cn(
        'bg-gradient-to-r text-white p-4 rounded-t-lg relative overflow-hidden',
        getCategoryColor(achievement.category)
      )}>
        {/* Sparkle effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-bounce">
              {achievement.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">🎉 Thành tích mới!</h3>
              <p className="text-sm opacity-90 capitalize">{achievement.category}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
          {achievement.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {achievement.description}
        </p>
        
        {/* Rewards */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Phần thưởng:
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <Trophy size={16} />
              <span className="font-bold">+{achievement.reward.xp} XP</span>
            </div>
            <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
              <Gem size={16} />
              <span className="font-bold">+{achievement.reward.gems} Gems</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar animation */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
        <div 
          className={cn(
            'h-full bg-gradient-to-r transition-all duration-5000 ease-linear',
            getCategoryColor(achievement.category)
          )}
          style={{
            width: isVisible ? '100%' : '0%'
          }}
        />
      </div>
    </div>
  );
};

// Container component để quản lý multiple notifications
const AchievementNotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);

  useEffect(() => {
    const unsubscribe = achievementNotificationService.subscribe((notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    return unsubscribe;
  }, []);

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <AchievementNotificationCard
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
};

export default AchievementNotificationContainer;
export { AchievementNotificationCard };