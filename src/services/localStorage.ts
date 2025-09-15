// localStorage service for persistent data storage

const STORAGE_KEYS = {
  TASKS: 'mindlist_tasks',
  LISTS: 'mindlist_lists',
  USER_SETTINGS: 'mindlist_user_settings'
};

// Generic localStorage functions
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data, (key, value) => {
      // Handle Date objects
      if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
      }
      return value;
    });
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    
    const parsedData = JSON.parse(item, (key, value) => {
      // Handle Date objects
      if (value && typeof value === 'object' && value.__type === 'Date') {
        return new Date(value.value);
      }
      return value;
    });
    
    return parsedData;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Specific functions for tasks and lists
export const saveTasks = (tasks: any[]): void => {
  saveToLocalStorage(STORAGE_KEYS.TASKS, tasks);
};

export const loadTasks = (): any[] => {
  return loadFromLocalStorage(STORAGE_KEYS.TASKS, []);
};

export const saveLists = (lists: any[]): void => {
  saveToLocalStorage(STORAGE_KEYS.LISTS, lists);
};

export const loadLists = (): any[] => {
  return loadFromLocalStorage(STORAGE_KEYS.LISTS, []);
};

export const saveUserSettings = (settings: any): void => {
  saveToLocalStorage(STORAGE_KEYS.USER_SETTINGS, settings);
};

export const loadUserSettings = (): any => {
  return loadFromLocalStorage(STORAGE_KEYS.USER_SETTINGS, {});
};

// Clear all app data
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromLocalStorage(key);
  });
};

export { STORAGE_KEYS };