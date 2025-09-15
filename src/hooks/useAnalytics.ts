import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task, UserList } from '@/types';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';

export interface AnalyticsData {
  // Basic metrics
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
  bestDay: string;
  
  // Time-based data
  weeklyData: {
    day: string;
    created: number;
    completed: number;
  }[];
  
  // List distribution
  listDistribution: {
    listName: string;
    taskCount: number;
    completedCount: number;
    percentage: number;
    color: string;
  }[];
  
  // Priority distribution
  priorityDistribution: {
    priority: string;
    count: number;
    percentage: number;
  }[];
  
  // Activity heatmap
  activityHeatmap: {
    day: string;
    time: string;
    count: number;
  }[];
  
  // Streak and progress
  currentStreak: number;
  bestStreak: number;
}

export function useAnalytics(timeFilter: 'week' | 'month' | 'year' = 'week'): AnalyticsData {
  const { state } = useApp();
  
  return useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    
    // Determine time range based on filter
    switch (timeFilter) {
      case 'week':
        startDate = startOfWeek(now, { locale: vi });
        endDate = endOfWeek(now, { locale: vi });
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = startOfWeek(now, { locale: vi });
        endDate = endOfWeek(now, { locale: vi });
    }
    
    // Filter tasks within time range (excluding deleted tasks)
    const activeTasks = state.tasks.filter(task => !task.isDeleted);
    const tasksInRange = activeTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return isWithinInterval(taskDate, { start: startDate, end: endDate });
    });
    
    // Basic metrics
    const tasksCreated = tasksInRange.length;
    const tasksCompleted = tasksInRange.filter(task => task.isCompleted).length;
    const completionRate = tasksCreated > 0 ? Math.round((tasksCompleted / tasksCreated) * 100) : 0;
    
    // Calculate best day
    const dayCompletions = tasksInRange
      .filter(task => task.isCompleted)
      .reduce((acc, task) => {
        const day = format(new Date(task.updatedAt), 'EEEE', { locale: vi });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const bestDay = Object.entries(dayCompletions)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Chưa có dữ liệu';
    
    // Weekly data for charts
    const weeklyData = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
      const dayTasks = tasksInRange.filter(task => {
        const taskDay = new Date(task.createdAt).getDay();
        const mappedDay = taskDay === 0 ? 6 : taskDay - 1; // Convert Sunday=0 to Sunday=6
        return mappedDay === index;
      });
      
      return {
        day,
        created: dayTasks.length,
        completed: dayTasks.filter(task => task.isCompleted).length
      };
    });
    
    // List distribution - tính phần trăm hoàn thành theo từng list
    const listDistribution = state.userLists.map(list => {
      const listTasks = activeTasks.filter(task => task.listId === list.id);
      const completedTasks = listTasks.filter(task => task.isCompleted);
      
      return {
        listName: list.name,
        taskCount: listTasks.length,
        completedCount: completedTasks.length,
        percentage: listTasks.length > 0 ? Math.round((completedTasks.length / listTasks.length) * 100) : 0,
        color: list.color
      };
    }).filter(item => item.taskCount > 0);
    
    // Priority distribution - đảm bảo luôn có đủ 3 cấp độ
    const priorityCounts = activeTasks.reduce((acc, task) => {
      const priority = task.priority || 'normal';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Đảm bảo có đủ 3 cấp độ ưu tiên
    const allPriorities = ['urgent', 'important', 'normal'];
    allPriorities.forEach(priority => {
      if (!priorityCounts[priority]) {
        priorityCounts[priority] = 0;
      }
    });
    
    const totalTasks = activeTasks.length;
    const priorityDistribution = allPriorities.map(priority => ({
      priority: priority === 'urgent' ? 'Khẩn cấp' : 
                priority === 'important' ? 'Quan trọng' : 'Thông thường',
      count: priorityCounts[priority],
      percentage: totalTasks > 0 ? Math.round((priorityCounts[priority] / totalTasks) * 100) : 0
    }));
    
    // Activity heatmap (simplified)
    const timeSlots = ['Sáng', 'Trưa', 'Chiều', 'Tối'];
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const activityHeatmap = timeSlots.flatMap((time, timeIndex) => 
      dayNames.map((day, dayIndex) => {
        // Calculate activity based on completed tasks in this time slot and day
        const completedInSlot = activeTasks.filter(task => {
          if (!task.isCompleted || !task.updatedAt) return false;
          
          const taskDate = new Date(task.updatedAt);
          const taskDay = taskDate.getDay();
          const mappedDay = taskDay === 0 ? 6 : taskDay - 1;
          const taskHour = taskDate.getHours();
          
          // Map hours to time slots
          let slotIndex = 0;
          if (taskHour >= 6 && taskHour < 12) slotIndex = 0; // Sáng
          else if (taskHour >= 12 && taskHour < 14) slotIndex = 1; // Trưa
          else if (taskHour >= 14 && taskHour < 18) slotIndex = 2; // Chiều
          else slotIndex = 3; // Tối
          
          return mappedDay === dayIndex && slotIndex === timeIndex;
        }).length;
        
        return {
          day,
          time,
          count: completedInSlot
        };
      })
    );
    
    return {
      tasksCreated,
      tasksCompleted,
      completionRate,
      bestDay,
      weeklyData,
      listDistribution,
      priorityDistribution,
      activityHeatmap,
      currentStreak: state.streak,
      bestStreak: state.bestStreak
    };
  }, [state.tasks, state.userLists, state.streak, state.bestStreak, timeFilter]);
}