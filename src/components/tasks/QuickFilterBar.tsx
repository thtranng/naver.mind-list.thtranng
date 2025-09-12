import React from 'react';
import { useAppStore } from '../../store/appStore';
import { FilterMode } from '../../types';

const QuickFilterBar: React.FC = () => {
  const { activeFilter, setActiveFilter } = useAppStore();

  const filters: { id: FilterMode; label: string; color?: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'important', label: 'Important', color: 'text-priority-important' },
    { id: 'today', label: 'Today', color: 'text-blue-600' },
    { id: 'completed', label: 'Completed', color: 'text-success' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`btn-pill ${
            activeFilter === filter.id ? 'btn-pill-active' : 'btn-pill-inactive'
          } ${filter.color || ''}`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default QuickFilterBar;