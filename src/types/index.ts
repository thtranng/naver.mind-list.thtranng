// MIND LIST - Type definitions

export interface Task {
  id: string;
  title: string;
  note?: string;
  isCompleted: boolean;
  dueDate?: Date;
  reminder?: Date;
  repeat?: 'daily' | 'weekly' | 'monthly' | null;
  priority: 'none' | 'important' | 'urgent';
  listId: string;
  createdAt: Date;
  updatedAt: Date;
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface List {
  id: string;
  name: string;
  icon: string;
  color: string;
  isPinned: boolean;
  taskCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
}

export type ViewMode = 'list' | 'calendar' | 'analytics';
export type FilterMode = 'all' | 'important' | 'today' | 'completed';

export interface AppState {
  user: User;
  tasks: Task[];
  lists: List[];
  activeListId: string | null;
  activeFilter: FilterMode;
  activeView: ViewMode;
}