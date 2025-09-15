import React, { useState } from 'react';
import { Flag, AlertTriangle, RotateCcw } from 'lucide-react';
import { Task } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { AddTaskModal } from './AddTaskModal';
import { formatTaskDate, getDueDateTextClass } from '@/lib/dateUtils';

// Helper function to get repeat description
const getRepeatDescription = (repeat: string): string => {
  switch (repeat) {
    case 'hourly': return 'Hàng giờ';
    case 'daily': return 'Hàng ngày';
    case 'weekly': return 'Hàng tuần';
    case 'monthly': return 'Hàng tháng';
    case 'yearly': return 'Hàng năm';
    case 'weekdays': return 'Ngày làm việc';
    case 'weekends': return 'Cuối tuần';
    default: return 'Lặp lại';
  }
};

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { dispatch } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleToggleComplete = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: { isCompleted: !task.isCompleted }
      }
    });
  };

  // Calculate progress based on subtasks
  const calculateProgress = () => {
    if (!task.subTasks || task.subTasks.length === 0) {
      return task.isCompleted ? 100 : 0;
    }
    const completedSubtasks = task.subTasks.filter(subtask => subtask.isCompleted).length;
    return Math.round((completedSubtasks / task.subTasks.length) * 100);
  };

  const progress = calculateProgress();

  // Progress circle component
  const ProgressCircle = ({ progress }: { progress: number }) => {
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-7 h-7">
        <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 28 28">
          {/* Background circle */}
          <circle
            cx="14"
            cy="14"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="2"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="14"
            cy="14"
            r={radius}
            stroke={progress === 100 ? '#10b981' : '#3b82f6'}
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        {/* Progress text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">
            {progress}%
          </span>
        </div>
      </div>
    );
  };

  // Remove the old formatDate function as we're using the one from dateUtils

  return (
    <>
      <div className={`
        mind-list-task-item flex items-center gap-3 p-3
        ${task.isCompleted ? 'opacity-60' : ''}
      `}>
      <button
        onClick={handleToggleComplete}
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${task.isCompleted 
            ? 'bg-mind-list-primary-blue border-mind-list-primary-blue' 
            : 'border-gray-300 hover:border-mind-list-primary-blue'
          }
        `}
      >
        {task.isCompleted && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div 
        className="flex-1 cursor-pointer"
        onClick={() => setIsEditModalOpen(true)}
      >
        <div className={`
          font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}
        `}>
          {task.title}
        </div>
        {task.dueDate && (
          <div className={`text-sm mt-1 flex items-center gap-2 ${getDueDateTextClass(task.dueDate, task.isCompleted)}`}>
            <span>{formatTaskDate(task.dueDate)}</span>
            {(task.repeat && task.repeat !== 'never') || (task.timeSettings?.repeat && task.timeSettings.repeat !== 'never') ? (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full border border-blue-200">
                <RotateCcw size={12} className="text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">
                  {getRepeatDescription(task.repeat || task.timeSettings?.repeat || 'never')}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {task.priority === 'important' && (
          <Flag size={16} className="mind-list-priority-important" />
        )}
        {task.priority === 'urgent' && (
          <AlertTriangle size={16} className="mind-list-priority-urgent" />
        )}
        
        {/* Progress Circle - only show if task has subtasks */}
        {task.subTasks && task.subTasks.length > 0 ? (
          <ProgressCircle progress={progress} />
        ) : null}
      </div>
      </div>

      <AddTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
      />
    </>
  );
}