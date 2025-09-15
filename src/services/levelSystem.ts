import { LevelTier, LevelInfo, UserLevelData, XPGainEvent, LevelUpEvent, LevelReward } from '../types';
import { GemSystemService, GemEarnEvent } from './gemSystem';

// Định nghĩa các bậc danh hiệu (Tiers)
export const LEVEL_TIERS: LevelTier[] = [
  {
    id: 'bronze',
    name: 'Đồng (Bronze)',
    minLevel: 1,
    maxLevel: 9,
    color: '#CD7F32',
    icon: '🥉'
  },
  {
    id: 'silver',
    name: 'Bạc (Silver)',
    minLevel: 10,
    maxLevel: 24,
    color: '#C0C0C0',
    icon: '🥈'
  },
  {
    id: 'gold',
    name: 'Vàng (Gold)',
    minLevel: 25,
    maxLevel: 49,
    color: '#FFD700',
    icon: '🥇'
  },
  {
    id: 'platinum',
    name: 'Bạch Kim (Platinum)',
    minLevel: 50,
    maxLevel: 74,
    color: '#E5E4E2',
    icon: '💎'
  },
  {
    id: 'diamond',
    name: 'Kim Cương (Diamond)',
    minLevel: 75,
    maxLevel: 100,
    color: '#B9F2FF',
    icon: '💠'
  }
];

// Quy tắc kiếm XP
export const XP_RULES = {
  TASK_BASIC: 10,           // Công việc cơ bản
  TASK_IMPORTANT: 15,       // Công việc quan trọng
  TASK_URGENT: 20,          // Công việc khẩn cấp
  ON_TIME_BONUS: 5,         // Bonus đúng hạn
  PERFECT_DAY_BONUS: 30,    // Bonus hoàn thành tất cả task trong ngày
  PLANNING_BONUS: 10,       // Bonus lập kế hoạch (tạo >= 3 task cho ngày mai)
  STREAK_BONUS: 20
};

// Tính XP cần thiết cho từng level
export function calculateXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  // Công thức mới: XP cần để lên cấp tiếp theo = 200 + (Cấp độ hiện tại * 50)
  return 200 + ((level - 1) * 50);
}

// Tính tổng XP cần thiết để đạt level cụ thể
export function calculateTotalXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  let totalXP = 0;
  for (let i = 2; i <= level; i++) {
    totalXP += calculateXPForLevel(i);
  }
  return totalXP;
}

// Lấy thông tin tier dựa trên level
export function getTierByLevel(level: number): LevelTier {
  return LEVEL_TIERS.find(tier => level >= tier.minLevel && level <= tier.maxLevel) || LEVEL_TIERS[0];
}

// Tính phần thưởng cho level
export function getRewardsForLevel(level: number): LevelReward[] {
  const rewards: LevelReward[] = [];
  
  // Mind Gems cơ bản cho mỗi level up
  let baseGems = 100; // Mặc định +100 Gems khi lên cấp
  
  // Tăng phần thưởng theo tier
  const tier = getTierByLevel(level);
  switch (tier.id) {
    case 'bronze':
      baseGems = 100;
      break;
    case 'silver':
      baseGems = 125;
      break;
    case 'gold':
      baseGems = 150;
      break;
    case 'platinum':
      baseGems = 200;
      break;
    case 'diamond':
      baseGems = 300;
      break;
  }
  
  rewards.push({
    type: 'gems',
    amount: baseGems,
    description: `Nhận ${baseGems} Mind Gems`
  });
  
  // Phần thưởng đặc biệt cho các mốc tier mới
  if (level === 10) { // Đạt Silver
    rewards.push({
      type: 'gems',
      amount: 500,
      description: 'Bonus đạt bậc Bạc'
    });
  }
  
  if (level === 25) { // Đạt Gold
    rewards.push({
      type: 'gems',
      amount: 1500,
      description: 'Bonus đạt bậc Vàng'
    });
  }
  
  if (level === 50) { // Đạt Platinum
    rewards.push({
      type: 'gems',
      amount: 5000,
      description: 'Bonus đạt bậc Bạch Kim'
    });
  }
  
  if (level === 75) { // Đạt Diamond
    rewards.push({
      type: 'gems',
      amount: 10000,
      description: 'Bonus đạt bậc Kim Cương'
    });
  }
  
  return rewards;
}

// Tính toán dữ liệu level của user
export function calculateUserLevelData(
  currentLevel: number,
  currentXP: number,
  totalXPEarned: number,
  mindGems: number,
  unlockedItems: string[]
): UserLevelData {
  const currentTier = getTierByLevel(currentLevel);
  const nextLevelXP = calculateXPForLevel(currentLevel + 1) - calculateXPForLevel(currentLevel);
  const progressToNextLevel = Math.min((currentXP / nextLevelXP) * 100, 100);
  
  return {
    level: currentLevel,
    currentXP,
    totalXPEarned,
    mindGems,
    unlockedItems,
    currentTier,
    nextLevelXP,
    progressToNextLevel
  };
}

// Tính XP được nhận từ việc hoàn thành task
export function calculateTaskXP(
  isCompleted: boolean,
  isOnTime: boolean,
  priority: 'none' | 'important' | 'urgent'
): { totalXP: number; events: XPGainEvent[] } {
  const events: XPGainEvent[] = [];
  let totalXP = 0;
  
  if (isCompleted) {
    // XP theo priority của task
    let baseXP = XP_RULES.TASK_BASIC;
    let taskDescription = 'Hoàn thành công việc cơ bản';
    
    if (priority === 'important') {
      baseXP = XP_RULES.TASK_IMPORTANT;
      taskDescription = 'Hoàn thành công việc quan trọng';
    } else if (priority === 'urgent') {
      baseXP = XP_RULES.TASK_URGENT;
      taskDescription = 'Hoàn thành công việc khẩn cấp';
    }
    
    totalXP += baseXP;
    events.push({
      type: 'task_complete',
      amount: baseXP,
      description: taskDescription,
      timestamp: new Date()
    });
    
    // Bonus cho việc hoàn thành đúng hạn
    if (isOnTime) {
      totalXP += XP_RULES.ON_TIME_BONUS;
      events.push({
        type: 'on_time_bonus',
        amount: XP_RULES.ON_TIME_BONUS,
        description: 'Hoàn thành đúng hạn',
        timestamp: new Date()
      });
    }
  }
  
  return { totalXP, events };
}

// Tính XP từ streak bonus
export function calculateStreakXP(streakDays: number): { totalXP: number; event: XPGainEvent | null } {
  if (streakDays > 0) {
    return {
      totalXP: XP_RULES.STREAK_BONUS,
      event: {
        type: 'streak_bonus',
        amount: XP_RULES.STREAK_BONUS,
        description: `Duy trì chuỗi ${streakDays} ngày`,
        timestamp: new Date()
      }
    };
  }
  return { totalXP: 0, event: null };
}

// Xử lý level up
export function processLevelUp(
  currentLevel: number,
  currentXP: number,
  totalXPEarned: number,
  newXP: number
): { newLevel: number; newCurrentXP: number; levelUpEvents: LevelUpEvent[]; totalGemsEarned: number } {
  let level = currentLevel;
  let xp = currentXP + newXP;
  const levelUpEvents: LevelUpEvent[] = [];
  let totalGemsEarned = 0;
  
  // Kiểm tra level up với logic reset XP
  while (true) {
    const xpNeededForNextLevel = calculateXPForLevel(level + 1) - calculateXPForLevel(level);
    
    if (xp >= xpNeededForNextLevel && xpNeededForNextLevel > 0) {
      // Level up!
      level += 1;
      xp = xp - xpNeededForNextLevel; // Reset XP, giữ lại phần dư
      
      const rewards = getRewardsForLevel(level);
      const newTier = getTierByLevel(level);
      const oldTier = getTierByLevel(level - 1);
      
      // Tính tổng gems từ rewards
      const gemsFromRewards = rewards
        .filter(reward => reward.type === 'gems')
        .reduce((sum, reward) => sum + (reward.amount || 0), 0);
      totalGemsEarned += gemsFromRewards;
      
      levelUpEvents.push({
        newLevel: level,
        newTier: newTier.id !== oldTier.id ? newTier : undefined,
        rewards,
        totalXPEarned: totalXPEarned + newXP,
        timestamp: new Date()
      });
      
      // Tránh vòng lặp vô hạn
      if (calculateXPForLevel(level + 1) <= 0) break;
    } else {
      break;
    }
  }
  
  return {
    newLevel: level,
    newCurrentXP: xp,
    levelUpEvents,
    totalGemsEarned
  };
}

// Service class chính
export class LevelSystemService {
  // Lấy thông tin level hiện tại
  static getLevelInfo(level: number): LevelInfo {
    const tier = getTierByLevel(level);
    const xpRequired = calculateXPForLevel(level);
    const rewards = getRewardsForLevel(level);
    
    return {
      level,
      tier,
      title: `${tier.name} - Cấp ${level}`,
      xpRequired,
      rewards
    };
  }
  
  // Xử lý việc hoàn thành task và cập nhật XP
  static processTaskCompletion(
    userData: UserLevelData,
    isOnTime: boolean,
    priority: 'none' | 'important' | 'urgent'
  ): {
    newUserData: UserLevelData;
    xpGained: number;
    xpEvents: XPGainEvent[];
    levelUpEvents: LevelUpEvent[];
    gemsEarned: number;
    gemEvents: GemEarnEvent[];
  } {
    // Tính XP từ task (chỉ XP, không có Gems)
    const { totalXP: xpGained, events: xpEvents } = calculateTaskXP(true, isOnTime, priority);
    
    // Xử lý level up
    const { newLevel, newCurrentXP, levelUpEvents, totalGemsEarned } = processLevelUp(
      userData.level,
      userData.currentXP,
      userData.totalXPEarned,
      xpGained
    );
    
    // Tính gems từ level up (sử dụng GemSystemService)
    let gemEvents: GemEarnEvent[] = [];
    let actualGemsEarned = 0;
    
    if (levelUpEvents.length > 0) {
      levelUpEvents.forEach(event => {
        const currentTier = getTierByLevel(event.newLevel);
        const gemResult = GemSystemService.processLevelUpGems(event.newLevel, currentTier.name);
        actualGemsEarned += gemResult.gemsEarned;
        gemEvents.push(...gemResult.events);
      });
    }
    
    // Cập nhật unlocked items từ rewards
    const newUnlockedItems = [...userData.unlockedItems];
    levelUpEvents.forEach(event => {
      event.rewards.forEach(reward => {
        if (reward.itemId && !newUnlockedItems.includes(reward.itemId)) {
          newUnlockedItems.push(reward.itemId);
        }
      });
    });
    
    // Tạo user data mới
    const newUserData = calculateUserLevelData(
      newLevel,
      newCurrentXP,
      userData.totalXPEarned + xpGained,
      userData.mindGems + actualGemsEarned,
      newUnlockedItems
    );
    
    return {
      newUserData,
      xpGained,
      xpEvents,
      levelUpEvents,
      gemsEarned: actualGemsEarned,
      gemEvents
    };
  }
  
  // Xử lý streak bonus
  static processStreakBonus(
    userData: UserLevelData,
    streakDays: number
  ): {
    newUserData: UserLevelData;
    xpGained: number;
    xpEvent: XPGainEvent | null;
    levelUpEvents: LevelUpEvent[];
    gemsEarned: number;
    gemEvents: GemEarnEvent[];
  } {
    const { totalXP: xpGained, event: xpEvent } = calculateStreakXP(streakDays);
    
    if (xpGained === 0) {
      return {
        newUserData: userData,
        xpGained: 0,
        xpEvent: null,
        levelUpEvents: [],
        gemsEarned: 0,
        gemEvents: []
      };
    }
    
    // Xử lý level up
    const { newLevel, newCurrentXP, levelUpEvents, totalGemsEarned } = processLevelUp(
      userData.level,
      userData.currentXP,
      userData.totalXPEarned,
      xpGained
    );
    
    // Tính gems từ level up (sử dụng GemSystemService)
    let gemEvents: GemEarnEvent[] = [];
    let actualGemsEarned = 0;
    
    if (levelUpEvents.length > 0) {
      levelUpEvents.forEach(event => {
        const currentTier = getTierByLevel(event.newLevel);
        const gemResult = GemSystemService.processLevelUpGems(event.newLevel, currentTier.name);
        actualGemsEarned += gemResult.gemsEarned;
        gemEvents.push(...gemResult.events);
      });
    }
    
    // Cập nhật unlocked items từ rewards
    const newUnlockedItems = [...userData.unlockedItems];
    levelUpEvents.forEach(event => {
      event.rewards.forEach(reward => {
        if (reward.itemId && !newUnlockedItems.includes(reward.itemId)) {
          newUnlockedItems.push(reward.itemId);
        }
      });
    });
    
    // Tạo user data mới
    const newUserData = calculateUserLevelData(
      newLevel,
      newCurrentXP,
      userData.totalXPEarned + xpGained,
      userData.mindGems + actualGemsEarned,
      newUnlockedItems
    );
    
    return {
      newUserData,
      xpGained,
      xpEvent,
      levelUpEvents,
      gemsEarned: actualGemsEarned,
      gemEvents
    };
  }
}