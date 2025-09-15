import React from 'react';
import { Settings } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function SettingsButton() {
  const { dispatch } = useApp();

  const handleClick = () => {
    dispatch({ type: 'SET_VIEW', payload: 'settings' });
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
    >
      <Settings size={16} className="text-gray-600" />
      <span className="font-medium text-gray-900">Cài đặt</span>
    </button>
  );
}