import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';
import { Task, UserList } from '@/types';

interface SmartSearchBarProps {
  onLocalFilter?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SmartSearchBar({ 
  onLocalFilter, 
  placeholder = "Tìm kiếm...", 
  className = "" 
}: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [showGlobalPanel, setShowGlobalPanel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useApp();
  
  // Global search with 300ms debouncing
  const { searchResults, isLoading, error, hasSearched } = useGlobalSearch(query, 300);

  useEffect(() => {
    setShowClearButton(query.length > 0);
    setShowGlobalPanel(query.length > 0);
    if (onLocalFilter) {
      onLocalFilter(query);
    }
  }, [query, onLocalFilter]);
  
  // Handle click outside to close global panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowGlobalPanel(false);
      }
    };
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowGlobalPanel(false);
      }
    };
    
    if (showGlobalPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showGlobalPanel]);

  const handleClear = () => {
    setQuery('');
    setShowGlobalPanel(false);
    if (onLocalFilter) {
      onLocalFilter('');
    }
    inputRef.current?.focus();
  };
  
  const handleTaskClick = (taskId: string, listId: string) => {
    // Navigate to the specific task in its list
    dispatch({ type: 'SET_SELECTED_LIST', payload: listId });
    setShowGlobalPanel(false);
    setQuery('');
    if (onLocalFilter) {
      onLocalFilter('');
    }
  };
  
  const handleListClick = (listId: string) => {
    // Navigate to the specific list
    dispatch({ type: 'SET_SELECTED_LIST', payload: listId });
    setShowGlobalPanel(false);
    setQuery('');
    if (onLocalFilter) {
      onLocalFilter('');
    }
  };



  return (
    <div className={`relative ${className}`} ref={panelRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
        />
        {showClearButton && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Global Search Panel */}
      {showGlobalPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Đang tìm kiếm...
            </div>
          )}
          
          {error && (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          )}
          
          {!isLoading && !error && hasSearched && (
            <div className="p-2">
              {/* Tasks Section */}
              {searchResults.tasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 border-b border-gray-100">
                    Công việc ({searchResults.tasks.length})
                  </h3>
                  <div className="space-y-1">
                    {searchResults.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskClick(task.id, task.listId)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="font-medium text-gray-900 text-sm">{task.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Trong: {task.listName}
                        </div>
                        {task.note && (
                          <div className="text-xs text-gray-400 mt-1 truncate">
                            {task.note}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Lists Section */}
              {searchResults.lists.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 border-b border-gray-100">
                    Danh sách ({searchResults.lists.length})
                  </h3>
                  <div className="space-y-1">
                    {searchResults.lists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleListClick(list.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: list.color }}
                          ></div>
                          <span className="font-medium text-gray-900 text-sm">{list.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No Results */}
              {searchResults.tasks.length === 0 && searchResults.lists.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-sm">Không tìm thấy kết quả cho "{query}"</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Thử tìm kiếm với từ khóa khác
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}