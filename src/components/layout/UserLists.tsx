import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, List, Plus } from 'lucide-react';
import { PinnedListCard } from './PinnedListCard';
import { UnpinnedListItem } from './UnpinnedListItem';
import { useApp } from '@/contexts/AppContext';
import { UserList } from '@/types';

export function UserLists() {
  const [showUnpinnedDropdown, setShowUnpinnedDropdown] = useState(false);
  const [newListName, setNewListName] = useState('');
  const { state, dispatch } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  const pinnedLists = state.userLists.filter(list => list.isPinned && !list.isDeleted);
  const unpinnedLists = state.userLists.filter(list => !list.isPinned && !list.isDeleted);

  // Auto-focus when input appears
  useEffect(() => {
    if (state.showAddListInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.showAddListInput]);

  const handleCreateList = () => {
    if (newListName.trim()) {
      const now = new Date();
      const newList: UserList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        icon: 'List',
        color: '#3B82F6', // Default blue color
        isPinned: true,
        ownerId: state.user?.id || '1',
        taskCount: 0,
        createdAt: now,
        updatedAt: now
      };
      
      dispatch({ type: 'ADD_USER_LIST', payload: newList });
      dispatch({ type: 'SET_SELECTED_LIST', payload: newList.id });
      setNewListName('');
      dispatch({ type: 'SHOW_ADD_LIST_INPUT', payload: false });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  const handleBlur = () => {
    if (newListName.trim()) {
      handleCreateList();
    } else {
      setNewListName('');
      dispatch({ type: 'SHOW_ADD_LIST_INPUT', payload: false });
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with dropdown functionality for unpinned lists */}
      <button
        onClick={() => setShowUnpinnedDropdown(!showUnpinnedDropdown)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          <List size={16} className="text-gray-600" />
          <span className="font-medium text-gray-900">
            {state.user ? `${state.user.name}'s Lists` : 'Lists'}
          </span>
        </div>
        {unpinnedLists.length > 0 && (
          <div className="flex items-center">
            {showUnpinnedDropdown ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            )}
          </div>
        )}
      </button>

      {/* Pinned Lists - Always visible directly under header */}
      {pinnedLists.length > 0 && (
        <div className="ml-6 space-y-1">
          {pinnedLists.map((list) => (
            <PinnedListCard key={list.id} listData={list} />
          ))}
        </div>
      )}
      
      {/* Unpinned Lists Dropdown - Only visible when clicked */}
      {showUnpinnedDropdown && unpinnedLists.length > 0 && (
        <div className="ml-6 space-y-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
          {unpinnedLists.map((list) => (
            <UnpinnedListItem key={list.id} listData={list} />
          ))}
        </div>
      )}
      
      {/* Add List Input Field */}
      {state.showAddListInput && (
        <div className="flex items-center gap-3 p-2 rounded-lg border border-blue-200 bg-blue-50 ml-6">
          <Plus size={16} className="text-blue-600" />
          <input
            ref={inputRef}
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            placeholder="New list name"
            className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
          />
        </div>
      )}
    </div>
  );
}