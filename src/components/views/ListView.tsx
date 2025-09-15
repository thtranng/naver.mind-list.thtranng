import React, { useState } from 'react';
import { QuickAddTask } from '../tasks/QuickAddTask';
import { TaskListHeader } from '../tasks/TaskListHeader';
import { TaskList } from '../tasks/TaskList';
import { AddTaskModal } from '../tasks/AddTaskModal';
import { GuestBanner } from '../ui/GuestBanner';
import { AuthModal } from '../auth/AuthModal';
import { useApp } from '@/contexts/AppContext';

export function ListView() {
  const { state, dispatch } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        <div className="flex-1 overflow-hidden p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Guest Banner - chỉ hiển thị cho guest users */}
            {!state.user && (
              <GuestBanner 
                onSignUpClick={handleSignUpClick}
                taskCount={state.tasks.length}
              />
            )}
            
            {!state.showTaskEditor && <QuickAddTask />}
            <TaskListHeader />
            <TaskList />
          </div>
        </div>
      </div>
      
      <AddTaskModal
        isOpen={state.showTaskEditor}
        onClose={() => dispatch({ type: 'SHOW_TASK_EDITOR', payload: false })}
      />
      
      {/* Auth Modal for guest banner */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}