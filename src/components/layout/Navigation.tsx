import React from 'react';
import { List, Calendar, BarChart3 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ViewMode } from '@/types';

export function Navigation() {
  const { state, dispatch } = useApp();
  const { t } = useLanguage();

  const handleViewChange = (view: ViewMode) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const navItems = [
    { id: 'list' as ViewMode, label: t('nav.list'), icon: List },
    { id: 'calendar' as ViewMode, label: t('nav.calendar'), icon: Calendar },
    { id: 'analytics' as ViewMode, label: t('nav.analytics'), icon: BarChart3 },
  ];

  return (
    <div className="flex items-center gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = state.currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => handleViewChange(item.id)}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all duration-200 transform hover:scale-105 hover:shadow-lg
              ${isActive 
                ? 'bg-white/20 text-white scale-105' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Icon size={20} className="transition-transform duration-200 hover:scale-110 font-bold" strokeWidth={2.5} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}