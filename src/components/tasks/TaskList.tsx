import React from 'react';
import { useAppStore } from '../../store/appStore';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
  const { tasks, activeFilter, activeListId } = useAppStore();

  const filteredTasks = tasks.filter(task => {
    // Filter by active list
    if (activeListId && activeListId !== 'all' && !['important', 'today', 'completed'].includes(activeListId)) {
      if (task.listId !== activeListId) return false;
    }

    // Filter by system lists
    if (activeListId === 'important' && task.priority === 'none') return false;
    if (activeListId === 'today') {
      const today = new Date();
      const taskDate = task.dueDate;
      if (!taskDate || taskDate.toDateString() !== today.toDateString()) return false;
    }
    if (activeListId === 'completed' && !task.isCompleted) return false;

    // Filter by quick filter
    switch (activeFilter) {
      case 'important':
        return task.priority !== 'none';
      case 'today':
        const today = new Date();
        return task.dueDate && task.dueDate.toDateString() === today.toDateString();
      case 'completed':
        return task.isCompleted;
      default:
        return true;
    }
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;