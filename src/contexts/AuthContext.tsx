import React, { createContext, useContext, useState, useEffect } from 'react';
import { cloudStorageService, CloudStorageResult } from '@/services/cloudStorageService';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isCloudSyncEnabled: boolean;
  setIsCloudSyncEnabled: (value: boolean) => void;
  cloudSyncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  syncToCloud: () => Promise<CloudStorageResult>;
  syncFromCloud: () => Promise<CloudStorageResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCloudSyncEnabled, setIsCloudSyncEnabled] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize cloud storage service
  useEffect(() => {
    const initializeCloudStorage = async () => {
      try {
        await cloudStorageService.initialize();
        
        // Check if user is already authenticated with Google
        if (cloudStorageService.isAuthenticated()) {
          setIsCloudSyncEnabled(true);
          
          // Get last sync status
          const statusResult = await cloudStorageService.getSyncStatus();
          if (statusResult.success && statusResult.data?.lastSyncTime) {
            setLastSyncTime(statusResult.data.lastSyncTime);
          }
        }
      } catch (error) {
        console.error('Failed to initialize cloud storage:', error);
      }
    };

    initializeCloudStorage();
  }, []);

  // Sync data to cloud
  const syncToCloud = async (): Promise<CloudStorageResult> => {
    if (!isCloudSyncEnabled) {
      return { success: false, message: 'Cloud sync is not enabled' };
    }

    setCloudSyncStatus('syncing');
    
    try {
      // Get current app state from localStorage or context
      const appDataStr = localStorage.getItem('mindlist_app_data');
      if (!appDataStr) {
        setCloudSyncStatus('error');
        return { success: false, message: 'No local data to sync' };
      }

      const appData = JSON.parse(appDataStr);
      const result = await cloudStorageService.uploadUserData(appData);
      
      if (result.success) {
        setCloudSyncStatus('success');
        setLastSyncTime(new Date().toISOString());
        toast({
          title: 'Đồng bộ thành công',
          description: 'Dữ liệu đã được lưu vào Google Drive'
        });
      } else {
        setCloudSyncStatus('error');
        toast({
          title: 'Lỗi đồng bộ',
          description: result.message,
          variant: 'destructive'
        });
      }
      
      return result;
    } catch (error) {
      setCloudSyncStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Lỗi đồng bộ',
        description: errorMessage,
        variant: 'destructive'
      });
      return { success: false, message: errorMessage };
    }
  };

  // Sync data from cloud
  const syncFromCloud = async (): Promise<CloudStorageResult> => {
    if (!isCloudSyncEnabled) {
      return { success: false, message: 'Cloud sync is not enabled' };
    }

    setCloudSyncStatus('syncing');
    
    try {
      const result = await cloudStorageService.downloadUserData();
      
      if (result.success && result.data) {
        // Save downloaded data to localStorage
        localStorage.setItem('mindlist_app_data', JSON.stringify(result.data));
        
        setCloudSyncStatus('success');
        setLastSyncTime(result.data.lastSyncTime || new Date().toISOString());
        
        toast({
          title: 'Khôi phục thành công',
          description: 'Dữ liệu đã được tải từ Google Drive'
        });
        
        // Reload the page to apply the restored data
        window.location.reload();
      } else {
        setCloudSyncStatus('error');
        toast({
          title: 'Lỗi khôi phục',
          description: result.message,
          variant: 'destructive'
        });
      }
      
      return result;
    } catch (error) {
      setCloudSyncStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Lỗi khôi phục',
        description: errorMessage,
        variant: 'destructive'
      });
      return { success: false, message: errorMessage };
    }
  };

  // Auto-sync when authentication changes
  useEffect(() => {
    if (isAuthenticated && isCloudSyncEnabled) {
      // Auto-sync from cloud when user logs in
      const autoSyncFromCloud = async () => {
        try {
          const statusResult = await cloudStorageService.getSyncStatus();
          if (statusResult.success && statusResult.data?.lastSyncTime) {
            // Check if cloud data is newer than local data
            const localDataStr = localStorage.getItem('mindlist_app_data');
            if (localDataStr) {
              const localData = JSON.parse(localDataStr);
              const localSyncTime = localData.lastSyncTime;
              
              if (!localSyncTime || new Date(statusResult.data.lastSyncTime) > new Date(localSyncTime)) {
                await syncFromCloud();
              }
            } else {
              // No local data, sync from cloud
              await syncFromCloud();
            }
          }
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      };

      autoSyncFromCloud();
    }
  }, [isAuthenticated, isCloudSyncEnabled]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated,
      isCloudSyncEnabled,
      setIsCloudSyncEnabled,
      cloudSyncStatus,
      lastSyncTime,
      syncToCloud,
      syncFromCloud
    }}>
      {children}
    </AuthContext.Provider>
  );
}