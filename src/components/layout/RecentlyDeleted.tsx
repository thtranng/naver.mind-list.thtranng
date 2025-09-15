import React, { useState, useEffect } from 'react';
import { X, Trash2, RotateCcw, AlertTriangle, FileText, Calendar, Clock } from 'lucide-react';
import { Task, UserList, RecentlyDeletedItem } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface RecentlyDeletedProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecentlyDeleted({ isOpen, onClose }: RecentlyDeletedProps) {
  const { state, dispatch } = useApp();
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  
  const [deletedItems, setDeletedItems] = useState<RecentlyDeletedItem[]>([]);

  // Sync with global state
  useEffect(() => {
    if (state.recentlyDeleted) {
      setDeletedItems(state.recentlyDeleted);
    }
  }, [state.recentlyDeleted]);

  // Auto-delete items older than 30 days
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CLEANUP_OLD_DELETED_ITEMS' });
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, [dispatch]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const formatDaysUntilAutoDelete = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return 'Sẽ bị xóa hôm nay';
    if (diffInDays === 1) return 'Sẽ bị xóa vào ngày mai';
    return `Sẽ bị xóa sau ${diffInDays} ngày`;
  };

  const handleRestore = (item: RecentlyDeletedItem) => {
    dispatch({ type: 'RESTORE_FROM_RECENTLY_DELETED', payload: item.id });
  };

  const handlePermanentDelete = (itemId: string) => {
    dispatch({ type: 'PERMANENTLY_DELETE', payload: itemId });
    setShowConfirmDialog(null);
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL_RECENTLY_DELETED' });
    setShowConfirmDialog(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Trash2 size={18} className="text-gray-600" />
            Xóa gần đây
          </h2>
          <div className="flex items-center gap-2">
            {deletedItems.length > 0 && (
              <button
                onClick={() => setShowConfirmDialog('clear-all')}
                className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors"
              >
                Xóa tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)]">
          {deletedItems.length === 0 ? (
            <div className="p-8 text-center">
              <Trash2 size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Thùng rác trống</p>
              <p className="text-xs text-gray-400 mt-1">
                Các mục đã xóa sẽ xuất hiện ở đây
              </p>
            </div>
          ) : (
            <div className="p-2">
              {deletedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg mb-2 bg-gray-50"
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
                        {(item as unknown as Task).title}
                      </p>
                      {item.type === 'task' && item.originalLocation && (
                        <p className="text-xs text-gray-500 mt-1">
                          từ {item.originalLocation}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Xóa {formatTimeAgo(item.deletedAt)}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          new Date(item.deletedAt).getTime() + (30 * 24 * 60 * 60 * 1000) - Date.now() < 7 * 24 * 60 * 60 * 1000
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }`}>
                          <AlertTriangle size={12} />
                          {formatDaysUntilAutoDelete(new Date(item.deletedAt.getTime() + (30 * 24 * 60 * 60 * 1000)))}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleRestore(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <RotateCcw size={12} />
                      Khôi phục
                    </button>
                    <button
                      onClick={() => setShowConfirmDialog(item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={12} />
                      Xóa vĩnh viễn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Các mục sẽ tự động bị xóa vĩnh viễn sau 30 ngày
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa vĩnh viễn
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {showConfirmDialog === 'clear-all'
                ? 'Bạn có chắc chắn muốn xóa vĩnh viễn tất cả các mục trong thùng rác? Hành động này không thể hoàn tác.'
                : 'Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Hành động này không thể hoàn tác.'}
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (showConfirmDialog === 'clear-all') {
                    handleClearAll();
                  } else {
                    handlePermanentDelete(showConfirmDialog);
                  }
                }}
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