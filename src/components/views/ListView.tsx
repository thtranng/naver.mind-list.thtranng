import React from 'react';
import QuickAddTask from '../tasks/QuickAddTask';
import QuickFilterBar from '../tasks/QuickFilterBar';
import TaskList from '../tasks/TaskList';
import { useAppStore } from '../../store/appStore';

const ListView: React.FC = () => {
  const { user } = useAppStore();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Quick Add Task */}
      <div className="mb-6">
        <QuickAddTask />
      </div>

      {/* List Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{user.name}'s Lists</h2>
      </div>

      {/* Quick Filter Bar */}
      <div className="mb-6">
        <QuickFilterBar />
      </div>

      {/* Task List */}
      <TaskList />
    </div>
  );
};

export default ListView;