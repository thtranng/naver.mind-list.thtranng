import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronDown, Clock, Trash2, List as ListIcon, Star, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const Sidebar: React.FC = () => {
  const { lists, activeListId, setActiveList } = useAppStore();
  const [systemListsOpen, setSystemListsOpen] = useState(true);
  const [userListsOpen, setUserListsOpen] = useState(true);

  const systemLists = [
    { id: 'all', name: 'All', icon: ListIcon, count: 12 },
    { id: 'important', name: 'Important', icon: Star, count: 3 },
    { id: 'today', name: 'Today', icon: Calendar, count: 5 },
    { id: 'completed', name: 'Completed', icon: CheckCircle, count: 24 },
  ];

  const pinnedLists = lists.filter(list => list.isPinned);

  return (
    <aside className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Quick Actions */}
        <div className="sidebar-section">
          <div className="space-y-3">
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add task</span>
            </button>
            
            <button className="btn-secondary w-full flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add list</span>
            </button>
          </div>
        </div>

        {/* System Lists */}
        <div className="sidebar-section">
          <button
            onClick={() => setSystemListsOpen(!systemListsOpen)}
            className="flex items-center justify-between w-full text-left sidebar-section-title hover:text-foreground transition-colors"
          >
            <span>System Lists</span>
            {systemListsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {systemListsOpen && (
            <div className="space-y-1">
              {systemLists.map((list) => {
                const Icon = list.icon;
                const isActive = activeListId === list.id;
                
                return (
                  <button
                    key={list.id}
                    onClick={() => setActiveList(list.id)}
                    className={`list-item w-full flex items-center justify-between ${
                      isActive ? 'list-item-active' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{list.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{list.count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Lists */}
        <div className="sidebar-section">
          <button
            onClick={() => setUserListsOpen(!userListsOpen)}
            className="flex items-center justify-between w-full text-left sidebar-section-title hover:text-foreground transition-colors"
          >
            <span>User name's Lists</span>
            {userListsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          
          {userListsOpen && (
            <div className="grid grid-cols-2 gap-3">
              {pinnedLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => setActiveList(list.id)}
                  className={`list-item p-4 flex flex-col items-center space-y-2 ${
                    activeListId === list.id ? 'list-item-active' : ''
                  }`}
                >
                  <div className="text-2xl">{list.icon}</div>
                  <div className="text-center">
                    <div className="font-semibold text-lg">{list.taskCount}</div>
                    <div className="text-sm text-muted-foreground">{list.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History & Recovery */}
        <div className="sidebar-section">
          <div className="space-y-1">
            <button className="list-item w-full flex items-center space-x-3">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Recently Edited</span>
            </button>
            
            <button className="list-item w-full flex items-center space-x-3">
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Recently Deleted</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings at bottom */}
      <div className="p-6 border-t border-sidebar-border">
        <button className="list-item w-full flex items-center space-x-3">
          <div className="w-4 h-4 border border-current rounded-sm"></div>
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;