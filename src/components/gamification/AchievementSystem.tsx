import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Star, Flame, Target, Clock, Moon, Sun, Calendar, Users, Zap, Crown, Gift, CheckCircle, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Achievement as AchievementType, AchievementProgress, achievementService } from '../../services/achievementService';
import { cn } from '../../lib/utils';

interface AchievementSystemProps {
  className?: string;
}

// Component sử dụng service mới để quản lý thành tích

const categoryIcons = {
  beginner: Star,
  intermediate: Trophy,
  advanced: Crown,
  legendary: Zap
};

const categoryColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-purple-100 text-purple-800 border-purple-200',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const categoryLabels = {
  beginner: 'Người Mới',
  intermediate: 'Trung Cấp',
  advanced: 'Cao Cấp',
  legendary: 'Huyền Thoại'
};

const AchievementCard: React.FC<{ achievement: AchievementType }> = ({ achievement }) => {
  const CategoryIcon = categoryIcons[achievement.category];
  
  return (
    <Card className={cn(
      'relative transition-all duration-200 hover:shadow-md',
      achievement.isCompleted 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
        : 'bg-gray-50 border-gray-200'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'text-2xl p-2 rounded-lg',
              achievement.isCompleted 
                ? 'bg-green-100' 
                : 'bg-gray-100'
            )}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <CardTitle className={cn(
                'text-lg font-semibold',
                achievement.isCompleted ? 'text-green-800' : 'text-gray-700'
              )}>
                {achievement.title}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn('mt-1', categoryColors[achievement.category])}
              >
                <CategoryIcon className="w-3 h-3 mr-1" />
                {categoryLabels[achievement.category]}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {achievement.isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Lock className="w-6 h-6 text-gray-400" />
            )}
            <div className="text-right text-sm">
              <div className="text-yellow-600 font-medium">+{achievement.reward.xp} XP</div>
              <div className="text-blue-600 font-medium">+{achievement.reward.gems} Gems</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
        <div className="text-xs text-gray-500 mb-3">
          <strong>Yêu cầu:</strong> {achievement.requirement}
        </div>
        
        {achievement.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiến độ</span>
              <span className="font-medium">
                {achievement.progress.current}/{achievement.progress.target}
              </span>
            </div>
            <Progress 
              value={(achievement.progress.current / achievement.progress.target) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        {achievement.completedAt && (
          <div className="mt-3 text-xs text-green-600">
            Hoàn thành: {new Date(achievement.completedAt).toLocaleDateString('vi-VN')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function AchievementSystem({ className }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [progress, setProgress] = useState<AchievementProgress>({
    totalCompleted: 0,
    totalAchievements: 0,
    completionPercentage: 0,
    totalXpEarned: 0,
    totalGemsEarned: 0
  });
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = () => {
    const allAchievements = achievementService.getAchievements();
    const progressData = achievementService.getProgress();
    
    setAchievements(allAchievements);
    setProgress(progressData);
  };

  const getFilteredAchievements = () => {
    if (activeTab === 'all') return achievements;
    if (activeTab === 'completed') return achievements.filter(a => a.isCompleted);
    if (activeTab === 'pending') return achievements.filter(a => !a.isCompleted);
    return achievementService.getAchievementsByCategory(activeTab as AchievementType['category']);
  };

  const getMotivationalMessage = () => {
    if (progress.totalCompleted === 0) {
      return "Bạn đang trên hành trình chinh phục các thử thách! Hãy hoàn thành thành tích đầu tiên nhé!";
    } else if (progress.completionPercentage < 25) {
      return "Khởi đầu tuyệt vời! Tiếp tục phấn đấu để mở khóa thêm nhiều thành tích!";
    } else if (progress.completionPercentage < 50) {
      return "Bạn đang làm rất tốt! Hơn một phần tư hành trình đã hoàn thành!";
    } else if (progress.completionPercentage < 75) {
      return "Ấn tượng! Bạn đã vượt qua nửa chặng đường rồi!";
    } else if (progress.completionPercentage < 100) {
      return "Gần đến đích rồi! Chỉ còn một chút nữa thôi!";
    } else {
      return "Chúc mừng! Bạn đã chinh phục tất cả thành tích! Bạn thật sự là một bậc thầy!";
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header với thống kê tổng quan */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Trophy className="w-6 h-6" />
            <span>Hệ Thống Thành Tích</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-800 mb-2">
              {progress.totalCompleted}/{progress.totalAchievements}
            </div>
            <div className="text-blue-600 font-medium mb-3">
              Thành tích đã mở khóa
            </div>
            <Progress value={progress.completionPercentage} className="h-3 mb-3" />
            <div className="text-lg font-semibold text-blue-700">
              {progress.completionPercentage}% hoàn thành
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">{progress.totalXpEarned}</div>
              <div className="text-yellow-600 text-sm">Tổng XP kiếm được</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{progress.totalGemsEarned}</div>
              <div className="text-blue-600 text-sm">Tổng Gems kiếm được</div>
            </div>
          </div>
          
          <div className="text-center text-gray-600 italic mt-4 p-3 bg-white rounded-lg border">
            {getMotivationalMessage()}
          </div>
        </CardContent>
      </Card>

      {/* Tabs để lọc thành tích */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          <TabsTrigger value="pending">Chưa hoàn thành</TabsTrigger>
          <TabsTrigger value="beginner">Người mới</TabsTrigger>
          <TabsTrigger value="intermediate">Trung cấp</TabsTrigger>
          <TabsTrigger value="advanced">Cao cấp</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredAchievements().map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
          
          {getFilteredAchievements().length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không có thành tích nào trong danh mục này.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}