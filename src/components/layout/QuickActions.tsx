import React from 'react';
import { Plus, List } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function QuickActions() {
  const { dispatch } = useApp();

  const handleAddList = () => {
    // Trigger showing the input field in UserLists
    dispatch({ type: 'SHOW_ADD_LIST_INPUT', payload: true });
  };

  return (
    <>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => dispatch({ type: 'SHOW_TASK_EDITOR', payload: true })}
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          >
            <Plus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-blue-700">Add task</span>
          </button>
          
          <button 
            onClick={handleAddList}
            className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
          >
            <List className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-green-700">Add list</span>
          </button>
        </div>
      </div>
    </>
  );
}