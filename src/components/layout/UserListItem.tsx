import React from 'react';
import { BookOpen, Music, Briefcase, Heart, List } from 'lucide-react';
import {
  BookOpen24Regular,
  MusicNote124Regular,
  Briefcase24Regular,
  Heart24Regular,
  List24Regular,
  Home24Regular,
  Calendar24Regular,
  Star24Regular,
  Flag24Regular,
  Target24Regular,
  Trophy24Regular,
  Lightbulb24Regular,
  Camera24Regular,
  Gift24Regular,
  Airplane24Regular,
  Circle24Regular,
  Food24Regular,
  Games24Regular,
  ShoppingBag24Regular,
  Sport24Regular
} from '@fluentui/react-icons';
import { UserList } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ContextMenuTrigger } from './ContextMenu';

interface UserListItemProps {
  list: UserList;
}

// Lucide icons fallback
const lucideIconMap = {
  BookOpen,
  Music, 
  Briefcase,
  Heart,
  List,
};

// Fluent UI icons mapping
const fluentIconMap = {
  BookOpen24Regular,
  MusicNote124Regular,
  Briefcase24Regular,
  Heart24Regular,
  List24Regular,
  Home24Regular,
  Calendar24Regular,
  Star24Regular,
  Flag24Regular,
  Target24Regular,
  Trophy24Regular,
  Lightbulb24Regular,
  Camera24Regular,
  Gift24Regular,
  Airplane24Regular,
  Circle24Regular,
  Food24Regular,
  Games24Regular,
  ShoppingBag24Regular,
  Sport24Regular
};

export function UserListItem({ list }: UserListItemProps) {
  const { state, dispatch } = useApp();
  
  // Use Fluent UI icon if iconName is available, otherwise fallback to Lucide icon
  const getIconComponent = () => {
    if (list.iconName && fluentIconMap[list.iconName as keyof typeof fluentIconMap]) {
      return fluentIconMap[list.iconName as keyof typeof fluentIconMap];
    }
    return lucideIconMap[list.icon as keyof typeof lucideIconMap] || List;
  };
  
  const IconComponent = getIconComponent();
  const isActive = state.selectedListId === list.id;
  
  // Calculate actual incomplete task count (excluding deleted tasks)
  const incompleteTaskCount = state.tasks.filter(task => 
    task.listId === list.id && !task.isCompleted && !task.isDeleted
  ).length;

  return (
    <div 
      className={`
        list-item group relative p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between
        ${isActive 
          ? 'active' 
          : 'hover:bg-gray-50'
        }
      `}
      style={{
        '--list-color': list.color,
        backgroundColor: isActive ? `${list.color}20` : undefined
      } as React.CSSProperties}
      onClick={() => dispatch({ type: 'SET_SELECTED_LIST', payload: list.id })}
    >
      <div className="flex items-center gap-3 flex-1">
        <IconComponent size={16} className="list-item-icon" style={{ color: list.color }} />
        <span className="text-sm font-medium text-gray-900">{list.name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full min-w-[24px] text-center">
          {incompleteTaskCount}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ContextMenuTrigger list={list} />
        </div>
      </div>
    </div>
  );
}