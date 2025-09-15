import React from 'react';
import { Check, List, Flag, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface ListSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedListId: string;
  onSelectList: (listId: string) => void;
}

export function ListSelector({ isOpen, onClose, selectedListId, onSelectList }: ListSelectorProps) {
  const { state } = useApp();

  const systemLists = [
    { id: 'important', name: 'Quan trọng', icon: Flag },
    { id: 'today', name: 'Hôm nay', icon: Calendar },
    { id: 'completed', name: 'Hoàn thành', icon: CheckCircle },
  ];

  if (!isOpen) return null;

  const handleSelectList = (listId: string) => {
    onSelectList(listId);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
          Chọn danh sách
        </div>
        
        <div className="space-y-1">
          {/* All Tasks */}
          <button
            onClick={() => handleSelectList('all')}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
              <List size={12} className="text-white" />
            </div>
            <span className="flex-1 text-left">Tất cả công việc</span>
            {selectedListId === 'all' && (
              <Check size={16} className="text-blue-600" />
            )}
          </button>

          {/* User Lists */}
          {state.userLists.map((list) => (
            <button
              key={list.id}
              onClick={() => handleSelectList(list.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: list.color }}
              />
              <span className="flex-1 text-left">{list.name}</span>
              {selectedListId === list.id && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}

          {/* System Lists */}
          {systemLists.map((list) => (
            <button
              key={list.id}
              onClick={() => handleSelectList(list.id)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <list.icon size={12} className="text-gray-600" />
              </div>
              <span className="flex-1 text-left">{list.name}</span>
              {selectedListId === list.id && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}