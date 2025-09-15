import { useState, useMemo } from 'react';
import { Task } from '@/types';

export function useTaskFilter(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tasks;
    }

    const query = searchQuery.toLowerCase().trim();
    return tasks.filter(task => {
      // Search in task title
      if (task.title.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in task note/description
      if (task.note && task.note.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in subtasks
      if (task.subTasks && task.subTasks.some(subTask => 
        subTask.title.toLowerCase().includes(query)
      )) {
        return true;
      }
      
      return false;
    });
  }, [tasks, searchQuery]);

  const hasResults = filteredTasks.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredTasks,
    hasResults,
    isSearching
  };
}