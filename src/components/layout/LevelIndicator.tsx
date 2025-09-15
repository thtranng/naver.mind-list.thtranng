import React, { useState } from 'react';
import { Star, TrendingUp, Trophy, Flame } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MotivationHub } from '../gamification/MotivationHub';
import { LEVEL_TIERS, calculateXPForLevel } from '@/services/levelSystem';

export function LevelIndicator() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { state } = useApp();
  
  const levelData = state.levelData;
  const level = levelData?.level || 1;
  const currentXP = levelData?.currentXP || 0;
  const totalXP = levelData?.totalXPEarned || 0;
  const mindGems = levelData?.mindGems || 0;
  const streak = state.streak || 0;
  
  // Tính XP cần cho level tiếp theo
  const nextLevelXP = calculateXPForLevel(level + 1);
  const currentLevelXP = calculateXPForLevel(level);
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = Math.min((currentXP / xpNeededForNextLevel) * 100, 100);
  
  // Tìm tier hiện tại
  const currentTier = LEVEL_TIERS.find(tier => 
    level >= tier.minLevel && level <= tier.maxLevel
  ) || LEVEL_TIERS[0];
  
  // Level titles based on tiers
  const getLevelTitle = (level: number) => {
    const tier = LEVEL_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
    return tier?.name || 'Newbie';
  };
  
  const levelTitle = getLevelTitle(level);
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            {/* Level Section */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Star className="w-5 h-5 text-blue-400" />
                {level >= 10 && (
                  <div className="absolute inset-0 w-5 h-5 bg-blue-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-sm">Lv.{level}</span>
                <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Streak Section */}
            <div className="flex items-center gap-1">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className="text-white font-bold text-sm">{streak}</span>
            </div>
            

          </div>
      
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-black/95 text-white text-sm rounded-lg whitespace-nowrap z-50 min-w-64">
              <div className="text-center space-y-2">
                <div className="font-semibold text-blue-300">⭐ Cấp độ {level}</div>
                <div className="text-purple-300">{levelTitle}</div>
                
                <div className="space-y-1">
                  <div className="text-xs text-gray-300">
                    {currentXP.toLocaleString()} / {xpNeededForNextLevel.toLocaleString()} XP
                  </div>
                  <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-300">
                    Còn {(xpNeededForNextLevel - currentXP).toLocaleString()} XP để lên cấp
                  </div>
                </div>
                
                {/* Additional stats */}
                <div className="border-t border-gray-600 pt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-300">🔥 Streak:</span>
                    <span className="text-white">{streak} ngày</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-300">💎 Mind Gems:</span>
                    <span className="text-white">{mindGems.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-300">📊 Tổng XP:</span>
                    <span className="text-white">{totalXP.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Next level preview */}
                <div className="border-t border-gray-600 pt-2 text-xs text-gray-300">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Cấp {level + 1}: {getLevelTitle(level + 1)}</span>
                  </div>
                </div>
                
                <div className="text-xs text-blue-300 mt-2">
                  Nhấp để mở GAMIFICATION
                </div>
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95"></div>
            </div>
          )}
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GAMIFICATION
              </span>
              <div className="text-sm text-gray-600 font-normal">
                MIND LIST
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <MotivationHub />
      </DialogContent>
    </Dialog>
  );
}