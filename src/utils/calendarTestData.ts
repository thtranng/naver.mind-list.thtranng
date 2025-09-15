// Test data for calendar recurring tasks
import { Task } from '@/types';

// Tạo task template với repeat settings để test trên calendar
export const createTestRecurringTask = (): Task => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0); // 6:00 AM
  
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 7); // 7 ngày từ hôm nay
  
  return {
    id: 'test-recurring-task-' + Date.now(),
    title: 'Dậy sớm (Test Recurring)',
    note: 'Task test để kiểm tra tính năng lặp lại trên calendar',
    isCompleted: false,
    dueDate: tomorrow,
    priority: 'important',
    listId: 'personal',
    createdAt: now,
    updatedAt: now,
    isTemplate: true,
    timeSettings: {
      time: '06:00',
      earlyReminder: '10min',
      repeat: 'daily',
      endRepeat: 'date',
      endRepeatDate: endDate,
      repeatSettings: {
        type: 'daily',
        interval: 1,
        endType: 'date',
        endDate: endDate,
        endCount: 7
      }
    }
  };
};

// Tạo task template cho weekdays
export const createWeekdaysTestTask = (): Task => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(8, 30, 0, 0); // 8:30 AM
  
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 14); // 2 tuần từ hôm nay
  
  return {
    id: 'test-weekdays-task-' + Date.now(),
    title: 'Họp team (Test Weekdays)',
    note: 'Task test cho các ngày trong tuần',
    isCompleted: false,
    dueDate: tomorrow,
    priority: 'urgent',
    listId: 'work',
    createdAt: now,
    updatedAt: now,
    isTemplate: true,
    timeSettings: {
      time: '08:30',
      earlyReminder: '30min',
      repeat: 'weekdays',
      endRepeat: 'date',
      endRepeatDate: endDate,
      repeatSettings: {
        type: 'weekdays',
        interval: 1,
        endType: 'date',
        endDate: endDate,
        endCount: 10
      }
    }
  };
};

// Function để thêm test data vào localStorage
export const addTestRecurringTasks = () => {
  const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  const testTasks = [
    createTestRecurringTask(),
    createWeekdaysTestTask()
  ];
  
  const updatedTasks = [...existingTasks, ...testTasks];
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  console.log('✅ Đã thêm test recurring tasks vào localStorage');
  console.log('📅 Kiểm tra Calendar view để xem recurring tasks');
  
  return testTasks;
};

// Function để xóa test data
export const removeTestRecurringTasks = () => {
  const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const filteredTasks = existingTasks.filter((task: Task) => 
    !task.title.includes('(Test Recurring)') && 
    !task.title.includes('(Test Weekdays)')
  );
  
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  console.log('🗑️ Đã xóa test recurring tasks khỏi localStorage');
};

// Auto-run để thêm test data khi import
if (typeof window !== 'undefined') {
  // Chỉ chạy trong browser environment
  console.log('🔧 Calendar Test Data loaded. Sử dụng addTestRecurringTasks() để thêm test data.');
}