import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddTaskModal } from './AddTaskModal';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function QuickAddTask() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state: onboardingState } = useOnboarding();
  
  const isHighlighted = onboardingState.isActive && onboardingState.currentStep === 'first_task_creation';

  return (
    <>
      <div 
        id="quick-add-task"
        className={`bg-white rounded-lg border p-4 transition-all duration-300 ${
          isHighlighted 
            ? 'border-blue-400 shadow-lg shadow-blue-200 animate-pulse' 
            : 'border-gray-200'
        }`}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full flex items-center gap-3 text-left rounded-lg p-2 transition-all duration-300 ${
            isHighlighted 
              ? 'bg-blue-50 hover:bg-blue-100 text-blue-700' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
          <span className="flex-1 text-lg font-medium text-gray-400">
            Add task
          </span>
          <Plus size={16} className="text-gray-400" />
        </button>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}