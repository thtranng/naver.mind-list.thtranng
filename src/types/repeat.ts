export interface RepeatSettings {
  type: 'never' | 'hourly' | 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Số lần lặp (ví dụ: mỗi 2 ngày, mỗi 3 tuần)
  endType: 'never' | 'date' | 'count';
  endDate?: Date; // Ngày kết thúc lặp lại
  endCount?: number; // Số lần lặp lại tối đa
  daysOfWeek?: number[]; // Cho weekly repeat: [0,1,2,3,4,5,6] (0=Chủ nhật)
  dayOfMonth?: number; // Cho monthly repeat: ngày trong tháng
  isTemplate?: boolean; // Đánh dấu task này là template để tạo recurring tasks
  templateId?: string; // ID của template task gốc
  nextOccurrence?: Date; // Lần xuất hiện tiếp theo
  isActive?: boolean; // Template có đang hoạt động không
}

export interface RecurringTask {
  id: string;
  templateId: string; // ID của task template gốc
  originalTaskId: string; // ID của task gốc
  scheduledDate: Date; // Ngày được lên lịch
  isGenerated: boolean; // Đánh dấu task này được tạo tự động
  generatedAt: Date; // Thời gian tạo
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  listId: string;
  repeatSettings: RepeatSettings;
  createdAt: Date;
  lastGenerated?: Date; // Lần cuối tạo recurring task
  isActive: boolean; // Template có đang hoạt động không
}