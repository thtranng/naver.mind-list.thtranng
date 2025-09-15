import React, { useState } from 'react';
import { BarChart3, TrendingUp, Target, Calendar, Flame, PieChart, Clock, Download, Filter, Heart, Star, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MotivationHub } from '../gamification/MotivationHub';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ProgressGoalBar } from '../analytics/ProgressGoalBar';

export function AnalyticsView() {
  const { state } = useApp();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('week');
  
  // Get real analytics data
  const analyticsData = useAnalytics(timeFilter);
  const {
    tasksCreated,
    tasksCompleted,
    completionRate,
    bestDay,
    weeklyData,
    listDistribution,
    priorityDistribution,
    activityHeatmap,
    currentStreak,
    bestStreak
  } = analyticsData;
  
  const currentProgress = tasksCompleted;
  const daysUntilRecord = bestStreak - currentStreak;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h2>
            <div className="flex items-center gap-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as 'week' | 'month' | 'year')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
          </div>

          {/* Progress Goal Bar */}
          <ProgressGoalBar 
            timeFilter={timeFilter}
            completionRate={completionRate}
            tasksCompleted={tasksCompleted}
            tasksCreated={tasksCreated}
          />



          {/* 1. Tổng quan Năng suất */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🎯 Tổng quan Năng suất
            </h3>
            
            {/* Widget Chuỗi Ngày Rực Lửa */}
            <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Flame className="w-20 h-20 text-yellow-300 animate-pulse" />
                    <div className="absolute inset-0 w-20 h-20 bg-yellow-300/20 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold mb-2">🔥 Chuỗi Ngày Rực Lửa</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black">{state.streak}</span>
                      <span className="text-2xl font-semibold opacity-90">ngày</span>
                    </div>
                    <p className="text-lg mt-2 opacity-90">
                      Kỷ lục cá nhân: <span className="font-bold">{state.bestStreak} ngày</span>
                    </p>
                    <p className="text-sm mt-3 bg-white/20 px-4 py-2 rounded-lg inline-block">
                      {daysUntilRecord > 0 
                        ? `🚀 Còn ${daysUntilRecord} ngày nữa để phá kỷ lục của chính bạn!`
                        : '🎉 Bạn thật tuyệt vời! Cố gắng phá kỷ lục nhé!'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hệ thống Điểm Năng suất */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl text-white">
              <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Điểm Năng suất Hôm nay
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <p className="text-sm opacity-90">Điểm hiện tại</p>
                  <p className="text-3xl font-bold">{state.productivityPoints}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <p className="text-sm opacity-90">Mục tiêu hàng ngày</p>
                  <p className="text-3xl font-bold">{state.dailyProductivityGoal}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                  <p className="text-sm opacity-90">Tiến độ</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/30 rounded-full h-3">
                      <div 
                        className="bg-yellow-300 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (state.productivityPoints / state.dailyProductivityGoal) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">
                      {Math.round((state.productivityPoints / state.dailyProductivityGoal) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm bg-white/20 p-3 rounded-lg">
                <p className="font-semibold mb-1">📋 Quy tắc Chuỗi Năng suất:</p>
                <ul className="space-y-1 text-xs opacity-90">
                  <li>• Hoàn thành mục tiêu điểm hàng ngày để duy trì chuỗi</li>
                  <li>• Việc dễ = 10 điểm, việc khó = 30 điểm</li>
                  <li>• Chuỗi reset về 0 nếu không đạt mục tiêu trong ngày</li>
                  <li>• Thời gian tính từ 00:00 đến 23:59 hàng ngày</li>
                </ul>
              </div>
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Công việc Đã tạo</p>
                    <p className="text-3xl font-bold text-gray-900">{tasksCreated}</p>
                    <p className="text-xs text-gray-500 mt-1">7 ngày qua</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Công việc Đã hoàn thành</p>
                    <p className="text-3xl font-bold text-gray-900">{tasksCompleted}</p>
                    <p className="text-xs text-gray-500 mt-1">7 ngày qua</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Tỷ lệ Hoàn thành</p>
                    <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">Rất tốt!</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Ngày Hiệu suất nhất</p>
                    <p className="text-2xl font-bold text-gray-900">{bestDay}</p>
                    <p className="text-xs text-gray-500 mt-1">8 công việc hoàn thành</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Phân tích Hiệu suất theo Thời gian */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📈 Phân tích Hiệu suất theo Thời gian
            </h3>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold">Biểu đồ Cột: Hoàn thành vs. Đã tạo</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Hoàn thành</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span className="text-sm text-gray-600">Đã tạo</span>
                  </div>
                </div>
              </div>
              <div className="h-80 flex items-end justify-between gap-4 px-4">
                {weeklyData.map((dayData, index) => {
                  const { day, created, completed } = dayData;
                  const maxValue = Math.max(...weeklyData.map(d => Math.max(d.created, d.completed)), 1);
                  return (
                    <div key={day} className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex items-end gap-1 h-60">
                        <div 
                          className="bg-green-500 rounded-t w-8 transition-all duration-500 hover:bg-green-600"
                          style={{ height: `${(completed / maxValue) * 100}%` }}
                          title={`Hoàn thành: ${completed}`}
                        ></div>
                        <div 
                          className="bg-gray-400 rounded-t w-8 transition-all duration-500 hover:bg-gray-500"
                          style={{ height: `${(created / maxValue) * 100}%` }}
                          title={`Đã tạo: ${created}`}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Phân tích Chi tiết Công việc */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              📊 Phân tích Chi tiết Công việc
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biểu đồ Tròn Phân bổ Nỗ lực */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold mb-4">Tỷ lệ Hoàn thành theo Danh sách</h4>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" 
                              strokeDasharray="75.4 251.2" strokeDashoffset="0"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" 
                              strokeDasharray="50.3 251.2" strokeDashoffset="-75.4"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="8" 
                              strokeDasharray="37.7 251.2" strokeDashoffset="-125.7"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">100%</p>
                        <p className="text-sm text-gray-600">Hoàn thành</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {listDistribution.slice(0, 5).map((item, index) => (
                    <div key={item.listName} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.listName}</span>
                      </div>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                  {listDistribution.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                      Chưa có dữ liệu
                    </div>
                  )}
                </div>
              </div>

              {/* Mức độ Ưu tiên & Đúng hạn */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold mb-4">Mức độ Ưu tiên</h4>
                  <div className="space-y-4">
                    {priorityDistribution.map((item, index) => {
                      const colorMap = {
                        'Khẩn cấp': 'bg-red-500',
                        'Quan trọng': 'bg-orange-500',
                        'Thông thường': 'bg-gray-500'
                      };
                      const color = colorMap[item.priority as keyof typeof colorMap] || 'bg-gray-500';
                      
                      return (
                        <div key={item.priority} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${color} rounded-full`}></div>
                            <span className="text-sm">{item.priority}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-2 ${color} rounded-full transition-all duration-500`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                    {priorityDistribution.length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-4">
                        Chưa có dữ liệu
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold mb-4">Đúng hạn vs. Trễ hạn</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Đúng hạn</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Trễ hạn</span>
                      <span className="font-medium text-red-600">15%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">🎉 Tuyệt vời! Bạn có khả năng quản lý deadline rất tốt!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Phân tích Thói quen Làm việc */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🗓️ Phân tích Thói quen Làm việc
            </h3>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold mb-4">Bản đồ nhiệt: Giờ Vàng Năng Suất</h4>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-2 min-w-[600px]">
                  <div></div>
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">{day}</div>
                  ))}
                  {['Sáng', 'Trưa', 'Chiều', 'Tối'].map((time, timeIndex) => (
                    <React.Fragment key={time}>
                      <div className="text-sm font-medium text-gray-600 py-3 pr-4">{time}</div>
                      {[0,1,2,3,4,5,6].map(dayIndex => {
                        const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                        const heatmapKey = `${dayNames[dayIndex]}-${time}`;
                        const heatmapData = activityHeatmap.find(item => item.day === dayNames[dayIndex] && item.time === time);
                        const count = heatmapData ? heatmapData.count : 0;
                        const maxCount = Math.max(...activityHeatmap.map(item => item.count), 1);
                        const intensity = count / maxCount;
                        
                        return (
                          <div 
                            key={`${timeIndex}-${dayIndex}`}
                            className="h-12 rounded cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center text-xs font-medium"
                            style={{ 
                              backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                              color: intensity > 0.5 ? 'white' : '#374151'
                            }}
                            title={`${time} ${dayNames[dayIndex]}: ${count} công việc`}
                          >
                            {count}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Ít hoạt động</span>
                <div className="flex items-center gap-1">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, index) => (
                    <div 
                      key={index}
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                    ></div>
                  ))}
                </div>
                <span>Nhiều hoạt động</span>
              </div>
              <p className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg">
                💡 <strong>Insight:</strong> Bạn làm việc hiệu quả nhất vào buổi sáng thứ 5 và thứ 6. Hãy sắp xếp những công việc quan trọng vào khung giờ này!
              </p>
            </div>
          </div>

          {/* 5. GAMIFICATION */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              💪 GAMIFICATION
            </h3>
            
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Heart className="w-12 h-12 text-pink-200 animate-pulse" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Cảm hứng Hôm nay</h4>
                    <p className="text-sm opacity-90">"Thành công không phải là chìa khóa của hạnh phúc. Hạnh phúc là chìa khóa của thành công."</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Star className="w-12 h-12 text-yellow-200 animate-bounce" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Thành tựu Tuần này</h4>
                    <p className="text-sm opacity-90">Bạn đã hoàn thành {tasksCompleted} công việc và duy trì chuỗi {currentStreak} ngày!</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <Zap className="w-12 h-12 text-blue-200 animate-pulse" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Năng lượng Tích cực</h4>
                    <p className="text-sm opacity-90">Mỗi công việc hoàn thành là một bước tiến gần hơn đến mục tiêu của bạn!</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <MotivationHub />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}