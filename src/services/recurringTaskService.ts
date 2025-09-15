// Recurring Task Service
// Handles generation and management of recurring tasks

import { RepeatSettings, RecurringTask, TaskTemplate } from '../types/repeat';
import { loadTasks, saveTasks, loadLists } from './localStorage';

// Calculate next occurrence date based on repeat settings
export const calculateNextOccurrence = (repeatSettings: RepeatSettings, fromDate: Date = new Date()): Date | null => {
  if (repeatSettings.type === 'never') {
    return null;
  }

  const nextDate = new Date(fromDate);

  switch (repeatSettings.type) {
    case 'hourly':
      nextDate.setHours(nextDate.getHours() + repeatSettings.interval);
      break;
    case 'daily':
      nextDate.setDate(nextDate.getDate() + repeatSettings.interval);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + (repeatSettings.interval * 7));
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + repeatSettings.interval);
      if (repeatSettings.dayOfMonth) {
        nextDate.setDate(repeatSettings.dayOfMonth);
      }
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + repeatSettings.interval);
      break;
    case 'weekdays':
      // Find next weekday
      do {
        nextDate.setDate(nextDate.getDate() + 1);
      } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
      break;
    case 'weekends':
      // Find next weekend
      do {
        nextDate.setDate(nextDate.getDate() + 1);
      } while (nextDate.getDay() !== 0 && nextDate.getDay() !== 6);
      break;
    default:
      return null;
  }

  return nextDate;
};

// Check if a template should generate a task now
export const shouldGenerateTask = (template: TaskTemplate): boolean => {
  if (!template.isActive) return false;

  const now = new Date();
  const nextOccurrence = calculateNextOccurrence(template.repeatSettings, template.lastGenerated || template.createdAt);

  if (!nextOccurrence) return false;

  return nextOccurrence <= now;
};

// Generate a recurring task from template
export const generateRecurringTask = (template: TaskTemplate): RecurringTask => {
  const now = new Date();
  const scheduledDate = calculateNextOccurrence(template.repeatSettings, template.lastGenerated || template.createdAt) || now;

  return {
    id: `recurring_${template.id}_${now.getTime()}`,
    templateId: template.id,
    originalTaskId: template.id, // For now, use template id
    scheduledDate,
    isGenerated: false,
    generatedAt: now,
  };
};

// Process all active templates and generate due recurring tasks
export const processRecurringTasks = (): RecurringTask[] => {
  // This would need access to templates, but for now return empty array
  // In a real implementation, templates would be stored somewhere
  return [];
};

// Get all recurring tasks
export const getRecurringTasks = (): RecurringTask[] => {
  // For now, return empty array
  // In a real implementation, this would load from storage
  return [];
};

// Mark recurring task as generated
export const markTaskGenerated = (recurringTaskId: string): void => {
  // Implementation would update the recurring task status
  console.log(`Marked recurring task ${recurringTaskId} as generated`);
};