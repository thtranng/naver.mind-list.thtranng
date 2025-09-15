import React, { useState } from 'react';
import { ChevronRight, ChevronDown, List, Star, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function SystemLists() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { state, dispatch } = useApp();

  const systemLists = [
    { id: 'all', name: 'All', icon: List, count: state.tasks.filter(t => !t.isCompleted).length },
    { id: 'important', name: 'Important', icon: Star, count: state.tasks.filter(t => (t.priority === 'important' || t.priority === 'urgent') && !t.isCompleted).length },
    { id: 'today', name: 'Today', icon: Calendar, count: state.tasks.filter(t => {
      const today = new Date().toDateString();
      return t.dueDate && new Date(t.dueDate).toDateString() === today && !t.isCompleted;
    }).length },
    { id: 'completed', name: 'Completed', icon: CheckCircle, count: state.tasks.filter(t => t.isCompleted).length },
  ];

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <List size={16} className="text-gray-600" />
          <span className="font-medium text-gray-900">System Lists</span>
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {isExpanded && (
        <div className="ml-6 space-y-1">
          {systemLists.map((list) => {
            const Icon = list.icon;
            const isActive = state.selectedListId === list.id;
            
            return (
              <button
                key={list.id}
                onClick={() => {
                  dispatch({ type: 'SET_SELECTED_LIST', payload: list.id });
                  dispatch({ type: 'SET_VIEW', payload: 'list' });
                }}
                className={`
                  w-full flex items-center justify-between p-2 rounded-lg text-sm
                  ${isActive 
                    ? 'bg-mind-list-primary-blue-light text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={14} />
                  <span>{list.name}</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {list.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}