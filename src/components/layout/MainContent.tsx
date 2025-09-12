import React from 'react';
import { useAppStore } from '../../store/appStore';
import ListView from '../views/ListView';
import CalendarView from '../views/CalendarView';
import AnalyticsView from '../views/AnalyticsView';

const MainContent: React.FC = () => {
  const { activeView } = useAppStore();

  const renderView = () => {
    switch (activeView) {
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <ListView />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto grid-background">
      {renderView()}
    </main>
  );
};

export default MainContent;