import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { SketchPicker } from 'react-color';
import {
  BookOpen24Regular,
  MusicNote124Regular,
  Briefcase24Regular,
  Heart24Regular,
  List24Regular,
  Home24Regular,
  Calendar24Regular,
  Star24Regular,
  Flag24Regular,
  Target24Regular,
  Trophy24Regular,
  Lightbulb24Regular,
  Camera24Regular,
  Gift24Regular,
  Airplane24Regular,
  Circle24Regular,
  Food24Regular,
  Games24Regular,
  ShoppingBag24Regular,
  Sport24Regular
} from '@fluentui/react-icons';
import { UserList } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface ListCustomizerProps {
  list: UserList;
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

// Available Fluent UI icons for selection
const availableIcons = [
  { name: 'BookOpen24Regular', component: BookOpen24Regular, label: 'Book' },
  { name: 'MusicNote124Regular', component: MusicNote124Regular, label: 'Music' },
  { name: 'Briefcase24Regular', component: Briefcase24Regular, label: 'Work' },
  { name: 'Heart24Regular', component: Heart24Regular, label: 'Heart' },
  { name: 'List24Regular', component: List24Regular, label: 'List' },
  { name: 'Home24Regular', component: Home24Regular, label: 'Home' },
  { name: 'Calendar24Regular', component: Calendar24Regular, label: 'Calendar' },
  { name: 'Star24Regular', component: Star24Regular, label: 'Star' },
  { name: 'Flag24Regular', component: Flag24Regular, label: 'Flag' },
  { name: 'Target24Regular', component: Target24Regular, label: 'Target' },
  { name: 'Trophy24Regular', component: Trophy24Regular, label: 'Trophy' },
  { name: 'Lightbulb24Regular', component: Lightbulb24Regular, label: 'Ideas' },
  { name: 'Camera24Regular', component: Camera24Regular, label: 'Camera' },
  { name: 'Gift24Regular', component: Gift24Regular, label: 'Gift' },
  { name: 'Airplane24Regular', component: Airplane24Regular, label: 'Travel' },
  { name: 'Circle24Regular', component: Circle24Regular, label: 'Circle' },
  { name: 'Food24Regular', component: Food24Regular, label: 'Food' },
  { name: 'Games24Regular', component: Games24Regular, label: 'Games' },
  { name: 'ShoppingBag24Regular', component: ShoppingBag24Regular, label: 'Shopping' },
  { name: 'Sport24Regular', component: Sport24Regular, label: 'Sports' }
];

export function ListCustomizer({ list, isOpen, onClose, anchorEl }: ListCustomizerProps) {
  const { dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState(list.color);
  const [selectedIconName, setSelectedIconName] = useState(list.iconName || 'List24Regular');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Filter icons based on search term
  const filteredIcons = availableIcons.filter(icon =>
    icon.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle icon selection
  const handleIconSelect = (iconName: string) => {
    setSelectedIconName(iconName);
    // Update list immediately (live preview)
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        id: list.id,
        updates: { iconName }
      }
    });
  };

  // Handle color change
  const handleColorChange = (color: any) => {
    const hexColor = color.hex;
    setSelectedColor(hexColor);
    // Update list immediately (live preview)
    dispatch({
      type: 'UPDATE_USER_LIST',
      payload: {
        id: list.id,
        updates: { color: hexColor }
      }
    });
  };

  // Close handler
  const handleClose = () => {
    onClose();
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorEl && !anchorEl.contains(event.target as Node)) {
        const popover = document.getElementById('list-customizer-popover');
        if (popover && !popover.contains(event.target as Node)) {
          handleClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, anchorEl]);

  if (!isOpen) return null;

  // Calculate popover position
  const getPopoverStyle = () => {
    if (!anchorEl) return {};
    
    const rect = anchorEl.getBoundingClientRect();
    return {
      position: 'fixed' as const,
      top: rect.top,
      left: rect.right + 8,
      zIndex: 1000
    };
  };

  return (
    <div
      id="list-customizer-popover"
      className="list-customizer-popover bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80"
      style={getPopoverStyle()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tùy chỉnh Danh sách</h3>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Icon Picker Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn Biểu tượng</h4>
        
        {/* Search bar */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm biểu tượng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Icon grid */}
        <div className="icon-grid grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
          {filteredIcons.map((icon) => {
            const IconComponent = icon.component;
            const isSelected = selectedIconName === icon.name;
            
            return (
              <button
                key={icon.name}
                onClick={() => handleIconSelect(icon.name)}
                className={`
                  p-2 rounded-md border-2 transition-all hover:bg-gray-50
                  ${
                    isSelected
                      ? 'icon-button-selected border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }
                `}
                title={icon.label}
              >
                <IconComponent width={20} height={20} className={isSelected ? 'text-blue-600' : 'text-gray-600'} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Picker Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn Màu sắc</h4>
        
        {/* Color preview button */}
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="color-preview-button w-full p-3 border border-gray-200 rounded-md flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm text-gray-700">{selectedColor}</span>
        </button>

        {/* Color picker */}
        {showColorPicker && (
          <div className="mt-3">
            <SketchPicker
              color={selectedColor}
              onChange={handleColorChange}
              disableAlpha
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}