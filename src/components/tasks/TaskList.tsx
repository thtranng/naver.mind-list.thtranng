import React from 'react';
import { TaskItem } from './TaskItem';
import { useApp } from '@/contexts/AppContext';
import { useTaskFilter } from '@/hooks/useTaskFilter';
import { ClipboardList, Plus } from 'lucide-react';

interface TaskListProps {
  searchQuery?: string;
}

export function TaskList({ searchQuery = '' }: TaskListProps) {
  const { state } = useApp();

  // First filter by list/category and exclude deleted tasks
  const listFilteredTasks = state.tasks.filter(task => {
    // Filter out soft deleted tasks
    if (task.isDeleted) return false;
    
    if (state.selectedListId === 'all') return true;
    if (state.selectedListId === 'important') return task.priority === 'important' || task.priority === 'urgent';
    if (state.selectedListId === 'today') {
      const today = new Date().toDateString();
      return task.dueDate && new Date(task.dueDate).toDateString() === today;
    }
    if (state.selectedListId === 'completed') return task.isCompleted;
    return task.listId === state.selectedListId;
  });

  // Then apply search filter
  const { filteredTasks } = useTaskFilter(listFilteredTasks);
  
  // Use search query from props if provided, otherwise use internal filter
  const finalTasks = searchQuery ? 
    listFilteredTasks.filter(task => {
      const query = searchQuery.toLowerCase().trim();
      return task.title.toLowerCase().includes(query) ||
             (task.note && task.note.toLowerCase().includes(query)) ||
             (task.subTasks && task.subTasks.some(subTask => 
               subTask.title.toLowerCase().includes(query)
             ));
    }) : filteredTasks;

  // Sort tasks by due date - earliest first, then tasks without due date
  const sortTasksByDueDate = (tasks: typeof finalTasks) => {
    return tasks.sort((a, b) => {
      // If both have due dates, sort by date (earliest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Tasks with due dates come before tasks without due dates
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      // If neither has due date, maintain original order
      return 0;
    });
  };

  const incompleteTasks = sortTasksByDueDate(finalTasks.filter(task => !task.isCompleted));
  const completedTasks = sortTasksByDueDate(finalTasks.filter(task => task.isCompleted));

  // Check if we're searching and have no results
  const isSearching = searchQuery.trim().length > 0;
  const hasNoResults = isSearching && finalTasks.length === 0;
  const hasNoTasks = !isSearching && finalTasks.length === 0;

  if (hasNoResults) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy kết quả</h3>
        <p className="text-gray-500">Không có công việc nào khớp với từ khóa "{searchQuery}"</p>
      </div>
    );
  }

  // Welcome screen when no tasks exist
  if (hasNoTasks) {
    return (
      <div className="text-center py-16 px-6">
        <div className="mb-6">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <ClipboardList size={64} className="text-blue-200 mx-auto" />
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2">
              <Plus size={16} className="text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Chào mừng đến với Mind List!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          Mọi công việc bạn tạo sẽ xuất hiện ở đây. Hãy nhấn vào nút "+ Thêm công việc" ở sidebar để bắt đầu.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
          <Plus size={16} />
          <span className="text-sm font-medium">Tạo công việc đầu tiên của bạn</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      {incompleteTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
      
      {completedTasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Completed</h3>
          {completedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}