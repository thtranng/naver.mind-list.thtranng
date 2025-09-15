import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { addTestRecurringTasks, removeTestRecurringTasks } from '@/utils/calendarTestData';

export function CalendarTestButton() {
  const { dispatch } = useApp();

  const handleAddTestData = () => {
    try {
      const testTasks = addTestRecurringTasks();
      
      // Reload tasks from localStorage
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      dispatch({ type: 'SET_TASKS', payload: allTasks });
      
      alert(`✅ Đã thêm ${testTasks.length} test recurring tasks!\n📅 Chuyển sang Calendar view để xem kết quả.`);
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('❌ Lỗi khi thêm test data');
    }
  };

  const handleRemoveTestData = () => {
    try {
      removeTestRecurringTasks();
      
      // Reload tasks from localStorage
      const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      dispatch({ type: 'SET_TASKS', payload: allTasks });
      
      alert('🗑️ Đã xóa test recurring tasks!');
    } catch (error) {
      console.error('Error removing test data:', error);
      alert('❌ Lỗi khi xóa test data');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={handleAddTestData}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors text-sm"
      >
        ➕ Add Test Recurring Tasks
      </button>
      <button
        onClick={handleRemoveTestData}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors text-sm"
      >
        🗑️ Remove Test Tasks
      </button>
    </div>
  );
}