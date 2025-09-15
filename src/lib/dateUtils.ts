/**
 * Utility functions for date and time operations
 */

/**
 * Check if a task is overdue
 * @param dueDate - The due date of the task
 * @param isCompleted - Whether the task is completed
 * @returns true if the task is overdue (not completed and past due date)
 */
export function isTaskOverdue(dueDate: string | Date, isCompleted: boolean): boolean {
  if (isCompleted) {
    return false; // Completed tasks are never considered overdue
  }
  
  const now = new Date();
  const taskDueDate = new Date(dueDate);
  
  // Task is overdue if current time is past the due date
  return taskDueDate < now;
}

/**
 * Get the appropriate CSS class for due date text based on overdue status
 * @param dueDate - The due date of the task
 * @param isCompleted - Whether the task is completed
 * @returns CSS class string for styling the due date text
 */
export function getDueDateTextClass(dueDate: string | Date, isCompleted: boolean): string {
  if (isTaskOverdue(dueDate, isCompleted)) {
    return 'text-red-500'; // Red color for overdue tasks
  }
  
  return 'text-gray-500'; // Default gray color for normal tasks
}

/**
 * Format a date for display in task cards
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatTaskDate(date: string | Date): string {
  const taskDate = new Date(date);
  const now = new Date();
  
  // Check if it's today
  const isToday = taskDate.toDateString() === now.toDateString();
  if (isToday) {
    return `Today, ${taskDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  }
  
  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = taskDate.toDateString() === yesterday.toDateString();
  if (isYesterday) {
    return `Yesterday, ${taskDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  }
  
  // Check if it's tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = taskDate.toDateString() === tomorrow.toDateString();
  if (isTomorrow) {
    return `Tomorrow, ${taskDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  }
  
  // For other dates, show full date
  return `${taskDate.toLocaleDateString('en-GB')}, ${taskDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
}

/**
 * Check if a date is in the past (for overdue checking)
 * @param date - The date to check
 * @returns true if the date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  const now = new Date();
  const checkDate = new Date(date);
  
  return checkDate < now;
}

/**
 * Get time remaining until due date
 * @param dueDate - The due date
 * @returns Object with time remaining information
 */
export function getTimeRemaining(dueDate: string | Date): {
  isOverdue: boolean;
  days: number;
  hours: number;
  minutes: number;
} {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  
  if (diffMs < 0) {
    return {
      isOverdue: true,
      days: 0,
      hours: 0,
      minutes: 0
    };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    isOverdue: false,
    days,
    hours,
    minutes
  };
}