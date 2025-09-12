import { create } from 'zustand';
import { AppState, Task, List, FilterMode, ViewMode } from '../types';
import { mockTasks, mockLists, mockUser } from '../data/mockData';

interface AppStore extends AppState {
  // Actions
  setActiveView: (view: ViewMode) => void;
  setActiveFilter: (filter: FilterMode) => void;
  setActiveList: (listId: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addList: (list: Omit<List, 'id' | 'taskCount'>) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: mockUser,
  tasks: mockTasks,
  lists: mockLists,
  activeListId: null,
  activeFilter: 'all',
  activeView: 'list',

  // Actions
  setActiveView: (view: ViewMode) => set({ activeView: view }),
  
  setActiveFilter: (filter: FilterMode) => set({ activeFilter: filter }),
  
  setActiveList: (listId: string | null) => set({ activeListId: listId }),
  
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      tasks: [newTask, ...state.tasks],
      lists: state.lists.map(list => 
        list.id === newTask.listId 
          ? { ...list, taskCount: list.taskCount + 1 }
          : list
      )
    }));
  },
  
  toggleTaskCompletion: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
          : task
      )
    }));
  },
  
  updateTask: (taskId: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    }));
  },
  
  deleteTask: (taskId: string) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    
    if (task) {
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId),
        lists: state.lists.map(list => 
          list.id === task.listId 
            ? { ...list, taskCount: Math.max(0, list.taskCount - 1) }
            : list
        )
      }));
    }
  },
  
  addList: (listData) => {
    const newList: List = {
      ...listData,
      id: crypto.randomUUID(),
      taskCount: 0,
    };
    
    set((state) => ({
      lists: [...state.lists, newList]
    }));
  },
  
  updateList: (listId: string, updates: Partial<List>) => {
    set((state) => ({
      lists: state.lists.map(list =>
        list.id === listId ? { ...list, ...updates } : list
      )
    }));
  },
  
  deleteList: (listId: string) => {
    set((state) => ({
      lists: state.lists.filter(list => list.id !== listId),
      tasks: state.tasks.filter(task => task.listId !== listId),
      activeListId: state.activeListId === listId ? null : state.activeListId
    }));
  },
}));