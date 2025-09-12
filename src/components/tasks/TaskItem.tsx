import React from 'react';
import { Flag, AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';
import { Task } from '../../types';
import { useAppStore } from '../../store/appStore';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskCompletion } = useAppStore();

  const formatTaskDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'HH:mm')}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy, HH:mm');
    }
  };

  const getPriorityIcon = () => {
    if (task.priority === 'urgent') {
      return <AlertTriangle className="w-4 h-4 text-priority-urgent" />;
    } else if (task.priority === 'important') {
      return <Flag className="w-4 h-4 text-priority-important" />;
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <button
          onClick={() => toggleTaskCompletion(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.isCompleted ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <div className="w-5 h-5 border-2 border-border rounded-full hover:border-primary transition-colors"></div>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium ${task.isCompleted ? 'task-completed' : ''}`}>
                {task.title}
              </h3>
              
              {(task.dueDate || task.repeat) && (
                <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                  {task.dueDate && (
                    <span>{formatTaskDate(task.dueDate)}</span>
                  )}
                  {task.repeat && (
                    <div className="flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3" />
                      <span>every {task.repeat.replace('ly', '')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Priority indicator */}
            <div className="flex-shrink-0 ml-4">
              {getPriorityIcon()}
            </div>
          </div>

          {task.note && (
            <p className="text-sm text-muted-foreground mt-2">{task.note}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;