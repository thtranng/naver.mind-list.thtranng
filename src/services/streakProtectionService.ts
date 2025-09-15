interface StreakProtectionData {
  equippedStreakFreezes: number;
  streakLastBrokenAt: number | null;
  previousStreakValue?: number; // Giá trị chuỗi trước khi bị đứt
}

interface StreakFreezeResult {
  success: boolean;
  message: string;
  equippedCount: number;
}

interface StreakRepairOffer {
  isAvailable: boolean;
  previousStreak: number;
  cost: number;
  expiresAt: number;
  timeLeft: number;
}

interface StreakRepairResult {
  success: boolean;
  restoredStreak: number;
  message: string;
}

export class StreakProtectionService {
  private static readonly STORAGE_KEY = 'streak_protection_data';
  private static readonly MAX_EQUIPPED_FREEZES = 2;
  private static readonly STREAK_FREEZE_COST = 150; // Mind Gems
  private static readonly STREAK_REPAIR_COST_BASE = 500; // Mind Gems
  private static readonly REPAIR_WINDOW_HOURS = 48;

  // Getter methods for constants
  static getMaxEquippedFreezes(): number {
    return this.MAX_EQUIPPED_FREEZES;
  }

  static getStreakFreezeCost(): number {
    return this.STREAK_FREEZE_COST;
  }

  // Lấy dữ liệu bảo vệ từ localStorage
  private static getData(): StreakProtectionData {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      equippedStreakFreezes: 0,
      streakLastBrokenAt: null
    };
  }

  // Lưu dữ liệu bảo vệ vào localStorage
  private static saveData(data: StreakProtectionData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Mua và trang bị Streak Freeze
  static purchaseStreakFreeze(): StreakFreezeResult {
    const data = this.getData();
    
    if (data.equippedStreakFreezes >= this.MAX_EQUIPPED_FREEZES) {
      return {
        success: false,
        message: `Bạn chỉ có thể trang bị tối đa ${this.MAX_EQUIPPED_FREEZES} Đóng Băng Chuỗi`,
        equippedCount: data.equippedStreakFreezes
      };
    }

    data.equippedStreakFreezes += 1;
    this.saveData(data);

    return {
      success: true,
      message: `Đã trang bị Đóng Băng Chuỗi! (${data.equippedStreakFreezes}/${this.MAX_EQUIPPED_FREEZES})`,
      equippedCount: data.equippedStreakFreezes
    };
  }

  // Kiểm tra và sử dụng Streak Freeze tự động
  static checkAndUseStreakFreeze(currentStreak: number): { wasUsed: boolean; message: string } {
    const data = this.getData();
    
    if (data.equippedStreakFreezes <= 0) {
      return {
        wasUsed: false,
        message: 'Không có Đóng Băng Chuỗi để sử dụng'
      };
    }

    // Sử dụng 1 Streak Freeze
    data.equippedStreakFreezes -= 1;
    this.saveData(data);

    return {
      wasUsed: true,
      message: `🛡️ May quá! Đóng Băng Chuỗi đã bảo vệ chuỗi ${currentStreak} ngày của bạn!`
    };
  }

  // Đánh dấu chuỗi ngày bị đứt
  static markStreakBroken(currentStreak: number): void {
    const data = this.getData();
    data.streakLastBrokenAt = Date.now();
    data.previousStreakValue = currentStreak; // Lưu giá trị chuỗi trước khi bị đứt
    this.saveData(data);
  }

  // Lấy thông tin ưu đãi sửa chữa chuỗi
  static getStreakRepairOffer(previousStreak?: number): StreakRepairOffer | null {
    const data = this.getData();
    
    if (!data.streakLastBrokenAt) {
      return null;
    }

    const now = Date.now();
    const timeSinceBroken = now - data.streakLastBrokenAt;
    const windowMs = this.REPAIR_WINDOW_HOURS * 60 * 60 * 1000;

    if (timeSinceBroken > windowMs) {
      return null; // Đã hết hạn
    }

    // Sử dụng previousStreak từ data nếu không được cung cấp
    const streakToRestore = previousStreak || data.previousStreakValue || 0;
    const cost = this.STREAK_REPAIR_COST_BASE + (streakToRestore * 10);
    const expiresAt = data.streakLastBrokenAt + windowMs;

    return {
      isAvailable: true,
      previousStreak: streakToRestore,
      cost,
      expiresAt,
      timeLeft: expiresAt - now
    };
  }

  // Sửa chữa chuỗi ngày
  static repairStreak(previousStreak: number, cost: number): StreakRepairResult {
    const data = this.getData();
    
    if (!data.streakLastBrokenAt) {
      return {
        success: false,
        message: 'Không có chuỗi ngày nào cần sửa chữa',
        restoredStreak: 0
      };
    }

    const offer = this.getStreakRepairOffer(previousStreak);
    if (!offer || !offer.isAvailable) {
      return {
        success: false,
        message: 'Ưu đãi sửa chữa đã hết hạn',
        restoredStreak: 0
      };
    }

    // Xóa dữ liệu sau khi sử dụng
    data.streakLastBrokenAt = null;
    data.previousStreakValue = undefined;
    this.saveData(data);

    return {
      success: true,
      message: `🎉 Chuỗi ngày đã được khôi phục thành công!`,
      restoredStreak: previousStreak
    };
  }

  // Lấy số lượng Streak Freeze đã trang bị
  static getEquippedStreakFreezes(): number {
    const data = this.getData();
    return data.equippedStreakFreezes;
  }

  // Reset dữ liệu (để test)
  static resetData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}