import React from 'react';
import { ListView } from '../views/ListView';
import { CalendarView } from '../views/CalendarView';
import { AnalyticsView } from '../views/AnalyticsView';
import { RecentlyEdited } from '../views/RecentlyEditedView';
import { RecentlyDeleted } from '../views/RecentlyDeleted';
import Settings from '../../pages/Settings';
import { useApp } from '@/contexts/AppContext';

export function MainContent() {
  const { state } = useApp();

  const renderView = () => {
    switch (state.currentView) {
      case 'list':
        return <ListView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <Settings />;
      case 'recently-edited':
        return <RecentlyEdited />;
      case 'recently-deleted':
        return <RecentlyDeleted />;
      default:
        return <ListView />;
    }
  };

  return (
    <main className="flex-1 overflow-hidden">
      {renderView()}
    </main>
  );
}