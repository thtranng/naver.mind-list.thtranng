import React from 'react';
import { Target, TrendingUp, Calendar } from 'lucide-react';

interface ProgressGoalBarProps {
  timeFilter: 'week' | 'month' | 'year';
  completionRate: number;
  tasksCompleted: number;
  tasksCreated: number;
}

export function ProgressGoalBar({ timeFilter, completionRate, tasksCompleted, tasksCreated }: ProgressGoalBarProps) {
  const progressPercentage = completionRate;
  const isOverGoal = false; // Không còn khái niệm vượt mục tiêu
  
  const getTimeLabel = () => {
    switch (timeFilter) {
      case 'week': return 'tuần này';
      case 'month': return 'tháng này';
      case 'year': return 'năm nay';
      default: return 'tuần này';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              🎯 Tiến độ hoàn thành {getTimeLabel()}
            </h3>
            <p className="text-sm text-gray-600">
              Theo dõi tỷ lệ hoàn thành task
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                isOverGoal 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : progressPercentage >= 80 
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : progressPercentage >= 50
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
            {isOverGoal && (
              <div 
                className="absolute top-0 left-0 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"
                style={{ width: '100%' }}
              />
            )}
          </div>
          
          {/* Progress Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white drop-shadow-sm">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-900">{tasksCompleted}</span>
              <span className="text-gray-600">/ {tasksCreated} task hoàn thành</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">
                Tỷ lệ: {Math.round(completionRate)}%
              </span>
            </div>
          </div>
          
          <div className="text-right">
            {progressPercentage >= 100 ? (
              <span className="text-green-600 font-semibold flex items-center gap-1">
                🎉 Hoàn thành 100%!
              </span>
            ) : progressPercentage >= 80 ? (
              <span className="text-green-600 font-medium">
                🔥 Gần hoàn thành!
              </span>
            ) : progressPercentage >= 50 ? (
              <span className="text-orange-600 font-medium">
                💪 Đang tiến bộ tốt!
              </span>
            ) : (
              <span className="text-blue-600 font-medium">
                🚀 Hãy cố gắng!
              </span>
            )}
          </div>
        </div>

        {/* Motivational Message */}
        {tasksCreated > 0 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              {progressPercentage >= 100 
                ? `🌟 Xuất sắc! Bạn đã hoàn thành tất cả ${tasksCompleted} task!`
                : progressPercentage >= 80
                  ? `🔥 Tuyệt vời! Bạn đã hoàn thành ${Math.round(progressPercentage)}% task!`
                  : progressPercentage >= 50
                    ? `💪 Tốt lắm! Bạn đã hoàn thành hơn một nửa số task rồi!`
                    : tasksCompleted > 0
                      ? `🚀 Bắt đầu tốt! Hãy tiếp tục hoàn thành các task còn lại!`
                      : `📝 Bạn đã tạo ${tasksCreated} task, hãy bắt đầu hoàn thành chúng!`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}