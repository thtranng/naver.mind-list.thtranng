import React, { useState } from 'react';
import { Plus, Calendar, Clock, FileText, Trash2, Flag, AlertTriangle, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const QuickAddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const { addTask, lists } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        note: note.trim(),
        isCompleted: false,
        priority: 'none',
        listId: lists[0]?.id || 'default',
      });
      setTitle('');
      setNote('');
    }
  };

  const toolbarButtons = [
    { icon: Calendar, label: 'Set due date', onClick: () => {} },
    { icon: Clock, label: 'Set reminder', onClick: () => {} },
    { icon: FileText, label: 'Add note', onClick: () => {} },
    { icon: Plus, label: 'Add subtask', onClick: () => {} },
    { icon: Trash2, label: 'Delete', onClick: () => {} },
    { icon: Flag, label: 'Mark important', onClick: () => {}, color: 'text-priority-important' },
    { icon: AlertTriangle, label: 'Mark urgent', onClick: () => {}, color: 'text-priority-urgent' },
    { icon: X, label: 'Cancel', onClick: () => {} },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main input row */}
        <div className="flex items-start space-x-4">
          <div className="w-5 h-5 border-2 border-border rounded-full mt-1 flex-shrink-0"></div>
          
          <div className="flex-1 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add task"
              className="w-full text-lg font-medium bg-transparent border-none outline-none placeholder-muted-foreground"
            />
            
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note"
              className="w-full text-sm bg-transparent border-none outline-none placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.onClick}
                  className={`p-2 rounded-lg hover:bg-muted transition-colors ${
                    button.color || 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={button.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
          
          <button
            type="submit"
            disabled={!title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickAddTask;