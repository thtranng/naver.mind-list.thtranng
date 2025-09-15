import React from 'react';
import { BookOpen, Music, Briefcase, Heart, List, Pin } from 'lucide-react';
import { UserList } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ContextMenuTrigger } from './ContextMenu';

interface ListCardProps {
  list: UserList;
}

const iconMap = {
  BookOpen,
  Music,
  Briefcase,
  Heart,
  List,
};

export function ListCard({ list }: ListCardProps) {
  const { state, dispatch } = useApp();
  const IconComponent = iconMap[list.icon as keyof typeof iconMap] || List;
  const isActive = state.selectedListId === list.id;

  // Calculate actual incomplete task count (excluding deleted tasks)
  const incompleteTaskCount = state.tasks.filter(task => 
    task.listId === list.id && !task.isCompleted && !task.isDeleted
  ).length;

  const handleClick = () => {
    dispatch({ type: 'SET_SELECTED_LIST', payload: list.id });
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`
          w-full p-4 rounded-lg border transition-all duration-200 text-left
          ${isActive 
            ? 'border-mind-list-primary-blue bg-mind-list-primary-blue-light shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          }
        `}
      >
        <div className="flex justify-between items-start mb-3">
          {/* Top-left: List Icon */}
          <div className={`
            p-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-mind-list-primary-blue text-white' 
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            <IconComponent size={16} style={{ color: isActive ? 'white' : list.color }} />
          </div>
          
          {/* Top-right: Task Count */}
           <div className={`
             px-2 py-1 rounded-full text-xs font-medium min-w-[24px] text-center
             ${isActive 
               ? 'bg-white text-mind-list-primary-blue' 
               : 'bg-gray-100 text-gray-600'
             }
           `}>
             {incompleteTaskCount}
           </div>
        </div>
        
        <div className="flex justify-between items-end">
          {/* Bottom-left: List Name */}
          <span className={`
            text-sm font-medium truncate flex-1 mr-2
            ${isActive ? 'text-mind-list-primary-blue' : 'text-gray-900'}
          `}>
            {list.name}
          </span>
          
          {/* Bottom-right: Pin Icon */}
          <Pin 
            size={14} 
            className={`
              flex-shrink-0
              ${isActive ? 'text-mind-list-primary-blue' : 'text-gray-400'}
            `} 
          />
        </div>
      </button>
      
      {/* Context Menu Trigger */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ContextMenuTrigger list={list} />
      </div>
    </div>
  );
}