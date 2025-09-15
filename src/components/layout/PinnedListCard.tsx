import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pin } from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import { useApp } from '@/contexts/AppContext';
import { UserList } from '@/types';
import * as Icons from 'lucide-react';
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
  Document24Regular,
  Folder24Regular,
  Mail24Regular,
  Phone24Regular,
  Clock24Regular,
  Water24Regular,
  Sport24Regular,
  VehicleBus24Regular,
  Building24Regular,
  Planet24Regular,
  AnimalCat24Regular,
  Emoji24Regular,
  Patient24Regular,
  Code24Regular,
  Calculator24Regular,
  Globe24Regular,
  Shield24Regular
} from '@fluentui/react-icons';

interface PinnedListCardProps {
  listData: UserList;
}

// Icon mapping for dynamic icon rendering (Lucide icons)
const lucideIconMap: { [key: string]: React.ComponentType<any> } = {
  BookOpen: Icons.BookOpen,
  Briefcase: Icons.Briefcase,
  Heart: Icons.Heart,
  Home: Icons.Home,
  Star: Icons.Star,
  Calendar: Icons.Calendar,
  Coffee: Icons.Coffee,
  Music: Icons.Music,
  Camera: Icons.Camera,
  Gamepad2: Icons.Gamepad2,
  List: Icons.List,
  PushPin: Icons.Pin,
  ShoppingCart: Icons.ShoppingCart,
  Dumbbell: Icons.Dumbbell
};

// Fluent UI icon mapping
const fluentIconMap: { [key: string]: React.ComponentType<any> } = {
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
  Document24Regular,
  Folder24Regular,
  Mail24Regular,
  Phone24Regular,
  Clock24Regular,
  Water24Regular,
  Sport24Regular,
  VehicleBus24Regular,
  Building24Regular,
  Planet24Regular,
  AnimalCat24Regular,
  Emoji24Regular,
  Patient24Regular,
  Code24Regular,
  Calculator24Regular,
  Globe24Regular,
  Shield24Regular
};

// Function to get the appropriate icon component
const getIconComponent = (iconName: string) => {
  // First try Fluent UI icons
  if (fluentIconMap[iconName]) {
    return fluentIconMap[iconName];
  }
  // Fallback to Lucide icons
  if (lucideIconMap[iconName]) {
    return lucideIconMap[iconName];
  }
  // Default fallback
  return Icons.List;
};

export function PinnedListCard({ listData }: PinnedListCardProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Calculate task count (only incomplete tasks)
  const taskCount = state.tasks.filter(
    task => task.listId === listData.id && !task.isCompleted
  ).length;

  const handleClick = () => {
    dispatch({ type: 'SET_SELECTED_LIST', payload: listData.id });
    navigate('/');
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        id: listData.id,
        updates: { isPinned: !listData.isPinned }
      }
    });
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu(!showContextMenu);
  };

  const IconComponent = getIconComponent(listData.icon);

  return (
    <div className="relative list-item group">
      {/* Main Card - Horizontal Layout */}
      <div
        className={`w-full flex items-center p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${
          state.selectedListId === listData.id ? 'border-blue-500' : ''
        }`}
        style={{ 
          backgroundColor: listData.color ? `${listData.color}10` : '#ffffff',
          borderColor: state.selectedListId === listData.id ? '#3B82F6' : (listData.color ? `${listData.color}40` : '#e5e7eb')
        }}
        onClick={handleClick}
      >
        {/* Left: Icon */}
        <div className="flex-shrink-0 mr-3">
          <IconComponent 
            size={16} 
            style={{ color: listData.color }}
          />
        </div>
        
        {/* Center: List Name */}
        <div className="flex-1 min-w-0 mr-3">
          <span className="text-sm font-medium text-gray-900 truncate block">
            {listData.name}
          </span>
        </div>
        
        {/* Right: Pin Icon */}
        <div className="flex-shrink-0 mr-2">
          <button
            onClick={handlePinClick}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={listData.isPinned ? 'Unpin list' : 'Pin list'}
          >
            <Pin 
              size={14} 
              className={`${
                listData.isPinned ? 'text-blue-500 fill-current' : 'text-gray-400'
              }`}
            />
          </button>
        </div>
        
        {/* Right: Task Count / More Options Container */}
        <div className="flex-shrink-0 relative w-8 h-8 flex items-center justify-center">
          {/* Task Count - Default visible */}
          <span 
            className="task-count absolute inset-0 flex items-center justify-center text-xs font-medium px-2 py-1 rounded-full transition-all duration-200 group-hover:opacity-0 group-hover:scale-95"
            style={{ 
              backgroundColor: listData.color + '20',
              color: listData.color 
            }}
          >
            {taskCount}
          </span>
          
          {/* More Options Icon - Hidden by default, shown on hover */}
          <button
            onClick={handleMoreClick}
            className="more-options-icon absolute inset-0 flex items-center justify-center p-1 hover:bg-gray-200 rounded transition-all duration-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
            title="More options"
          >
            <MoreHorizontal size={14} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <ContextMenu
          list={listData}
          onClose={() => setShowContextMenu(false)}
          position="bottom-right"
        />
      )}
    </div>
  );
}