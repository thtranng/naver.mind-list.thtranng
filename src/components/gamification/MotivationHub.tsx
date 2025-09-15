import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Star, 
  ShoppingBag, 
  Award, 
  TrendingUp,
  Users,
  Gem,
  Shield,
  Target,
  Calendar,
  Clock,
  Zap
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { StreakSystem } from './StreakSystem';
import { XPLevelSystem } from './XPLevelSystem';
import { ProductivityLeagues } from './ProductivityLeagues';
import { MindGemsShop } from './MindGemsShop';
import { AchievementSystem } from './AchievementSystem';
import { GuestCallToAction } from '@/components/auth/GuestCallToAction';
import { AuthModal } from '@/components/auth/AuthModal';
import { StreakRepairModal } from './StreakRepairModal';
import { StreakProtectionService } from '@/services/streakProtectionService';

type TabType = 'overview' | 'shop' | 'achievements';

export function MotivationHub() {
  const { state } = useApp();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [showStreakRepairModal, setShowStreakRepairModal] = useState(false);
  const [previousStreak, setPreviousStreak] = useState(0);

  // Guest mode default stats
  const guestStats = {
    level: 0,
    xp: 0,
    xpToNextLevel: 250,
    currentStreak: 0,
    bestStreak: 0,
    mindGems: 0,
    weeklyXP: 0,
    leaguePosition: 0,
    leagueName: 'Chưa xếp hạng',
    streakFreezes: 0
  };

  // Use guest stats if not authenticated, otherwise use real data
  const userStats = isAuthenticated ? {
    level: state.gamification.level,
    xp: state.gamification.xp,
    xpToNextLevel: state.gamification.xpToNextLevel,
    currentStreak: state.streak || 0,
    bestStreak: state.bestStreak || 0,
    mindGems: state.gamification.mindGems,
    weeklyXP: state.gamification.weeklyXP,
    leaguePosition: state.gamification.leaguePosition,
    leagueName: state.gamification.leagueName,
    streakFreezes: state.gamification.streakFreezes
  } : guestStats;

  // Kiểm tra xem có cần hiển thị Streak Repair Modal không
  React.useEffect(() => {
    if (isAuthenticated && state.streak === 0) {
      const repairOffer = StreakProtectionService.getStreakRepairOffer();
      if (repairOffer && repairOffer.isAvailable) {
        setPreviousStreak(repairOffer.previousStreak);
        setShowStreakRepairModal(true);
      }
    }
  }, [isAuthenticated, state.streak]);

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  // Calculate list statistics
  const systemListsStats = [
    { name: 'All Tasks', count: state.tasks.filter(t => !t.isCompleted).length },
    { name: 'Important', count: state.tasks.filter(t => (t.priority === 'important' || t.priority === 'urgent') && !t.isCompleted).length },
    { name: 'Today', count: state.tasks.filter(t => {
      const today = new Date().toDateString();
      return t.dueDate && new Date(t.dueDate).toDateString() === today && !t.isCompleted;
    }).length },
    { name: 'Completed', count: state.tasks.filter(t => t.isCompleted).length }
  ];

  const userListsStats = state.userLists.map(list => ({
    name: list.name,
    count: state.tasks.filter(t => t.listId === list.id && !t.isCompleted).length,
    color: list.color,
    isPinned: list.isPinned
  }));

  const totalActiveTasks = state.tasks.filter(t => !t.isCompleted).length;
  const totalCompletedTasks = state.tasks.filter(t => t.isCompleted).length;

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'shop', label: 'Cửa hàng', icon: ShoppingBag },
    { id: 'achievements', label: 'Thành tích', icon: Award }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Cấp độ {userStats.level}</h2>
            <p className="text-blue-100">Nhà Chinh Phục Mục Tiêu</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Gem className="w-5 h-5" />
              <span className="text-xl font-bold">{userStats.mindGems}</span>
            </div>
            <p className="text-blue-100 text-sm">Mind Gems</p>
          </div>
        </div>
        
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiến độ XP</span>
            <span>{userStats.xp} / {userStats.xp + userStats.xpToNextLevel}</span>
          </div>
          <div className="w-full bg-blue-400 bg-opacity-30 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${(userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Guest Call to Action - chỉ hiển thị cho guest users */}
      {!isAuthenticated && (
        <GuestCallToAction onSignUpClick={handleSignUpClick} />
      )}

      {/* Quick Stats Grid - ẩn cho guest users */}
      {isAuthenticated && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Streak */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{userStats.currentStreak}</p>
                <p className="text-xs text-orange-600">Chuỗi hiện tại</p>
              </div>
            </div>
            {userStats.streakFreezes > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <Shield className="w-3 h-3" />
                <span>{userStats.streakFreezes} Đóng băng</span>
              </div>
            )}
          </div>

          {/* Best Streak */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Target className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{userStats.bestStreak}</p>
                <p className="text-xs text-red-600">Kỷ lục</p>
              </div>
            </div>
          </div>

          {/* Weekly XP */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{userStats.weeklyXP}</p>
                <p className="text-xs text-green-600">XP tuần này</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">{state.gamification.achievements.filter(a => a.isUnlocked).length}</p>
                <p className="text-xs text-yellow-600">Thành tích đã mở</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Achievement Progress Summary - chỉ hiển thị cho logged-in users */}
      {isAuthenticated && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Tiến độ Thành tích
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Achievements */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Thành tích gần đây:</h4>
              {state.gamification.achievements
                .filter(a => a.isUnlocked)
                .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
                .slice(0, 3)
                .map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-lg">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">{achievement.name}</p>
                      <p className="text-xs text-yellow-600">
                        {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString('vi-VN') : 'Vừa mở khóa'}
                      </p>
                    </div>
                  </div>
                ))
              }
              {state.gamification.achievements.filter(a => a.isUnlocked).length === 0 && (
                <p className="text-sm text-gray-500 italic">Chưa có thành tích nào được mở khóa</p>
              )}
            </div>
            
            {/* Achievement Categories */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Theo danh mục:</h4>
              {['starter', 'streak', 'productivity', 'milestone'].map(category => {
                const categoryAchievements = state.gamification.achievements.filter(a => a.category === category);
                const unlockedCount = categoryAchievements.filter(a => a.isUnlocked).length;
                const totalCount = categoryAchievements.length;
                const categoryNames: Record<string, string> = {
                  starter: 'Khởi đầu',
                  streak: 'Chuỗi',
                  productivity: 'Năng suất',
                  milestone: 'Cột mốc'
                };
                
                return (
                  <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{categoryNames[category]}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{unlockedCount}/{totalCount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Systems - chỉ hiển thị cho logged-in users */}
      {isAuthenticated && (
        <div className="space-y-6">
          <StreakSystem />
          <XPLevelSystem />
        </div>
      )}

      {/* Daily Goals */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Mục tiêu hôm nay
        </h3>
        <div className="space-y-3">
          {/* Complete at least 1 task */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Hoàn thành ít nhất 1 công việc</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              totalCompletedTasks > 0 ? 'bg-green-500' : 'border-2 border-gray-300'
            }`}>
              {totalCompletedTasks > 0 && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          
          {/* Complete today's tasks */}
          {(() => {
            const today = new Date().toDateString();
            const todayTasks = state.tasks.filter(t => 
              t.dueDate && new Date(t.dueDate).toDateString() === today
            );
            const completedTodayTasks = todayTasks.filter(t => t.isCompleted).length;
            const totalTodayTasks = todayTasks.length;
            
            if (totalTodayTasks > 0) {
              return (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Hoàn thành công việc hôm nay ({completedTodayTasks}/{totalTodayTasks})</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    completedTodayTasks === totalTodayTasks && totalTodayTasks > 0 ? 'bg-green-500' : 'border-2 border-gray-300'
                  }`}>
                    {completedTodayTasks === totalTodayTasks && totalTodayTasks > 0 && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })()}
          
          {/* Reduce active tasks */}
          {totalActiveTasks > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Giảm công việc đang làm xuống dưới {Math.max(1, totalActiveTasks - 2)}</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                totalActiveTasks < Math.max(1, totalActiveTasks - 2) ? 'bg-green-500' : 'border-2 border-gray-300'
              }`}>
                {totalActiveTasks < Math.max(1, totalActiveTasks - 2) && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          )}
          
          {/* No active tasks - encourage adding new ones */}
          {totalActiveTasks === 0 && totalCompletedTasks === 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Thêm công việc đầu tiên của bạn</span>
              <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
            </div>
          )}
        </div>
      </div>


    </div>
  );

  const renderLeagues = () => <ProductivityLeagues />;

  const renderShop = () => <MindGemsShop />;

  const renderAchievements = () => <AchievementSystem />;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🎯 MIND LIST</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'shop' && renderShop()}
          {activeTab === 'achievements' && renderAchievements()}
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
      
      {/* Streak Repair Modal */}
      {isAuthenticated && (
        <StreakRepairModal
          isOpen={showStreakRepairModal}
          onClose={() => setShowStreakRepairModal(false)}
          previousStreak={previousStreak}
        />
      )}
    </div>
  );
}