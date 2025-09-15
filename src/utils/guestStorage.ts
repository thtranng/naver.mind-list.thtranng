import { Task, UserList, AppState } from '@/types';

const GUEST_DATA_KEY = 'mindlist_guest_data';

export interface GuestData {
  tasks: Task[];
  userLists: UserList[];
  gamification: AppState['gamification'];
  streak: number;
  bestStreak: number;
  productivityPoints: number;
  dailyProductivityGoal: number;
  lastProductivityDate: string | null;
  lastSaved: string;
}

export const guestStorage = {
  // Lưu dữ liệu guest vào localStorage
  saveGuestData: (data: Partial<GuestData>) => {
    try {
      const existingData = guestStorage.getGuestData();
      const updatedData = {
        ...existingData,
        ...data,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving guest data:', error);
    }
  },

  // Lấy dữ liệu guest từ localStorage
  getGuestData: (): GuestData | null => {
    try {
      const data = localStorage.getItem(GUEST_DATA_KEY);
      if (!data) return null;
      
      const parsedData = JSON.parse(data);
      
      // Convert date strings back to Date objects
      if (parsedData.tasks) {
        parsedData.tasks = parsedData.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
      }
      
      if (parsedData.userLists) {
        parsedData.userLists = parsedData.userLists.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          updatedAt: new Date(list.updatedAt)
        }));
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error loading guest data:', error);
      return null;
    }
  },

  // Xóa dữ liệu guest (sau khi migrate)
  clearGuestData: () => {
    try {
      localStorage.removeItem(GUEST_DATA_KEY);
    } catch (error) {
      console.error('Error clearing guest data:', error);
    }
  },

  // Kiểm tra xem có dữ liệu guest không
  hasGuestData: (): boolean => {
    try {
      const data = localStorage.getItem(GUEST_DATA_KEY);
      return data !== null && data !== 'null';
    } catch (error) {
      return false;
    }
  },

  // Tạo payload để gửi lên server khi migrate
  createMigrationPayload: (): GuestData | null => {
    const guestData = guestStorage.getGuestData();
    if (!guestData) return null;

    return {
      tasks: guestData.tasks || [],
      userLists: guestData.userLists || [],
      gamification: guestData.gamification || {
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        mindGems: 0,
        streakFreezes: 0,
        weeklyXP: 0,
        leaguePosition: 0,
        leagueName: 'Đồng',
        achievements: []
      },
      streak: guestData.streak || 0,
      bestStreak: guestData.bestStreak || 0,
      productivityPoints: guestData.productivityPoints || 0,
      dailyProductivityGoal: guestData.dailyProductivityGoal || 30,
      lastProductivityDate: guestData.lastProductivityDate || null,
      lastSaved: guestData.lastSaved || new Date().toISOString()
    };
  }
};

// Hook để tự động lưu dữ liệu guest khi state thay đổi
export const useGuestDataSync = () => {
  const syncGuestData = (state: AppState) => {
    // Chỉ lưu nếu user chưa đăng nhập (guest mode)
    if (!state.user) {
      guestStorage.saveGuestData({
        tasks: state.tasks,
        userLists: state.userLists,
        gamification: state.gamification,
        streak: state.streak,
        bestStreak: state.bestStreak,
        productivityPoints: state.productivityPoints,
        dailyProductivityGoal: state.dailyProductivityGoal,
        lastProductivityDate: state.lastProductivityDate
      });
    }
  };

  return { syncGuestData };
};