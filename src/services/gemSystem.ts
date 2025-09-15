// Hệ thống Mind Gems - Phần thưởng và tiền tệ

export interface GemEarnEvent {
  type: 'daily_login' | 'level_up' | 'streak_bonus' | 'achievement' | 'referral' | 'tournament' | 'mystery_box';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface GemTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: Date;
  source?: string;
}

// Quy tắc kiếm Mind Gems
export const GEM_RULES = {
  DAILY_LOGIN: 10,          // Đăng nhập hàng ngày
  LEVEL_UP_BASE: 100,       // Lên cấp cơ bản
  STREAK_7_DAYS: 50,        // Duy trì chuỗi 7 ngày
  REFERRAL: 100,            // Giới thiệu bạn bè
  TOURNAMENT_TOP3: 200,     // Đạt Top 3 giải đấu
  MYSTERY_BOX: 25,          // Mở hộp bí ẩn
  ACHIEVEMENT_SMALL: 50,    // Thành tích nhỏ
  ACHIEVEMENT_MEDIUM: 200,  // Thành tích trung bình
  ACHIEVEMENT_LARGE: 500,   // Thành tích lớn
  ACHIEVEMENT_EPIC: 1000    // Thành tích epic
};

// Tính Mind Gems từ đăng nhập hàng ngày
export function calculateDailyLoginGems(): { totalGems: number; events: GemEarnEvent[] } {
  const events: GemEarnEvent[] = [];
  const totalGems = GEM_RULES.DAILY_LOGIN;
  
  events.push({
    type: 'daily_login',
    amount: totalGems,
    description: 'Đăng nhập hàng ngày',
    timestamp: new Date()
  });
  
  return { totalGems, events };
}

// Tính Mind Gems từ lên cấp
export function calculateLevelUpGems(newLevel: number, tier: string): { totalGems: number; events: GemEarnEvent[] } {
  const events: GemEarnEvent[] = [];
  let totalGems = GEM_RULES.LEVEL_UP_BASE;
  
  // Tăng phần thưởng theo tier
  switch (tier) {
    case 'bronze':
      totalGems = 100;
      break;
    case 'silver':
      totalGems = 125;
      break;
    case 'gold':
      totalGems = 150;
      break;
    case 'platinum':
      totalGems = 200;
      break;
    case 'diamond':
      totalGems = 300;
      break;
  }
  
  events.push({
    type: 'level_up',
    amount: totalGems,
    description: `Lên cấp ${newLevel}`,
    timestamp: new Date()
  });
  
  return { totalGems, events };
}

// Tính Mind Gems từ chuỗi ngày
export function calculateStreakGems(streakDays: number): { totalGems: number; events: GemEarnEvent[] } {
  const events: GemEarnEvent[] = [];
  let totalGems = 0;
  
  // Mỗi 7 ngày liên tiếp nhận 50 Gems
  if (streakDays > 0 && streakDays % 7 === 0) {
    totalGems = GEM_RULES.STREAK_7_DAYS;
    events.push({
      type: 'streak_bonus',
      amount: totalGems,
      description: `Duy trì chuỗi ${streakDays} ngày`,
      timestamp: new Date()
    });
  }
  
  return { totalGems, events };
}

// Tính Mind Gems từ thành tích
export function calculateAchievementGems(achievementType: 'small' | 'medium' | 'large' | 'epic'): { totalGems: number; events: GemEarnEvent[] } {
  const events: GemEarnEvent[] = [];
  let totalGems = 0;
  
  switch (achievementType) {
    case 'small':
      totalGems = GEM_RULES.ACHIEVEMENT_SMALL;
      break;
    case 'medium':
      totalGems = GEM_RULES.ACHIEVEMENT_MEDIUM;
      break;
    case 'large':
      totalGems = GEM_RULES.ACHIEVEMENT_LARGE;
      break;
    case 'epic':
      totalGems = GEM_RULES.ACHIEVEMENT_EPIC;
      break;
  }
  
  events.push({
    type: 'achievement',
    amount: totalGems,
    description: `Hoàn thành thành tích ${achievementType}`,
    timestamp: new Date()
  });
  
  return { totalGems, events };
}

// Service quản lý Mind Gems
export class GemSystemService {
  // Xử lý kiếm Gems từ đăng nhập
  static processDailyLogin(): { gemsEarned: number; events: GemEarnEvent[] } {
    const result = calculateDailyLoginGems();
    return {
      gemsEarned: result.totalGems,
      events: result.events
    };
  }
  
  // Xử lý kiếm Gems từ streak bonus
  static processStreakBonus(streakDays: number): { gemsEarned: number; events: GemEarnEvent[] } {
    const result = calculateStreakGems(streakDays);
    return {
      gemsEarned: result.totalGems,
      events: result.events
    };
  }
  
  // Xử lý kiếm Gems từ lên cấp
  static processLevelUpGems(newLevel: number, tier: string): { gemsEarned: number; events: GemEarnEvent[] } {
    const result = calculateLevelUpGems(newLevel, tier);
    return {
      gemsEarned: result.totalGems,
      events: result.events
    };
  }
  
  // Xử lý kiếm Gems từ chuỗi ngày
  static processStreakGems(streakDays: number): { gemsEarned: number; events: GemEarnEvent[] } {
    const result = calculateStreakGems(streakDays);
    return {
      gemsEarned: result.totalGems,
      events: result.events
    };
  }
  
  // Xử lý kiếm Gems từ thành tích
  static processAchievementGems(achievementType: 'small' | 'medium' | 'large' | 'epic'): { gemsEarned: number; events: GemEarnEvent[] } {
    const result = calculateAchievementGems(achievementType);
    return {
      gemsEarned: result.totalGems,
      events: result.events
    };
  }
  
  // Xử lý kiếm Gems từ giới thiệu bạn bè
  static processReferralGems(): { gemsEarned: number; events: GemEarnEvent[] } {
    const events: GemEarnEvent[] = [{
      type: 'referral',
      amount: GEM_RULES.REFERRAL,
      description: 'Giới thiệu bạn bè',
      timestamp: new Date()
    }];
    
    return {
      gemsEarned: GEM_RULES.REFERRAL,
      events
    };
  }
  
  // Xử lý kiếm Gems từ giải đấu
  static processTournamentGems(rank: number): { gemsEarned: number; events: GemEarnEvent[] } {
    const events: GemEarnEvent[] = [];
    let gemsEarned = 0;
    
    if (rank <= 3) {
      gemsEarned = GEM_RULES.TOURNAMENT_TOP3;
      events.push({
        type: 'tournament',
        amount: gemsEarned,
        description: `Đạt hạng ${rank} trong giải đấu`,
        timestamp: new Date()
      });
    }
    
    return { gemsEarned, events };
  }
  
  // Xử lý kiếm Gems từ hộp bí ẩn
  static processMysteryBoxGems(): { gemsEarned: number; events: GemEarnEvent[] } {
    const events: GemEarnEvent[] = [{
      type: 'mystery_box',
      amount: GEM_RULES.MYSTERY_BOX,
      description: 'Mở hộp bí ẩn',
      timestamp: new Date()
    }];
    
    return {
      gemsEarned: GEM_RULES.MYSTERY_BOX,
      events
    };
  }
}