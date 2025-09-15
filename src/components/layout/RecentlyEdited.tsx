import React, { useState, useEffect } from 'react';
import { X, Clock, FileText, List, Calendar } from 'lucide-react';
import { Task, UserList } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface RecentlyEditedProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecentlyEditedTask {
  id: string;
  title: string;
  listName: string;
  editedAt: Date;
  type: 'task' | 'list';
}

export function RecentlyEdited({ isOpen, onClose }: RecentlyEditedProps) {
  const { state, dispatch } = useApp();
  const [recentlyEditedItems, setRecentlyEditedItems] = useState<((Task & { type: 'task' }) | (UserList & { type: 'list' }))[]>([]);

  useEffect(() => {
    // Combine tasks and lists, sort by updatedAt/createdAt
    const allItems = [
      ...state.tasks.map(task => ({ ...task, type: 'task' as const })),
      ...state.userLists.map(list => ({ ...list, type: 'list' as const, updatedAt: new Date() }))
    ];
    
    // Sort by most recently updated and take top 10
    const sortedItems = allItems
      .sort((a, b) => {
        const aDate = a.updatedAt || a.createdAt || new Date(0);
        const bDate = b.updatedAt || b.createdAt || new Date(0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, 10);
    
    setRecentlyEditedItems(sortedItems);
  }, [state.tasks, state.userLists]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const handleItemClick = (item: any) => {
    if (item.type === 'list') {
      // Navigate to the list
      dispatch({ type: 'SET_SELECTED_LIST', payload: item.id });
    } else {
      // Navigate to the task's list
      const targetList = state.userLists.find(list => list.id === item.listId);
      if (targetList) {
        dispatch({ type: 'SET_SELECTED_LIST', payload: targetList.id });
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-gray-600" />
            Chỉnh sửa gần đây
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {recentlyEditedItems.length === 0 ? (
            <div className="p-8 text-center">
              <Clock size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có mục nào được chỉnh sửa gần đây</p>
            </div>
          ) : (
            <div className="p-2">
              {recentlyEditedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.type === 'task' ? (
                        <FileText size={16} className="text-gray-600" />
                      ) : (
                        <Calendar size={16} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {item.type === 'task' ? item.title : item.name}
                      </p>
                      {item.type === 'task' && (
                        <p className="text-xs text-gray-500 mt-1">
                          trong {state.userLists.find(list => list.id === item.listId)?.name || 'All'}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {formatTimeAgo(item.updatedAt || item.createdAt || new Date())}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Hiển thị các mục được chỉnh sửa trong 24 giờ qua
          </p>
        </div>
      </div>
    </div>
  );
}