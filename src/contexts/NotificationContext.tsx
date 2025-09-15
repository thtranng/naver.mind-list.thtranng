import React, { createContext, useContext, useState } from 'react';

interface NotificationSettings {
  task_assigned: boolean;
  task_completed_by_assignee: boolean;
  task_comment: boolean;
  task_deadline_reminder: boolean;
  system_updates: boolean;
}

interface NotificationContextType {
  isNotificationEnabled: (settingId: string) => boolean;
  updateNotificationSetting: (settingId: string, enabled: boolean) => void;
  settings: NotificationSettings;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>({
    task_assigned: true,
    task_completed_by_assignee: true,
    task_comment: true,
    task_deadline_reminder: true,
    system_updates: true,
  });

  const isNotificationEnabled = (settingId: string): boolean => {
    return settings[settingId as keyof NotificationSettings] ?? true;
  };

  const updateNotificationSetting = (settingId: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: enabled,
    }));
  };

  return (
    <NotificationContext.Provider value={{ isNotificationEnabled, updateNotificationSetting, settings }}>
      {children}
    </NotificationContext.Provider>
  );
}