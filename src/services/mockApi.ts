import { Task, UserList } from '@/types';
import { saveTasks, loadTasks, saveLists, loadLists } from './localStorage';

// Initialize data from localStorage or use default mock data
const defaultMockTasks: Task[] = [
  {
    id: '1',
    title: 'Thiết kế Landing Page',
    note: 'Tạo mockup và wireframe cho trang chủ',
    isCompleted: false,
    priority: 'important',
    listId: 'work',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Review UI Components',
    note: 'Kiểm tra và cập nhật các component trong design system',
    isCompleted: false,
    priority: 'urgent',
    listId: 'work',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Mua sắm cuối tuần',
    note: 'Mua thực phẩm và đồ dùng gia đình',
    isCompleted: true,
    priority: 'none',
    listId: 'personal',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '4',
    title: 'Học React Advanced',
    note: 'Hoàn thành khóa học về React hooks và context',
    isCompleted: false,
    priority: 'important',
    listId: 'learning',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '5',
    title: 'API Integration',
    note: 'Tích hợp API backend với frontend',
    isCompleted: false,
    priority: 'urgent',
    listId: 'work',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    dueDate: new Date('2024-01-10') // Overdue task for testing
  },
  {
    id: '6',
    title: 'Hoàn thành báo cáo',
    note: 'Nộp báo cáo cuối kỳ',
    isCompleted: false,
    priority: 'important',
    listId: 'work',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    dueDate: new Date('2025-01-20') // Future due date
  }
];

const defaultMockLists: UserList[] = [
  {
    id: 'work',
    name: 'Công việc',
    icon: 'Briefcase',
    color: '#3B82F6',
    isPinned: true,
    ownerId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'personal',
    name: 'Cá nhân',
    icon: 'Heart',
    color: '#EF4444',
    isPinned: true,
    ownerId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'learning',
    name: 'Học tập',
    icon: 'BookOpen',
    color: '#10B981',
    isPinned: false,
    ownerId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Load data from localStorage or use defaults
let mockTasks: Task[] = loadTasks();
let mockLists: UserList[] = loadLists();

// Initialize with default data if localStorage is empty
if (mockTasks.length === 0) {
  mockTasks = [...defaultMockTasks];
  saveTasks(mockTasks);
}

if (mockLists.length === 0) {
  mockLists = [...defaultMockLists];
  saveLists(mockLists);
}

interface SearchResult {
  tasks: (Task & { listName: string })[];
  lists: UserList[];
}

// Mock search API function
export const searchApi = async (query: string): Promise<SearchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return { tasks: [], lists: [] };
  }
  
  // Search tasks
  const matchingTasks = mockTasks
    .filter(task => {
      return task.title.toLowerCase().includes(searchTerm) ||
             (task.note && task.note.toLowerCase().includes(searchTerm)) ||
             (task.subTasks && task.subTasks.some(subTask => 
               subTask.title.toLowerCase().includes(searchTerm)
             ));
    })
    .map(task => {
      const list = mockLists.find(l => l.id === task.listId);
      return {
        ...task,
        listName: list?.name || 'Unknown List'
      };
    })
    .slice(0, 10); // Limit to 10 results
  
  // Search lists
  const matchingLists = mockLists
    .filter(list => 
      list.name.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5); // Limit to 5 results
  
  return {
    tasks: matchingTasks,
    lists: matchingLists
  };
};

// Task API functions
export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newTask: Task = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockTasks.push(newTask);
  saveTasks(mockTasks);
  return newTask;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...mockTasks[taskIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  mockTasks[taskIndex] = updatedTask;
  saveTasks(mockTasks);
  return updatedTask;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  mockTasks.splice(taskIndex, 1);
  saveTasks(mockTasks);
};

export const getTasks = async (): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockTasks];
};

export const getTask = async (taskId: string): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const task = mockTasks.find(task => task.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  
  return task;
};

// List API functions
export const getLists = async (): Promise<UserList[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockLists];
};

export const createList = async (listData: Omit<UserList, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserList> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newList: UserList = {
    ...listData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockLists.push(newList);
  saveLists(mockLists);
  return newList;
};

export const updateList = async (listId: string, updates: Partial<UserList>): Promise<UserList> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const listIndex = mockLists.findIndex(list => list.id === listId);
  if (listIndex === -1) {
    throw new Error('List not found');
  }
  
  const updatedList = {
    ...mockLists[listIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  mockLists[listIndex] = updatedList;
  saveLists(mockLists);
  return updatedList;
};

export const deleteList = async (listId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const listIndex = mockLists.findIndex(list => list.id === listId);
  if (listIndex === -1) {
    throw new Error('List not found');
  }
  
  mockLists.splice(listIndex, 1);
  saveLists(mockLists);
};

// Collaboration API functions
export const addCollaborator = async (taskId: string, email: string, permission: 'viewer' | 'commenter' | 'editor'): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock implementation - in real app, this would add collaborator to task
  console.log(`Added collaborator ${email} with ${permission} permission to task ${taskId}`);
};

export const removeCollaborator = async (taskId: string, userId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock implementation
  console.log(`Removed collaborator ${userId} from task ${taskId}`);
};

export const updateSharingSettings = async (taskId: string, settings: { isPublic: boolean; defaultPermission?: string }): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock implementation
  console.log(`Updated sharing settings for task ${taskId}:`, settings);
};

// User Profile API
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  level: number;
  mind_gems: number;
  unlocked_items: string[];
  avatar?: string;
}

// Mock user data
let mockUserProfile: UserProfile = {
  id: '1',
  username: 'Huyen Trang',
  email: 'huyentrang@example.com',
  level: 12,
  mind_gems: 1250,
  unlocked_items: [], // Initially no premium items unlocked
  avatar: undefined
};

// Load user profile from localStorage
const loadUserProfile = (): UserProfile => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return mockUserProfile;
};

// Save user profile to localStorage
const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }
};

// Initialize user profile
mockUserProfile = loadUserProfile();

export const getUserProfile = async (): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return { ...mockUserProfile };
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  mockUserProfile = { ...mockUserProfile, ...updates };
  saveUserProfile(mockUserProfile);
  return { ...mockUserProfile };
};

// Shop API
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'theme' | 'feature' | 'boost';
  icon: string;
}

export const shopItems: ShopItem[] = [
  {
    id: 'dark_mode_pro',
    name: 'Chủ đề Dark Mode Pro',
    description: 'Mở khóa tùy chỉnh màu sắc Header Gradient và các tính năng giao diện cao cấp',
    price: 500,
    category: 'theme',
    icon: '🎨'
  },
  {
    id: 'neon_glow_theme',
    name: 'Chủ đề Neon Glow',
    description: 'Hiệu ứng ánh sáng neon cho giao diện',
    price: 750,
    category: 'theme',
    icon: '✨'
  }
];

export const getShopItems = async (): Promise<ShopItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return shopItems;
};

export const purchaseItem = async (itemId: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const item = shopItems.find(i => i.id === itemId);
  if (!item) {
    return { success: false, message: 'Vật phẩm không tồn tại' };
  }
  
  if (mockUserProfile.unlocked_items.includes(itemId)) {
    return { success: false, message: 'Bạn đã sở hữu vật phẩm này' };
  }
  
  if (mockUserProfile.mind_gems < item.price) {
    return { success: false, message: 'Không đủ Mind Gems' };
  }
  
  // Deduct gems and add item
  mockUserProfile.mind_gems -= item.price;
  mockUserProfile.unlocked_items.push(itemId);
  saveUserProfile(mockUserProfile);
  
  return { success: true, message: `Đã mua thành công ${item.name}!` };
};

// Auth API functions
export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate logout API call
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  
  return { success: true, message: 'Logout successful' };
};

export const logoutAllDevices = async (): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate logout all devices API call
  localStorage.clear();
  
  return { success: true, message: 'Logged out from all devices' };
};

export const terminateSession = async (sessionId: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate session termination API call
  if (!sessionId || sessionId === 'current') {
    return { success: false, message: 'Cannot terminate current session' };
  }
  
  return { success: true, message: 'Session terminated successfully' };
};

// Notification settings API
export const updateNotificationSetting = async (notificationType: string, enabled: boolean): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate API call to update notification setting
  const settingsKey = 'notification_settings';
  const currentSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
  
  currentSettings[notificationType] = enabled;
  localStorage.setItem(settingsKey, JSON.stringify(currentSettings));
  
  return { success: true, message: 'Notification setting updated successfully' };
};

export const getNotificationSettings = async (): Promise<Record<string, boolean>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load notification settings from localStorage
  const settingsKey = 'notification_settings';
  const settings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
  
  return settings;
};

// Authentication API
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; user?: any; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple validation
  if (!email || !password) {
    return { success: false, message: 'Email và mật khẩu không được để trống' };
  }
  
  if (!email.includes('@')) {
    return { success: false, message: 'Email không hợp lệ' };
  }
  
  if (password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }
  
  // Mock successful login
  const userData = {
    id: Date.now().toString(),
    name: 'User',
    email: email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('User')}&background=3B82F6&color=fff`,
    unlockedItems: [],
    level: 1,
    experience: 0,
    coins: 100
  };
  
  return { success: true, user: userData, message: 'Đăng nhập thành công' };
};

export const signupUser = async (name: string, email: string, password: string, confirmPassword: string): Promise<{ success: boolean; user?: any; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return { success: false, message: 'Vui lòng điền đầy đủ thông tin' };
  }
  
  if (!email.includes('@')) {
    return { success: false, message: 'Email không hợp lệ' };
  }
  
  if (password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }
  
  if (password !== confirmPassword) {
    return { success: false, message: 'Mật khẩu xác nhận không khớp' };
  }
  
  // Mock successful signup
  const userData = {
    id: Date.now().toString(),
    name: name,
    email: email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
    unlockedItems: [],
    level: 1,
    experience: 0,
    coins: 100
  };
  
  return { success: true, user: userData, message: 'Đăng ký thành công' };
};

export const socialLogin = async (provider: 'google' | 'facebook' | 'github'): Promise<{ success: boolean; user?: any; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock successful social login
  const userData = {
    id: Date.now().toString(),
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    email: `user@${provider}.com`,
    avatar: `https://ui-avatars.com/api/?name=${provider}&background=3B82F6&color=fff`,
    unlockedItems: [],
    level: 1,
    experience: 0,
    coins: 100
  };
  
  return { success: true, user: userData, message: 'Đăng nhập thành công' };
};

// Data Export/Import API functions
export interface ExportDataResult {
  success: boolean;
  requestId?: string;
  message?: string;
}

export interface ImportDataResult {
  success: boolean;
  message?: string;
  importedItems?: {
    lists: number;
    tasks: number;
    settings: number;
  };
}

export const exportUserData = async (): Promise<ExportDataResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful export request
      resolve({
        success: true,
        requestId: 'export_' + Date.now(),
        message: 'Export request has been queued successfully'
      });
    }, 1000);
  });
};

export const importUserData = async (file: File): Promise<ImportDataResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate file type
      if (!file.name.endsWith('.json')) {
        reject(new Error('Only JSON files are supported'));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File size too large. Maximum 10MB allowed'));
        return;
      }

      // Simulate file reading and processing
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          
          // Validate data structure
          if (!data.lists || !Array.isArray(data.lists)) {
            reject(new Error('Invalid data format: missing lists array'));
            return;
          }

          // Simulate successful import
          resolve({
            success: true,
            message: 'Data imported successfully',
            importedItems: {
              lists: data.lists?.length || 0,
              tasks: data.lists?.reduce((total: number, list: any) => total + (list.tasks?.length || 0), 0) || 0,
              settings: data.settings ? 1 : 0
            }
          });
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    }, 2000);
  });
};

// Setup mock API endpoint
if (typeof window !== 'undefined') {
  // Create a mock fetch interceptor for all API endpoints
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';
    
    try {
      // Search endpoint
      if (url.includes('/api/search')) {
        const urlObj = new URL(url, window.location.origin);
        const query = urlObj.searchParams.get('q') || '';
        const result = await searchApi(query);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Tasks endpoints
      if (url.includes('/api/tasks')) {
        if (method === 'POST' && !url.includes('/')) {
          // Create task
          const taskData = JSON.parse(init?.body as string);
          const result = await createTask(taskData);
          return new Response(JSON.stringify(result), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (method === 'GET' && !url.includes('/')) {
          // Get all tasks
          const result = await getTasks();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const taskIdMatch = url.match(/\/api\/tasks\/([^/]+)/);
        if (taskIdMatch) {
          const taskId = taskIdMatch[1];
          
          if (method === 'PUT') {
            // Update task
            const updates = JSON.parse(init?.body as string);
            const result = await updateTask(taskId, updates);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          if (method === 'DELETE') {
            // Delete task
            await deleteTask(taskId);
            return new Response(null, { status: 204 });
          }
          
          if (method === 'GET') {
            // Get single task
            const result = await getTask(taskId);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Collaboration endpoints
          if (url.includes('/collaborators') && method === 'POST') {
            const { email, permission } = JSON.parse(init?.body as string);
            await addCollaborator(taskId, email, permission);
            return new Response(null, { status: 201 });
          }
          
          if (url.includes('/sharing-settings') && method === 'PUT') {
            const settings = JSON.parse(init?.body as string);
            await updateSharingSettings(taskId, settings);
            return new Response(null, { status: 200 });
          }
        }
      }
      
      // Lists endpoints
      if (url.includes('/api/lists')) {
        if (method === 'POST') {
          // Create list
          const listData = JSON.parse(init?.body as string);
          const result = await createList(listData);
          return new Response(JSON.stringify(result), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (method === 'GET') {
          // Get all lists
          const result = await getLists();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const listIdMatch = url.match(/\/api\/lists\/([^/]+)/);
        if (listIdMatch) {
          const listId = listIdMatch[1];
          
          if (method === 'PUT') {
            // Update list
            const updates = JSON.parse(init?.body as string);
            const result = await updateList(listId, updates);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          if (method === 'DELETE') {
            // Delete list
            await deleteList(listId);
            return new Response(null, { status: 204 });
          }
        }
      }
      
      // User Profile endpoints
      if (url.includes('/api/user/profile')) {
        if (method === 'GET') {
          const result = await getUserProfile();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (method === 'PUT') {
          const updates = JSON.parse(init?.body as string);
          const result = await updateUserProfile(updates);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Shop endpoints
      if (url.includes('/api/shop')) {
        if (url.includes('/items') && method === 'GET') {
          const result = await getShopItems();
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (url.includes('/purchase') && method === 'POST') {
          const { itemId } = JSON.parse(init?.body as string);
          const result = await purchaseItem(itemId);
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
    } catch (error) {
      return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For all other requests, use the original fetch
    return originalFetch(input, init);
  };
}