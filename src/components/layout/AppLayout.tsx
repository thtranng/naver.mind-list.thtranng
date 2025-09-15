import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { useApp } from '@/contexts/AppContext';
import AchievementNotificationContainer from '../gamification/AchievementNotification';

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state } = useApp();

  // Ẩn sidebar khi ở Calendar, Analytics hoặc Settings view
  const shouldHideSidebar = state.currentView === 'calendar' || state.currentView === 'analytics' || state.currentView === 'settings';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex h-[calc(100vh-60px)]">
        {!shouldHideSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        )}
        
        <MainContent />
      </div>
      
      {/* Achievement Notifications */}
      <AchievementNotificationContainer />
    </div>
  );
}