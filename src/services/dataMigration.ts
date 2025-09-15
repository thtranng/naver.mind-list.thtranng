import { guestStorage, GuestData } from '@/utils/guestStorage';
import { User } from '@/types';

export interface MigrationResult {
  success: boolean;
  message: string;
  migratedItemsCount?: {
    tasks: number;
    lists: number;
  };
}

export const dataMigrationService = {
  // Kiểm tra xem có dữ liệu guest cần migrate không
  hasDataToMigrate: (): boolean => {
    return guestStorage.hasGuestData();
  },

  // Migrate dữ liệu guest lên server
  migrateGuestDataToServer: async (user: User): Promise<MigrationResult> => {
    try {
      const guestData = guestStorage.createMigrationPayload();
      
      if (!guestData) {
        return {
          success: true,
          message: 'Không có dữ liệu guest để migrate'
        };
      }

      // TODO: Thay thế bằng API call thực tế
      // Hiện tại chỉ simulate API call
      const response = await simulateApiCall('/api/user/sync-guest-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}` // Giả sử có token
        },
        body: JSON.stringify({
          userId: user.id,
          guestData: guestData
        })
      });

      if (response.success) {
        // Xóa dữ liệu guest sau khi migrate thành công
        guestStorage.clearGuestData();
        
        return {
          success: true,
          message: 'Đã đồng bộ dữ liệu thành công!',
          migratedItemsCount: {
            tasks: guestData.tasks.length,
            lists: guestData.userLists.length
          }
        };
      } else {
        throw new Error(response.message || 'Migration failed');
      }
    } catch (error) {
      console.error('Error migrating guest data:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra khi đồng bộ dữ liệu. Vui lòng thử lại.'
      };
    }
  },

  // Tạo thông báo cho user về việc migrate
  createMigrationNotification: (guestData: GuestData): string => {
    const taskCount = guestData.tasks?.length || 0;
    const listCount = guestData.userLists?.length || 0;
    
    if (taskCount === 0 && listCount === 0) {
      return 'Chào mừng bạn đến với Mind List!';
    }
    
    let message = 'Chúng tôi đã phát hiện bạn có ';
    const items = [];
    
    if (taskCount > 0) {
      items.push(`${taskCount} công việc`);
    }
    
    if (listCount > 0) {
      items.push(`${listCount} danh sách`);
    }
    
    message += items.join(' và ');
    message += ' đã tạo trước đó. Chúng tôi sẽ đồng bộ tất cả dữ liệu này vào tài khoản của bạn.';
    
    return message;
  },

  // Backup dữ liệu guest trước khi migrate (phòng trường hợp có lỗi)
  backupGuestData: (): string | null => {
    try {
      const guestData = guestStorage.getGuestData();
      if (!guestData) return null;
      
      const backup = JSON.stringify(guestData);
      const backupKey = `mindlist_guest_backup_${Date.now()}`;
      localStorage.setItem(backupKey, backup);
      
      return backupKey;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  },

  // Restore từ backup nếu migration thất bại
  restoreFromBackup: (backupKey: string): boolean => {
    try {
      const backup = localStorage.getItem(backupKey);
      if (!backup) return false;
      
      localStorage.setItem('mindlist_guest_data', backup);
      localStorage.removeItem(backupKey);
      
      return true;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return false;
    }
  }
};

// Simulate API call cho development
// TODO: Thay thế bằng actual API service
const simulateApiCall = async (url: string, options: any): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful response
      resolve({
        success: true,
        message: 'Data migrated successfully',
        data: {}
      });
    }, 1000); // Simulate network delay
  });
};

// Hook để sử dụng migration service trong components
export const useDataMigration = () => {
  const migrateData = async (user: User): Promise<MigrationResult> => {
    // Tạo backup trước khi migrate
    const backupKey = dataMigrationService.backupGuestData();
    
    try {
      const result = await dataMigrationService.migrateGuestDataToServer(user);
      
      // Xóa backup nếu migration thành công
      if (result.success && backupKey) {
        localStorage.removeItem(backupKey);
      }
      
      return result;
    } catch (error) {
      // Restore từ backup nếu có lỗi
      if (backupKey) {
        dataMigrationService.restoreFromBackup(backupKey);
      }
      
      return {
        success: false,
        message: 'Có lỗi xảy ra khi đồng bộ dữ liệu. Dữ liệu của bạn đã được khôi phục.'
      };
    }
  };

  return {
    migrateData,
    hasDataToMigrate: dataMigrationService.hasDataToMigrate,
    createMigrationNotification: dataMigrationService.createMigrationNotification
  };
};