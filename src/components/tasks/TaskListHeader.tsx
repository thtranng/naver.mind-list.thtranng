import React from 'react';
import { QuickFilterBar } from './QuickFilterBar';
import { useApp } from '@/contexts/AppContext';
import { List, Star, Calendar, CheckCircle, BookOpen, Music, Briefcase, Heart } from 'lucide-react';

export function TaskListHeader() {
  const { state } = useApp();

  // Get the current selected list information
  const getSelectedListInfo = () => {
    if (!state.selectedListId || state.selectedListId === 'all') {
      return {
        name: 'All',
        icon: List,
        color: '#3B82F6'
      };
    }

    // Check system lists
    const systemLists = {
      'important': { name: 'Important', icon: Star, color: '#F59E0B' },
      'today': { name: 'Today', icon: Calendar, color: '#10B981' },
      'completed': { name: 'Completed', icon: CheckCircle, color: '#6B7280' }
    };

    if (systemLists[state.selectedListId as keyof typeof systemLists]) {
      return systemLists[state.selectedListId as keyof typeof systemLists];
    }

    // Check user lists
    const userList = state.userLists.find(list => list.id === state.selectedListId);
    if (userList) {
      const iconMap = {
        BookOpen,
        Music, 
        Briefcase,
        Heart,
        List,
      };
      const IconComponent = iconMap[userList.icon as keyof typeof iconMap] || List;
      
      return {
        name: userList.name,
        icon: IconComponent,
        color: userList.color
      };
    }

    // Fallback
    return {
      name: 'Danh sách',
      icon: List,
      color: '#3B82F6'
    };
  };

  const selectedListInfo = getSelectedListInfo();
  const IconComponent = selectedListInfo.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${selectedListInfo.color}20` }}
        >
          <IconComponent 
            size={20} 
            style={{ color: selectedListInfo.color }}
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedListInfo.name}
        </h2>
      </div>
      <QuickFilterBar />
    </div>
  );
}