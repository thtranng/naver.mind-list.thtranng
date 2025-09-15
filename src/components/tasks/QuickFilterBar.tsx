import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { List, Star, Calendar, CheckCircle } from 'lucide-react';

export function QuickFilterBar() {
  const { state, dispatch } = useApp();

  const filters = [
    { 
      id: 'all', 
      label: 'All', 
      icon: List,
      count: state.tasks.filter(t => !t.isCompleted).length 
    },
    { 
      id: 'important', 
      label: 'Important', 
      icon: Star,
      count: state.tasks.filter(t => (t.priority === 'important' || t.priority === 'urgent') && !t.isCompleted).length 
    },
    { 
      id: 'today', 
      label: 'Today', 
      icon: Calendar,
      count: state.tasks.filter(t => {
        const today = new Date().toDateString();
        return t.dueDate && new Date(t.dueDate).toDateString() === today && !t.isCompleted;
      }).length 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: CheckCircle,
      count: state.tasks.filter(t => t.isCompleted).length 
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {filters.map(filter => {
        const isActive = state.selectedListId === filter.id;
        
        const IconComponent = filter.icon;
        
        return (
          <button
            key={filter.id}
            onClick={() => dispatch({ type: 'SET_SELECTED_LIST', payload: filter.id })}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              flex items-center gap-2
              ${isActive
                ? 'bg-mind-list-primary-blue text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <IconComponent className="h-4 w-4" />
            <span>{filter.label}</span>
            <span className={`
              text-xs px-2 py-0.5 rounded-full font-semibold
              ${isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}