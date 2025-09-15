// Auto Recurring Task Service
// Tự động tạo recurring tasks thực tế vào database

import { Task } from '@/types';
import { isSameDay, addDays, addWeeks, addMonths, addYears } from 'date-fns';

// Tự động tạo recurring tasks cho một khoảng thời gian
export const generateRecurringTasksForPeriod = (
  templateTasks: Task[],
  startDate: Date,
  endDate: Date
): Task[] => {
  const generatedTasks: Task[] = [];
  
  templateTasks.forEach(template => {
    if (!template.isTemplate || !template.timeSettings?.repeatSettings || 
        template.timeSettings.repeatSettings.type === 'never') {
      return;
    }
    
    const repeatSettings = template.timeSettings.repeatSettings;
    const templateDate = new Date(template.dueDate!);
    let currentDate = new Date(Math.max(templateDate.getTime(), startDate.getTime()));
    
    // Điều chỉnh currentDate về ngày bắt đầu hợp lệ cho pattern
    currentDate = adjustToValidStartDate(currentDate, templateDate, repeatSettings.type);
    
    let occurrenceCount = 0;
    const maxOccurrences = repeatSettings.endCount || 1000; // Giới hạn an toàn
    
    while (currentDate <= endDate && occurrenceCount < maxOccurrences) {
      // Kiểm tra end conditions
      if (repeatSettings.endType === 'date' && repeatSettings.endDate && 
          currentDate > new Date(repeatSettings.endDate)) {
        break;
      }
      
      if (repeatSettings.endType === 'count' && occurrenceCount >= (repeatSettings.endCount || 0)) {
        break;
      }
      
      // Tạo task cho ngày hiện tại
      const newTask: Task = {
        ...template,
        id: `${template.id}-${currentDate.toISOString().split('T')[0]}-${Date.now()}`,
        dueDate: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          templateDate.getHours(),
          templateDate.getMinutes()
        ),
        isTemplate: false,
        templateId: template.id,
        title: template.title,
        note: template.note ? `${template.note} (Tự động tạo)` : 'Task lặp lại tự động',
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false
      };
      
      generatedTasks.push(newTask);
      occurrenceCount++;
      
      // Tính ngày tiếp theo
      currentDate = calculateNextDate(currentDate, repeatSettings.type, repeatSettings.interval || 1);
    }
  });
  
  return generatedTasks;
};

// Điều chỉnh ngày bắt đầu để phù hợp với pattern
const adjustToValidStartDate = (date: Date, templateDate: Date, repeatType: string): Date => {
  const adjustedDate = new Date(date);
  
  switch (repeatType) {
    case 'weekdays':
      // Tìm ngày làm việc tiếp theo
      while (adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
      }
      break;
    case 'weekends':
      // Tìm cuối tuần tiếp theo
      while (adjustedDate.getDay() !== 0 && adjustedDate.getDay() !== 6) {
        adjustedDate.setDate(adjustedDate.getDate() + 1);
      }
      break;
    case 'weekly':
      // Điều chỉnh về cùng thứ với template
      const dayDiff = templateDate.getDay() - adjustedDate.getDay();
      if (dayDiff !== 0) {
        adjustedDate.setDate(adjustedDate.getDate() + (dayDiff > 0 ? dayDiff : dayDiff + 7));
      }
      break;
    case 'monthly':
      // Điều chỉnh về cùng ngày trong tháng với template
      adjustedDate.setDate(templateDate.getDate());
      if (adjustedDate < date) {
        adjustedDate.setMonth(adjustedDate.getMonth() + 1);
        adjustedDate.setDate(templateDate.getDate());
      }
      break;
    case 'yearly':
      // Điều chỉnh về cùng ngày/tháng với template
      adjustedDate.setMonth(templateDate.getMonth());
      adjustedDate.setDate(templateDate.getDate());
      if (adjustedDate < date) {
        adjustedDate.setFullYear(adjustedDate.getFullYear() + 1);
      }
      break;
  }
  
  return adjustedDate;
};

// Tính ngày tiếp theo dựa trên repeat pattern
const calculateNextDate = (currentDate: Date, repeatType: string, interval: number): Date => {
  const nextDate = new Date(currentDate);
  
  switch (repeatType) {
    case 'hourly':
      nextDate.setHours(nextDate.getHours() + interval);
      break;
    case 'daily':
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    case 'weekdays':
      // Tìm ngày làm việc tiếp theo
      do {
        nextDate.setDate(nextDate.getDate() + 1);
      } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
      break;
    case 'weekends':
      // Tìm cuối tuần tiếp theo
      do {
        nextDate.setDate(nextDate.getDate() + 1);
      } while (nextDate.getDay() !== 0 && nextDate.getDay() !== 6);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (7 * interval));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + interval);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
  }
  
  return nextDate;
};

// Tự động tạo recurring tasks cho tháng hiện tại và tháng tiếp theo
export const autoGenerateRecurringTasks = (allTasks: Task[]): Task[] => {
  const templateTasks = allTasks.filter(task => 
    task.isTemplate && 
    task.timeSettings?.repeatSettings && 
    task.timeSettings.repeatSettings.type !== 'never'
  );
  
  if (templateTasks.length === 0) {
    return [];
  }
  
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Đầu tháng hiện tại
  const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0); // Cuối tháng tiếp theo
  
  const generatedTasks = generateRecurringTasksForPeriod(templateTasks, startDate, endDate);
  
  // Lọc bỏ các tasks đã tồn tại
  const existingTaskIds = new Set(
    allTasks
      .filter(task => !task.isTemplate && task.templateId)
      .map(task => `${task.templateId}-${task.dueDate?.toISOString().split('T')[0]}`)
  );
  
  return generatedTasks.filter(task => {
    const taskKey = `${task.templateId}-${task.dueDate?.toISOString().split('T')[0]}`;
    return !existingTaskIds.has(taskKey);
  });
};

// Kiểm tra và tạo recurring tasks khi cần thiết
export const checkAndCreateRecurringTasks = (allTasks: Task[]): Task[] => {
  const newTasks = autoGenerateRecurringTasks(allTasks);
  
  if (newTasks.length > 0) {
    console.log(`🔄 Tự động tạo ${newTasks.length} recurring tasks mới`);
  }
  
  return newTasks;
};