import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, MoreHorizontal, Plus, Edit3, Palette, Share, Pin, PinOff, Trash2, Image } from 'lucide-react';
import { UserList } from '@/types';
import { useApp } from '@/contexts/AppContext';

import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';

interface ContextMenuProps {
  list: UserList;
  onClose: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function ContextMenu({ list, onClose, position = 'bottom-right' }: ContextMenuProps) {
  const { dispatch } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNewList = () => {
    dispatch({ type: 'SHOW_ADD_LIST_INPUT', payload: true });
    onClose();
  };



  const handleChangeIcon = () => {
    setIsIconPickerOpen(true);
    onClose(); // Close the context menu when opening icon picker
  };

  const handleIconSelect = (iconName: string) => {
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        id: list.id,
        updates: { icon: iconName }
      }
    });
    setIsIconPickerOpen(false);
  };

  const handleChangeColor = () => {
    setIsColorPickerOpen(true);
    onClose(); // Close the context menu when opening color picker
  };

  const handleColorSelect = (color: string) => {
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        id: list.id,
        updates: { color: color }
      }
    });
    setIsColorPickerOpen(false);
  };

  const handleNameChange = () => {
    // TODO: Implement name editor - Allow direct editing or popup
    const newName = prompt('Enter new list name:', list.name);
    if (newName && newName.trim() && newName.trim() !== list.name) {
      dispatch({
        type: 'UPDATE_USER_LIST',
        payload: {
          id: list.id,
          updates: { name: newName.trim() }
        }
      });
    }
    onClose();
  };

  const handleShare = () => {
    // TODO: Implement share functionality - Open popup/modal for sharing
    alert('Share functionality will be implemented');
    console.log('Share list:', list.id);
    onClose();
  };

  const handleTogglePin = () => {
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        id: list.id,
        updates: { isPinned: !list.isPinned }
      }
    });
    onClose();
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      dispatch({ type: 'DELETE_USER_LIST', payload: list.id });
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const menuItems = [
    {
      icon: Plus,
      label: 'New List',
      onClick: handleNewList,
      className: 'text-blue-600 hover:bg-blue-50'
    },

    {
      icon: Image,
      label: 'Thay đổi biểu tượng',
      onClick: handleChangeIcon,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      icon: Palette,
      label: 'Thay đổi màu sắc',
      onClick: handleChangeColor,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      icon: Edit3,
      label: 'Name change',
      onClick: handleNameChange,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      icon: Share,
      label: 'Share',
      onClick: handleShare,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      icon: list.isPinned ? PinOff : Pin,
      label: list.isPinned ? 'Unpin from Sidebar' : 'Pin to Sidebar',
      onClick: handleTogglePin,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      icon: Trash2,
      label: showDeleteConfirm ? 'Confirm Delete?' : 'Delete',
      onClick: handleDelete,
      className: showDeleteConfirm ? 'text-red-600 hover:bg-red-50 font-medium' : 'text-red-600 hover:bg-red-50'
    }
  ];

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'absolute left-0 top-8 z-50';
      case 'top-right':
        return 'absolute right-0 bottom-8 z-50';
      case 'top-left':
        return 'absolute left-0 bottom-8 z-50';
      default:
        return 'absolute right-0 top-8 z-50';
    }
  };

  return (
    <>
      <div 
        ref={menuRef}
        className={`${getPositionClasses()} w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1`}
        onClick={(e) => e.stopPropagation()}
      >
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${item.className}`}
            >
              <IconComponent size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      

       
       <IconPicker
         isOpen={isIconPickerOpen}
         onClose={() => setIsIconPickerOpen(false)}
         onSelectIcon={handleIconSelect}
         currentIcon={list.icon}
       />
       
       <ColorPicker
         isOpen={isColorPickerOpen}
         onClose={() => setIsColorPickerOpen(false)}
         onSelectColor={handleColorSelect}
         currentColor={list.color}
       />
     </>
   );
}

interface ContextMenuTriggerProps {
  list: UserList;
  children?: React.ReactNode;
  className?: string;
}

export function ContextMenuTrigger({ list, children, className = '' }: ContextMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${className}`}
      >
        {children || <MoreHorizontal size={16} className="text-gray-500" />}
      </button>
      
      {isOpen && (
        <ContextMenu 
          list={list} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}