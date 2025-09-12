import { Task, List, User } from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'User name',
  email: 'user@example.com',
  streak: 7,
  avatar: 'https://via.placeholder.com/40x40/1E3A8A/FFFFFF?text=U'
};

export const mockLists: List[] = [
  {
    id: 'list-1',
    name: 'Learning',
    icon: '📚',
    color: '#1E3A8A',
    isPinned: true,
    taskCount: 6
  },
  {
    id: 'list-2', 
    name: 'Entertainment',
    icon: '🎬',
    color: '#F97316',
    isPinned: true,
    taskCount: 2
  },
  {
    id: 'list-3',
    name: 'Working',
    icon: '💼',
    color: '#EF4444',
    isPinned: true,
    taskCount: 4
  },
  {
    id: 'list-4',
    name: 'For my pet',
    icon: '🐕',
    color: '#22C55E',
    isPinned: true,
    taskCount: 0
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Marketing report',
    note: '',
    isCompleted: false,
    dueDate: new Date(),
    priority: 'urgent',
    listId: 'list-3',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10')
  },
  {
    id: 'task-2', 
    title: 'Do Chemistry exercises',
    note: '',
    isCompleted: false,
    dueDate: new Date('2025-07-30'),
    priority: 'important',
    listId: 'list-1',
    createdAt: new Date('2025-01-09'),
    updatedAt: new Date('2025-01-09')
  },
  {
    id: 'task-3',
    title: 'Cardio',
    note: '',
    isCompleted: false,
    dueDate: new Date('2025-12-10'),
    repeat: 'daily',
    priority: 'important',
    listId: 'list-3',
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-08')
  },
  {
    id: 'task-4',
    title: 'Play FF with Chang',
    note: '',
    isCompleted: true,
    dueDate: new Date('2025-01-09'),
    priority: 'none',
    listId: 'list-2',
    createdAt: new Date('2025-01-07'),
    updatedAt: new Date('2025-01-09')
  }
];