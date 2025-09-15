import React, { useState } from 'react';
import { Trash2, RotateCcw, AlertTriangle, Calendar, Flag } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { RecentlyDeletedItem, Task, UserList } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export function RecentlyDeleted() {
  const { state, dispatch } = useApp();
  const [showEmptyTrashDialog, setShowEmptyTrashDialog] = useState(false);

  const handleRestore = (item: RecentlyDeletedItem) => {
    if (item.type === 'task') {
      const task = item.originalItem as Task;
      // Khôi phục task
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id: task.id, updates: { isDeleted: false } }
      });
    } else {
      const list = item.originalItem as UserList;
      // Khôi phục list
      dispatch({
        type: 'UPDATE_USER_LIST',
        payload: { id: list.id, updates: { isDeleted: false } }
      });
    }

    // Xóa khỏi recently deleted
    dispatch({
      type: 'REMOVE_FROM_RECENTLY_DELETED',
      payload: item.id
    });
  };

  const handlePermanentDelete = (item: RecentlyDeletedItem) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Hành động này không thể hoàn tác.')) {
      if (item.type === 'task') {
        dispatch({ type: 'DELETE_TASK_PERMANENTLY', payload: item.originalItem.id });
      } else {
        dispatch({ type: 'DELETE_LIST_PERMANENTLY', payload: item.originalItem.id });
      }
      
      // Xóa khỏi recently deleted
      dispatch({ 
        type: 'REMOVE_FROM_RECENTLY_DELETED', 
        payload: item.id 
      });
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Bạn có chắc chắn muốn dọn sạch thùng rác? Tất cả các mục sẽ bị xóa vĩnh viễn và không thể khôi phục.')) {
      // Xóa vĩnh viễn tất cả tasks và lists
      state.recentlyDeleted.forEach(item => {
        if (item.type === 'task') {
          dispatch({ type: 'DELETE_TASK_PERMANENTLY', payload: item.originalItem.id });
        } else {
          dispatch({ type: 'DELETE_LIST_PERMANENTLY', payload: item.originalItem.id });
        }
      });
      
      // Xóa sạch recently deleted
      dispatch({ type: 'EMPTY_RECENTLY_DELETED' });
      setShowEmptyTrashDialog(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'important': return 'text-orange-500';
      case 'none': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp';
      case 'important': return 'Quan trọng';
      case 'none': return 'Bình thường';
      default: return 'Bình thường';
    }
  };

  const getListName = (listId: string) => {
    const list = state.userLists.find(l => l.id === listId);
    return list?.name || 'Danh sách không xác định';
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-red-600" />
            Thùng rác
          </h1>
          <p className="text-gray-600 mt-2">
            Các mục đã xóa sẽ được tự động xóa vĩnh viễn sau 30 ngày
          </p>
        </div>
        
        {state.recentlyDeleted.length > 0 && (
          <button
            onClick={() => setShowEmptyTrashDialog(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Dọn sạch Thùng rác
          </button>
        )}
      </div>

      {state.recentlyDeleted.length === 0 ? (
        <div className="text-center py-12">
          <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Thùng rác trống
          </h3>
          <p className="text-gray-500">
            Các mục bạn xóa sẽ xuất hiện ở đây
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.recentlyDeleted.map((item) => {
            const isTask = item.type === 'task';
            const originalItem = item.originalItem;
            
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {isTask ? '📋 Công việc' : '📁 Danh sách'}
                      </span>
                      <h3 className="font-medium text-gray-900">
                        {isTask ? (originalItem as Task).title : (originalItem as UserList).name}
                      </h3>
                    </div>
                    
                    {isTask && (originalItem as Task).note && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {(originalItem as Task).note}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        Xóa {formatDistanceToNow(new Date(item.deletedAt), { 
                          addSuffix: true, 
                          locale: vi 
                        })}
                      </span>
                      
                      {isTask && (
                        <>
                          <span className="flex items-center gap-1">
                            📋 {getListName((originalItem as Task).listId)}
                          </span>
                          
                          <span className={`flex items-center gap-1 ${getPriorityColor((originalItem as Task).priority)}`}>
                            <Flag className="w-3 h-3" />
                            {getPriorityLabel((originalItem as Task).priority)}
                          </span>
                          
                          {(originalItem as Task).dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date((originalItem as Task).dueDate!).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleRestore(item)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Khôi phục"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handlePermanentDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Empty Trash Confirmation Dialog */}
      {showEmptyTrashDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Dọn sạch Thùng rác
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa vĩnh viễn tất cả {state.recentlyDeleted.length} mục trong thùng rác? 
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEmptyTrashDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleEmptyTrash}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}