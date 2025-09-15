import React from 'react';
import { Star, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Progress } from '@/components/ui/progress';

export function LevelProgressBar() {
  const { state } = useApp();

  const { level, xp, xpToNextLevel } = state.gamification;

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
    return 'text-yellow-500';
  };

  const currentLevelXP = level * 1000;
  const progressPercentage = ((currentLevelXP - xpToNextLevel) / 1000) * 100;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {level}
            </div>
            <div className="absolute -top-1 -right-1">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${getLevelColor(level)}`}>
              {getLevelTitle(level)}
            </h2>
            <p className="text-gray-600">
              Level {level} • {xp.toLocaleString()} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="w-4 h-4" />
            <span>Còn {xpToNextLevel} XP để lên cấp</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Tiến độ cấp độ</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-4 bg-white" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Lv.{level}</span>
          <span>Lv.{level + 1}</span>
        </div>
      </div>
    </div>
  );
}