import React, { useState, useEffect } from 'react';
import { Star, Zap, Trophy, Target, Clock, Calendar, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface XPLevelSystemProps {
  className?: string;
}

interface XPSource {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon: React.ReactNode;
  color: string;
}

const XP_SOURCES: XPSource[] = [
  {
    id: 'basic-task',
    name: 'Công việc cơ bản',
    description: 'Hoàn thành một công việc thông thường',
    xp: 10,
    icon: <Target className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'important-task',
    name: 'Công việc quan trọng',
    description: 'Hoàn thành công việc được đánh dấu "Quan trọng"',
    xp: 15,
    icon: <Star className="w-4 h-4" />,
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: 'urgent-task',
    name: 'Công việc khẩn cấp',
    description: 'Hoàn thành công việc được đánh dấu "Khẩn cấp"',
    xp: 20,
    icon: <Zap className="w-4 h-4" />,
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'on-time-bonus',
    name: 'Bonus đúng hạn',
    description: 'Hoàn thành công việc đúng hạn hoặc sớm hơn',
    xp: 5,
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'daily-perfect',
    name: 'Hoàn hảo trong ngày',
    description: 'Hoàn thành tất cả công việc trong ngày',
    xp: 30,
    icon: <Trophy className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'planning-bonus',
    name: 'Bonus lập kế hoạch',
    description: 'Tạo ít nhất 3 task cho ngày mai',
    xp: 10,
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700'
  }
];

export function XPLevelSystem({ className }: XPLevelSystemProps) {
  const { state, dispatch } = useApp();
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [showXPGuide, setShowXPGuide] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(state.gamification.level);

  const { level, xp, xpToNextLevel } = state.gamification;

  // Detect level up and show animation
  useEffect(() => {
    if (level > previousLevel) {
      setShowLevelUpAnimation(true);
      toast.success(`🎉 Chúc mừng! Bạn đã lên cấp ${level}!`, {
        duration: 5000,
        description: `Bạn nhận được 100 Mind Gems thưởng!`
      });
      dispatch({ type: 'ADD_MIND_GEMS', payload: 100 });
      
      const timer = setTimeout(() => {
        setShowLevelUpAnimation(false);
        setPreviousLevel(level);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [level, previousLevel, dispatch]);

  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Tân Binh';
    if (level < 10) return 'Học Viên';
    if (level < 20) return 'Chiến Binh';
    if (level < 35) return 'Chuyên Gia';
    if (level < 50) return 'Bậc Thầy';
    if (level < 75) return 'Huyền Thoại';
    return 'Thần Thoại';
  };

  const getLevelColor = (level: number) => {
    if (level < 5) return 'text-gray-600';
    if (level < 10) return 'text-green-600';
    if (level < 20) return 'text-blue-600';
    if (level < 35) return 'text-purple-600';
    if (level < 50) return 'text-orange-600';
    if (level < 75) return 'text-red-600';
    return 'text-gradient-to-r from-yellow-400 to-red-500';
  };

  const currentLevelXP = level * 1000;
  const progressPercentage = ((currentLevelXP - xpToNextLevel) / 1000) * 100;

  const addTestXP = (amount: number) => {
    dispatch({ type: 'ADD_XP', payload: amount });
    toast.success(`+${amount} XP!`);
  };

  return (
    <div className={className}>
      <Card className={showLevelUpAnimation ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`relative ${showLevelUpAnimation ? 'animate-bounce' : ''}`}>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg ${showLevelUpAnimation ? 'animate-spin' : ''}`}>
                  {level}
                </div>
                {showLevelUpAnimation && (
                  <div className="absolute -top-2 -right-2">
                    <Star className="w-6 h-6 text-yellow-400 animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className={getLevelColor(level)}>{getLevelTitle(level)}</span>
                  <span className="text-gray-500">Lv.{level}</span>
                </CardTitle>
                <CardDescription>
                  {xp.toLocaleString()} XP • Còn {xpToNextLevel} XP để lên cấp
                </CardDescription>
              </div>
            </div>
            <Dialog open={showXPGuide} onOpenChange={setShowXPGuide}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Cách kiếm XP
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Hướng dẫn kiếm Experience Points (XP)
                  </DialogTitle>
                  <DialogDescription>
                    Mọi hành động tích cực đều mang lại XP. Hãy xem các cách để tăng cấp nhanh chóng!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {XP_SOURCES.map((source) => (
                      <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${source.color}`}>
                            {source.icon}
                          </div>
                          <div>
                            <div className="font-medium">{source.name}</div>
                            <div className="text-sm text-gray-600">{source.description}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="font-bold">
                          +{source.xp} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Mẹo tăng XP hiệu quả:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Ưu tiên hoàn thành công việc khẩn cấp và quan trọng</li>
                      <li>• Lập kế hoạch cho ngày mai để nhận bonus</li>
                      <li>• Cố gắng hoàn thành tất cả công việc trong ngày</li>
                      <li>• Hoàn thành công việc đúng hạn để nhận thêm XP</li>
                    </ul>
                  </div>


                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ cấp độ</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Lv.{level} ({(currentLevelXP - 1000).toLocaleString()} XP)</span>
              <span>Lv.{level + 1} ({currentLevelXP.toLocaleString()} XP)</span>
            </div>
          </div>

          {/* Level Benefits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border">
              <div className="text-lg font-bold text-orange-600">{xp.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Tổng XP</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
              <div className="text-lg font-bold text-purple-600">{getLevelTitle(level)}</div>
              <div className="text-xs text-gray-600">Danh hiệu</div>
            </div>
          </div>

          {/* Next Level Preview */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-1">
              Cấp {level + 1}: {getLevelTitle(level + 1)}
            </div>
            <div className="text-xs text-gray-600">
              Phần thưởng: 100 Mind Gems + Mở khóa tính năng mới
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}