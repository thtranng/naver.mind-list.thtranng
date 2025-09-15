import React, { useState } from 'react';
import { Trash2, RotateCcw, AlertTriangle, ArrowLeft, FileText, Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { RecentlyDeletedItem } from '@/types';

export function RecentlyDeletedView() {
  const { state, dispatch } = useApp();
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

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

  const formatDaysUntilAutoDelete = (deletedAt: Date): string => {
    const autoDeleteDate = new Date(deletedAt);
    autoDeleteDate.setDate(autoDeleteDate.getDate() + 30);
    
    const now = new Date();
    const diffInDays = Math.ceil((autoDeleteDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return 'Sẽ bị xóa hôm nay';
    if (diffInDays === 1) return 'Còn 1 ngày';
    return `Còn ${diffInDays} ngày`;
  };

  const handleRestore = (item: RecentlyDeletedItem) => {
    dispatch({ type: 'RESTORE_FROM_RECENTLY_DELETED', payload: item.id });
  };

  const handlePermanentDelete = (itemId: string) => {
    dispatch({ type: 'PERMANENTLY_DELETE', payload: itemId });
    setShowConfirmDialog(null);
  };

  const handleBackToList = () => {
    dispatch({ type: 'SET_VIEW', payload: 'list' });
  };

  const getDaysUntilAutoDelete = (deletedAt: Date): number => {
    const autoDeleteDate = new Date(deletedAt);
    autoDeleteDate.setDate(autoDeleteDate.getDate() + 30);
    
    const now = new Date();
    return Math.ceil((autoDeleteDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
              <Trash2 size={24} className="text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Đã xóa gần đây</h1>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {state.recentlyDeleted.length === 0 ? (
              <div className="p-12 text-center">
                <Trash2 size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thùng rác trống
                </h3>
                <p className="text-gray-500">
                  Các mục đã xóa sẽ hiển thị ở đây và tự động bị xóa vĩnh viễn sau 30 ngày
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {state.recentlyDeleted.map((item) => {
                  const daysUntilDelete = getDaysUntilAutoDelete(item.deletedAt);
                  const isUrgent = daysUntilDelete <= 7;
                  
                  return (
                    <div key={item.id} className="p-4">
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
                            {item.type === 'task' 
                              ? (item.originalItem as any).title 
                              : (item.originalItem as any).name
                            }
                          </h3>
                          {item.type === 'task' && item.originalLocation && (
                            <p className="text-sm text-gray-500 mt-1">
                              từ {state.userLists.find(list => list.id === item.originalLocation)?.name || 'All'}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Trash2 size={12} />
                              Xóa {formatTimeAgo(item.deletedAt)}
                            </span>
                            <span className={`flex items-center gap-1 ${
                              isUrgent 
                                ? 'text-red-500' 
                                : daysUntilDelete <= 14 
                                  ? 'text-orange-500'
                                  : 'text-gray-400'
                            }`}>
                              <AlertTriangle size={12} />
                              {formatDaysUntilAutoDelete(item.deletedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleRestore(item)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <RotateCcw size={14} />
                          Khôi phục
                        </button>
                        <button
                          onClick={() => setShowConfirmDialog(item.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={14} />
                          Xóa vĩnh viễn
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Các mục sẽ tự động bị xóa vĩnh viễn sau 30 ngày
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa vĩnh viễn
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa vĩnh viễn mục này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handlePermanentDelete(showConfirmDialog)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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