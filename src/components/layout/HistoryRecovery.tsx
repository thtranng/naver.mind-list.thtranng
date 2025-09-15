import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function HistoryRecovery() {
  const { dispatch } = useApp();

  const handleRecentlyEditedClick = () => {
    dispatch({ type: 'SET_VIEW', payload: 'recently-edited' });
  };

  const handleRecentlyDeletedClick = () => {
    dispatch({ type: 'SET_VIEW', payload: 'recently-deleted' });
  };

  return (
    <div className="space-y-2">
      <button 
        onClick={handleRecentlyEditedClick}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
      >
        <RotateCcw size={16} className="text-gray-600" />
        <span className="font-medium text-gray-900">Recently Edited</span>
      </button>
      
      <button 
        onClick={handleRecentlyDeletedClick}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
      >
        <Trash2 size={16} className="text-gray-600" />
        <span className="font-medium text-gray-900">Recently Deleted</span>
      </button>
    </div>
  );
}