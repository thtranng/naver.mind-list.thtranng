import { SystemActivity, Task } from '../types';

export interface ActivityTracker {
  trackTaskChange(taskId: string, field: string, oldValue: any, newValue: any, userId: string, userName: string): SystemActivity;
  trackTaskCreation(task: Task, userId: string, userName: string): SystemActivity;
  trackTaskDeletion(task: Task, userId: string, userName: string): SystemActivity;
  trackAssigneeChange(taskId: string, oldAssignee: string | null, newAssignee: string | null, userId: string, userName: string): SystemActivity;
  trackStatusChange(taskId: string, oldStatus: string, newStatus: string, userId: string, userName: string): SystemActivity;
  trackPriorityChange(taskId: string, oldPriority: string, newPriority: string, userId: string, userName: string): SystemActivity;
  trackDueDateChange(taskId: string, oldDate: Date | null, newDate: Date | null, userId: string, userName: string): SystemActivity;
  trackSubTaskChange(taskId: string, subTaskTitle: string, action: 'added' | 'removed' | 'completed' | 'uncompleted', userId: string, userName: string): SystemActivity;
  trackAttachmentChange(taskId: string, fileName: string, action: 'added' | 'removed', userId: string, userName: string): SystemActivity;
}

class ActivityTrackerService implements ActivityTracker {
  private generateActivityId(): string {
    return `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatDate(date: Date | null): string {
    if (!date) return 'Không có';
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackTaskChange(taskId: string, field: string, oldValue: any, newValue: any, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'task_updated',
      details: {
        field,
        oldValue: String(oldValue),
        newValue: String(newValue),
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackTaskCreation(task: Task, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'task_created',
      details: {
        field: 'task',
        oldValue: '',
        newValue: task.title,
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackTaskDeletion(task: Task, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'task_deleted',
      details: {
        field: 'task',
        oldValue: task.title,
        newValue: '',
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackAssigneeChange(taskId: string, oldAssignee: string | null, newAssignee: string | null, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'assignee_changed',
      details: {
        field: 'assignee',
        oldValue: oldAssignee || 'Chưa giao',
        newValue: newAssignee || 'Chưa giao',
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackStatusChange(taskId: string, oldStatus: string, newStatus: string, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'status_changed',
      details: {
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus,
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackPriorityChange(taskId: string, oldPriority: string, newPriority: string, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'priority_changed',
      details: {
        field: 'priority',
        oldValue: oldPriority,
        newValue: newPriority,
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackDueDateChange(taskId: string, oldDate: Date | null, newDate: Date | null, userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: 'due_date_changed',
      details: {
        field: 'dueDate',
        oldValue: this.formatDate(oldDate),
        newValue: this.formatDate(newDate),
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackSubTaskChange(taskId: string, subTaskTitle: string, action: 'added' | 'removed' | 'completed' | 'uncompleted', userId: string, userName: string): SystemActivity {
    const actionMap: Record<typeof action, string> = {
      'added': 'subtask_added',
      'removed': 'subtask_removed',
      'completed': 'subtask_completed',
      'uncompleted': 'subtask_uncompleted'
    };

    return {
      id: this.generateActivityId(),
      type: 'system',
      action: actionMap[action] as SystemActivity['action'],
      details: {
        field: 'subTask',
        oldValue: action === 'added' ? '' : subTaskTitle,
        newValue: action === 'removed' ? '' : subTaskTitle,
        userId,
        userName
      },
      timestamp: new Date()
    };
  }

  trackAttachmentChange(taskId: string, fileName: string, action: 'added' | 'removed', userId: string, userName: string): SystemActivity {
    return {
      id: this.generateActivityId(),
      type: 'system',
      action: action === 'added' ? 'attachment_added' : 'attachment_removed',
      details: {
        field: 'attachment',
        oldValue: action === 'added' ? '' : fileName,
        newValue: action === 'removed' ? '' : fileName,
        userId,
        userName
      },
      timestamp: new Date()
    };
  }
}

// Singleton instance
export const activityTracker = new ActivityTrackerService();

// Hook for React components
export function useActivityTracker() {
  return activityTracker;
}

// Helper function to add activity to task
export function addActivityToTask(taskId: string, activity: SystemActivity) {
  // This would typically save to your backend/database
  // For now, we'll just log it
  console.log(`Activity added to task ${taskId}:`, activity);
  
  // In a real app, you might dispatch to a global state or call an API
  // Example:
  // dispatch({ type: 'ADD_ACTIVITY', payload: { taskId, activity } });
  // or
  // api.addTaskActivity(taskId, activity);
}

// Helper to track multiple changes at once
export function trackTaskUpdate(taskId: string, changes: Record<string, { oldValue: any; newValue: any }>, userId: string, userName: string): SystemActivity[] {
  const activities: SystemActivity[] = [];
  
  Object.entries(changes).forEach(([field, { oldValue, newValue }]) => {
    if (oldValue !== newValue) {
      let activity: SystemActivity;
      
      switch (field) {
        case 'status':
          activity = activityTracker.trackStatusChange(taskId, oldValue, newValue, userId, userName);
          break;
        case 'priority':
          activity = activityTracker.trackPriorityChange(taskId, oldValue, newValue, userId, userName);
          break;
        case 'dueDate':
          activity = activityTracker.trackDueDateChange(taskId, oldValue, newValue, userId, userName);
          break;
        case 'assignee':
          activity = activityTracker.trackAssigneeChange(taskId, oldValue, newValue, userId, userName);
          break;
        default:
          activity = activityTracker.trackTaskChange(taskId, field, oldValue, newValue, userId, userName);
      }
      
      activities.push(activity);
      addActivityToTask(taskId, activity);
    }
  });
  
  return activities;
}