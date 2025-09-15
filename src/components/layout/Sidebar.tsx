import React from 'react';
import { X } from 'lucide-react';
import { QuickActions } from './QuickActions';
import { SystemLists } from './SystemLists';
import { UserLists } from './UserLists';
import { HistoryRecovery } from './HistoryRecovery';


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-80 mind-list-sidebar
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
          <QuickActions />
        <SystemLists />
          <UserLists />
          <HistoryRecovery />
        </div>
      </aside>
    </>
  );
}