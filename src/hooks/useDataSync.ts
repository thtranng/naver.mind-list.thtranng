import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

/**
 * Hook để đồng bộ dữ liệu app với localStorage và cloud storage
 */
export function useDataSync() {
  const { isCloudSyncEnabled, syncToCloud } = useAuth();
  const { user, goals, tasks, settings } = useApp();

  // Lưu dữ liệu vào localStorage
  const saveToLocalStorage = useCallback(() => {
    const appData = {
      user,
      goals,
      tasks,
      settings,
      lastSyncTime: new Date().toISOString(),
      version: '1.0.0'
    };

    try {
      localStorage.setItem('mindlist_app_data', JSON.stringify(appData));
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, [user, goals, tasks, settings]);

  // Tự động lưu khi dữ liệu thay đổi
  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  // Tự động sync lên cloud nếu được bật
  useEffect(() => {
    if (isCloudSyncEnabled && (user || goals?.length || tasks?.length)) {
      const debounceTimer = setTimeout(() => {
        syncToCloud().catch(error => {
          console.error('Auto cloud sync failed:', error);
        });
      }, 5000); // Debounce 5 giây để tránh sync quá nhiều

      return () => clearTimeout(debounceTimer);
    }
  }, [isCloudSyncEnabled, user, goals, tasks, settings, syncToCloud]);

  return {
    saveToLocalStorage
  };
}

/**
 * Khôi phục dữ liệu từ localStorage
 */
export function restoreFromLocalStorage() {
  try {
    const dataStr = localStorage.getItem('mindlist_app_data');
    if (dataStr) {
      const data = JSON.parse(dataStr);
      return {
        success: true,
        data
      };
    }
    return {
      success: false,
      message: 'No data found in localStorage'
    };
  } catch (error) {
    console.error('Failed to restore data from localStorage:', error);
    return {
      success: false,
      message: 'Failed to parse localStorage data'
    };
  }
}

/**
 * Xóa dữ liệu khỏi localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem('mindlist_app_data');
    return {
      success: true,
      message: 'Local data cleared successfully'
    };
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return {
      success: false,
      message: 'Failed to clear local data'
    };
  }
}