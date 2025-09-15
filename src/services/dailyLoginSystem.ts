// Hệ thống Daily Login - Xử lý đăng nhập hàng ngày và phần thưởng

import { GemSystemService, GemEarnEvent } from './gemSystem';
import { StreakProtectionService } from './streakProtectionService';

export interface DailyLoginData {
  lastLoginDate: string | null;
  consecutiveDays: number;
  totalLoginDays: number;
  lastStreakRewardDate: string | null;
}

export interface DailyLoginResult {
  isFirstLoginToday: boolean;
  gemsEarned: number;
  streakBonusGems: number;
  totalGemsEarned: number;
  consecutiveDays: number;
  gemEvents: GemEarnEvent[];
  messages: string[];
  streakProtected?: boolean;
  streakFreezeUsed?: boolean;
}

// Lấy dữ liệu daily login từ localStorage
export function getDailyLoginData(): DailyLoginData {
  const stored = localStorage.getItem('dailyLoginData');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing daily login data:', error);
    }
  }
  
  return {
    lastLoginDate: null,
    consecutiveDays: 0,
    totalLoginDays: 0,
    lastStreakRewardDate: null
  };
}

// Lưu dữ liệu daily login vào localStorage
export function saveDailyLoginData(data: DailyLoginData): void {
  localStorage.setItem('dailyLoginData', JSON.stringify(data));
}

// Kiểm tra xem hôm nay đã đăng nhập chưa
export function isFirstLoginToday(lastLoginDate: string | null): boolean {
  if (!lastLoginDate) return true;
  
  const today = new Date().toDateString();
  const lastLogin = new Date(lastLoginDate).toDateString();
  
  return today !== lastLogin;
}

// Kiểm tra xem người dùng có hoàn thành mục tiêu hàng ngày không (hôm qua)
export function hasCompletedDailyGoal(): boolean {
  // Lấy tasks từ localStorage
  const tasksData = localStorage.getItem('tasks');
  if (!tasksData) return false;

  try {
    const tasks = JSON.parse(tasksData);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // Kiểm tra xem có ít nhất 1 task được hoàn thành hôm qua
    const completedYesterday = tasks.some((task: any) => {
      if (!task.isCompleted || !task.updatedAt) return false;
      const taskDate = new Date(task.updatedAt).toDateString();
      return taskDate === yesterdayStr;
    });

    return completedYesterday;
  } catch (error) {
    console.error('Error checking daily goal completion:', error);
    return false;
  }
}

// Tính toán consecutive days với logic Streak Protection
export function calculateConsecutiveDays(
  lastLoginDate: string | null,
  currentStreak: number = 0
): { newStreak: number; streakProtected: boolean; streakFreezeUsed: boolean } {
  if (!lastLoginDate) {
    return { newStreak: 1, streakProtected: false, streakFreezeUsed: false };
  }

  const today = new Date();
  const lastLogin = new Date(lastLoginDate);

  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  lastLogin.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastLogin.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Kiểm tra xem hôm qua có hoàn thành mục tiêu không
    const completedYesterday = hasCompletedDailyGoal();

    if (completedYesterday) {
      // Hoàn thành mục tiêu, streak tăng bình thường
      return { newStreak: 1, streakProtected: false, streakFreezeUsed: false };
    } else {
      // Không hoàn thành mục tiêu, kiểm tra Streak Freeze
      const freezeResult = StreakProtectionService.checkAndUseStreakFreeze(currentStreak);

      if (freezeResult.wasUsed) {
        // Đã sử dụng Streak Freeze, giữ nguyên streak
        return { newStreak: 0, streakProtected: true, streakFreezeUsed: true };
      } else {
        // Không có Streak Freeze, đánh dấu streak bị broken và reset
        StreakProtectionService.markStreakBroken(currentStreak);
        return { newStreak: 1, streakProtected: false, streakFreezeUsed: false };
      }
    }
  } else if (diffDays > 1) {
    // Quá nhiều ngày không đăng nhập, streak bị broken
    StreakProtectionService.markStreakBroken(currentStreak);
    return { newStreak: 1, streakProtected: false, streakFreezeUsed: false };
  } else {
    // Same day (shouldn't happen if isFirstLoginToday is checked)
    return { newStreak: 0, streakProtected: false, streakFreezeUsed: false };
  }
}

// Kiểm tra xem có đủ điều kiện nhận streak bonus không (mỗi 7 ngày)
export function shouldReceiveStreakBonus(
  consecutiveDays: number, 
  lastStreakRewardDate: string | null
): boolean {
  if (consecutiveDays < 7) return false;
  if (consecutiveDays % 7 !== 0) return false;
  
  if (!lastStreakRewardDate) return true;
  
  const today = new Date().toDateString();
  const lastReward = new Date(lastStreakRewardDate).toDateString();
  
  return today !== lastReward;
}

// Xử lý daily login và trả về kết quả
export function processDailyLogin(): DailyLoginResult {
  const currentData = getDailyLoginData();
  const today = new Date().toISOString();

  // Kiểm tra xem hôm nay đã đăng nhập chưa
  const isFirstToday = isFirstLoginToday(currentData.lastLoginDate);

  if (!isFirstToday) {
    // Đã đăng nhập hôm nay rồi
    return {
      isFirstLoginToday: false,
      gemsEarned: 0,
      streakBonusGems: 0,
      totalGemsEarned: 0,
      consecutiveDays: currentData.consecutiveDays,
      gemEvents: [],
      messages: ['Bạn đã nhận phần thưởng đăng nhập hôm nay rồi!']
    };
  }

  // Tính toán consecutive days với Streak Protection
  const streakResult = calculateConsecutiveDays(currentData.lastLoginDate, currentData.consecutiveDays);
  const newConsecutiveDays = currentData.consecutiveDays + streakResult.newStreak;

  // Xử lý daily login gems
  const dailyLoginResult = GemSystemService.processDailyLogin();
  let totalGemsEarned = dailyLoginResult.gemsEarned;
  let allGemEvents = [...dailyLoginResult.events];
  let messages = [`+${dailyLoginResult.gemsEarned} 💎 từ đăng nhập hàng ngày!`];

  // Thêm thông báo về Streak Protection nếu có
  if (streakResult.streakFreezeUsed) {
    messages.push('🛡️ May quá! Vật phẩm Đóng Băng Chuỗi đã bảo vệ thành công chuỗi ngày của bạn.');
  }
  
  // Kiểm tra streak bonus
  let streakBonusGems = 0;
  const shouldGetStreakBonus = shouldReceiveStreakBonus(
    newConsecutiveDays, 
    currentData.lastStreakRewardDate
  );
  
  let newLastStreakRewardDate = currentData.lastStreakRewardDate;
  
  if (shouldGetStreakBonus) {
    const streakResult = GemSystemService.processStreakBonus(newConsecutiveDays);
    streakBonusGems = streakResult.gemsEarned;
    totalGemsEarned += streakBonusGems;
    allGemEvents.push(...streakResult.events);
    newLastStreakRewardDate = today;
    messages.push(`🔥 Bonus chuỗi ${newConsecutiveDays} ngày: +${streakBonusGems} 💎!`);
  }
  
  // Cập nhật dữ liệu
  const newData: DailyLoginData = {
    lastLoginDate: today,
    consecutiveDays: newConsecutiveDays,
    totalLoginDays: currentData.totalLoginDays + 1,
    lastStreakRewardDate: newLastStreakRewardDate
  };
  
  saveDailyLoginData(newData);
  
  return {
    isFirstLoginToday: true,
    gemsEarned: dailyLoginResult.gemsEarned,
    streakBonusGems,
    totalGemsEarned,
    consecutiveDays: newConsecutiveDays,
    gemEvents: allGemEvents,
    messages,
    streakProtected: streakResult.streakProtected,
    streakFreezeUsed: streakResult.streakFreezeUsed
  };
}

// Service class cho Daily Login
export class DailyLoginService {
  // Xử lý đăng nhập và trả về kết quả
  static processLogin(): DailyLoginResult {
    return processDailyLogin();
  }
  
  // Lấy thông tin streak hiện tại
  static getCurrentStreak(): number {
    const data = getDailyLoginData();
    return data.consecutiveDays;
  }
  
  // Lấy tổng số ngày đã đăng nhập
  static getTotalLoginDays(): number {
    const data = getDailyLoginData();
    return data.totalLoginDays;
  }
  
  // Reset dữ liệu (dùng cho testing hoặc admin)
  static resetData(): void {
    localStorage.removeItem('dailyLoginData');
  }
}