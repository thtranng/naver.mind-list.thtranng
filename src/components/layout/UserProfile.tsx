import React, { useState } from 'react';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { User } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface UserProfileProps {
  user: User | null;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { dispatch } = useApp();

  if (!user) return null;

  const handleSettingsClick = () => {
    dispatch({ type: 'SET_VIEW', payload: 'settings' });
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserIcon className="w-4 h-4 text-white" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          
          <button 
            onClick={handleSettingsClick}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
          >
            <Settings size={16} />
            Cài đặt
          </button>
          
          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      )}
      
      {/* Overlay to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}