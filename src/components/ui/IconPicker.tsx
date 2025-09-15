import React, { useState } from 'react';
import { X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onIconSelect: (iconName: string) => void;
  currentIcon?: string;
}

// Popular icons for lists
const popularIcons = [
  'List', 'CheckSquare', 'Calendar', 'Star', 'Heart', 'Home', 'User', 'Users',
  'Briefcase', 'ShoppingCart', 'Book', 'Music', 'Camera', 'Coffee', 'Car',
  'Plane', 'MapPin', 'Phone', 'Mail', 'Settings', 'Target', 'Trophy',
  'Gift', 'Lightbulb', 'Zap', 'Clock', 'Bell', 'Flag', 'Tag', 'Bookmark',
  'FileText', 'Folder', 'Archive', 'Download', 'Upload', 'Share2', 'Link',
  'Lock', 'Unlock', 'Eye', 'EyeOff', 'Search', 'Filter', 'Sort', 'Grid',
  'Layout', 'Maximize', 'Minimize', 'Plus', 'Minus', 'X', 'Check'
];

export function IconPicker({ isOpen, onClose, onIconSelect, currentIcon }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(currentIcon || 'List');

  if (!isOpen) return null;

  const filteredIcons = popularIcons.filter(iconName =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconClick = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleConfirm = () => {
    onIconSelect(selectedIcon);
    onClose();
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={20} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Choose an Icon</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Selected Icon Preview */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {renderIcon(selectedIcon)}
            </div>
            <div>
              <p className="font-medium">{selectedIcon}</p>
              <p className="text-sm text-gray-500">Selected icon</p>
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-6 gap-2">
            {filteredIcons.map((iconName) => {
              const isSelected = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  onClick={() => handleIconClick(iconName)}
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                    ${isSelected 
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }
                  `}
                  title={iconName}
                >
                  {renderIcon(iconName)}
                </button>
              );
            })}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No icons found for "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Select Icon
          </Button>
        </div>
      </div>
    </div>
  );
}