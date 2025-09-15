import React, { useState } from 'react';
import { Flame, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { state } = useApp();
  
  const bestStreak = state.bestStreak || streak;
  const daysToRecord = bestStreak > streak ? bestStreak - streak : 0;
  const streakFreezes = state.gamification?.streakFreezes || 0;
  
  const isActive = streak > 0;
  const flameColor = isActive ? 'text-orange-400' : 'text-gray-400';
  const bgColor = isActive ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20' : 'bg-white/10';
  
  // Enhanced animation for active streaks
  const flameAnimation = isActive ? (
    streak >= 7 ? 'animate-bounce' : 'animate-pulse'
  ) : '';
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bgColor} border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer relative`}>
        <div className="relative">
          <Flame 
            className={`w-6 h-6 ${flameColor} ${flameAnimation} transition-all duration-300`}
          />
          {/* Glow effect for high streaks */}
          {isActive && streak >= 7 && (
            <div className="absolute inset-0 w-6 h-6 bg-orange-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-white font-bold text-xl">{streak}</span>
          <span className="text-white/80 text-xs font-medium tracking-wider">STREAK</span>
        </div>
        
        {/* Streak Freeze Indicator */}
        {streakFreezes > 0 && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {streakFreezes}
          </div>
        )}
      </div>
      
      {/* Enhanced Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-black/95 text-white text-sm rounded-lg whitespace-nowrap z-50 min-w-64">
          <div className="text-center space-y-2">
            <div className="font-semibold text-orange-300">🔥 Chuỗi ngày hiện tại: {streak}</div>
            <div className="font-semibold">🏆 Kỷ lục cá nhân: {bestStreak} ngày</div>
            
            {daysToRecord > 0 ? (
              <div className="text-orange-300">Còn {daysToRecord} ngày nữa để phá kỷ lục!</div>
            ) : streak === bestStreak && streak > 0 ? (
              <div className="text-green-300">🎉 Bạn đang ở đỉnh cao!</div>
            ) : (
              <div className="text-blue-300">Bắt đầu chuỗi ngày mới!</div>
            )}
            
            {/* Streak Freeze Info */}
            {streakFreezes > 0 && (
              <div className="flex items-center justify-center gap-2 text-blue-300 border-t border-gray-600 pt-2">
                <Shield className="w-4 h-4" />
                <span>{streakFreezes} Đóng Băng Chuỗi</span>
              </div>
            )}
            
            {/* Milestone indicators */}
            {streak > 0 && (
              <div className="text-xs text-gray-300 border-t border-gray-600 pt-2">
                {streak >= 30 ? '🏆 Bậc Thầy Thói Quen!' :
                 streak >= 7 ? '⭐ Chiến Binh Bền Bỉ!' :
                 '🌱 Đang xây dựng thói quen...'}
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95"></div>
        </div>
      )}
    </div>
  );
}