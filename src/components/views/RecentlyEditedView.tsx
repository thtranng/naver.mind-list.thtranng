import React from 'react';
import { Clock, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task, UserList } from '@/types';

interface RecentlyEditedItem {
  id: string;
  title?: string;
  name?: string;
  type: 'task' | 'list';
  listId?: string;
  updatedAt: Date;
  createdAt: Date;
}

export function RecentlyEdited() {
  const { state, dispatch } = useApp();

  // Get recently edited items (tasks and lists updated in last 24 hours)
  const getRecentlyEditedItems = (): RecentlyEditedItem[] => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recentTasks = state.tasks
      .filter(task => task.updatedAt > twentyFourHoursAgo)
      .map(task => ({
        id: task.id,
        title: task.title,
        type: 'task' as const,
        listId: task.listId,
        updatedAt: task.updatedAt,
        createdAt: task.createdAt
      }));

    const recentLists = state.userLists
      .filter(list => list.updatedAt > twentyFourHoursAgo)
      .map(list => ({
        id: list.id,
        name: list.name,
        type: 'list' as const,
        updatedAt: list.updatedAt,
        createdAt: list.createdAt
      }));

    return [...recentTasks, ...recentLists]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  };

  const recentlyEditedItems = getRecentlyEditedItems();

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const handleItemClick = (item: RecentlyEditedItem) => {
    if (item.type === 'list') {
      // Navigate to the list
      dispatch({ type: 'SET_SELECTED_LIST', payload: item.id });
      dispatch({ type: 'SET_VIEW', payload: 'list' });
    } else {
      // Navigate to the task's list
      const targetList = state.userLists.find(list => list.id === item.listId);
      if (targetList) {
        dispatch({ type: 'SET_SELECTED_LIST', payload: targetList.id });
        dispatch({ type: 'SET_VIEW', payload: 'list' });
      }
    }
  };

  const handleBackToList = () => {
    dispatch({ type: 'SET_VIEW', payload: 'list' });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa gần đây</h1>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {recentlyEditedItems.length === 0 ? (
              <div className="p-12 text-center">
                <Clock size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có mục nào được chỉnh sửa gần đây
                </h3>
                <p className="text-gray-500">
                  Các task và danh sách được chỉnh sửa trong 24 giờ qua sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentlyEditedItems.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {item.type === 'task' ? (
                          <FileText size={20} className="text-gray-600" />
                        ) : (
                          <Calendar size={20} className="text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.type === 'task' ? item.title : item.name}
                        </h3>
                        {item.type === 'task' && (
                          <p className="text-sm text-gray-500 mt-1">
                            trong {state.userLists.find(list => list.id === item.listId)?.name || 'All'}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Cập nhật {formatTimeAgo(item.updatedAt)}
                          </span>
                          <span>
                            {item.type === 'task' ? 'Công việc' : 'Danh sách'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Hiển thị các mục được chỉnh sửa trong 24 giờ qua
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}