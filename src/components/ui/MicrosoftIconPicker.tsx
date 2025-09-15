import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface MicrosoftIconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onIconSelect: (iconName: string) => void;
}

// Microsoft Fluent UI Icons (emoji-style)
const microsoftIcons = [
  { name: '😀', code: '😀', category: 'Faces' },
  { name: '😃', code: '😃', category: 'Faces' },
  { name: '😄', code: '😄', category: 'Faces' },
  { name: '😁', code: '😁', category: 'Faces' },
  { name: '😆', code: '😆', category: 'Faces' },
  { name: '😅', code: '😅', category: 'Faces' },
  { name: '😂', code: '😂', category: 'Faces' },
  { name: '🤣', code: '🤣', category: 'Faces' },
  { name: '😊', code: '😊', category: 'Faces' },
  { name: '😇', code: '😇', category: 'Faces' },
  { name: '🙂', code: '🙂', category: 'Faces' },
  { name: '🙃', code: '🙃', category: 'Faces' },
  { name: '😉', code: '😉', category: 'Faces' },
  { name: '😌', code: '😌', category: 'Faces' },
  { name: '😍', code: '😍', category: 'Faces' },
  { name: '🥰', code: '🥰', category: 'Faces' },
  { name: '😘', code: '😘', category: 'Faces' },
  { name: '😗', code: '😗', category: 'Faces' },
  { name: '😙', code: '😙', category: 'Faces' },
  { name: '😚', code: '😚', category: 'Faces' },
  { name: '🤗', code: '🤗', category: 'Faces' },
  { name: '🤩', code: '🤩', category: 'Faces' },
  { name: '🤔', code: '🤔', category: 'Faces' },
  { name: '🤨', code: '🤨', category: 'Faces' },
  { name: '😐', code: '😐', category: 'Faces' },
  { name: '😑', code: '😑', category: 'Faces' },
  { name: '😶', code: '😶', category: 'Faces' },
  { name: '😏', code: '😏', category: 'Faces' },
  { name: '😒', code: '😒', category: 'Faces' },
  { name: '🙄', code: '🙄', category: 'Faces' },
  { name: '😬', code: '😬', category: 'Faces' },
  { name: '🤥', code: '🤥', category: 'Faces' },
  { name: '😔', code: '😔', category: 'Faces' },
  { name: '😪', code: '😪', category: 'Faces' },
  { name: '🤤', code: '🤤', category: 'Faces' },
  { name: '😴', code: '😴', category: 'Faces' },
  { name: '😷', code: '😷', category: 'Faces' },
  { name: '🤒', code: '🤒', category: 'Faces' },
  { name: '🤕', code: '🤕', category: 'Faces' },
  { name: '🤢', code: '🤢', category: 'Faces' },
  { name: '🤮', code: '🤮', category: 'Faces' },
  { name: '🤧', code: '🤧', category: 'Faces' },
  { name: '🥵', code: '🥵', category: 'Faces' },
  { name: '🥶', code: '🥶', category: 'Faces' },
  { name: '🥴', code: '🥴', category: 'Faces' },
  { name: '😵', code: '😵', category: 'Faces' },
  { name: '🤯', code: '🤯', category: 'Faces' },
  { name: '🤠', code: '🤠', category: 'Faces' },
  { name: '🥳', code: '🥳', category: 'Faces' },
  { name: '😎', code: '😎', category: 'Faces' },
  { name: '🤓', code: '🤓', category: 'Faces' },
  { name: '🧐', code: '🧐', category: 'Faces' },
  { name: '😕', code: '😕', category: 'Faces' },
  { name: '😟', code: '😟', category: 'Faces' },
  { name: '🙁', code: '🙁', category: 'Faces' },
  { name: '☹️', code: '☹️', category: 'Faces' },
  { name: '😮', code: '😮', category: 'Faces' },
  { name: '😯', code: '😯', category: 'Faces' },
  { name: '😲', code: '😲', category: 'Faces' },
  { name: '😳', code: '😳', category: 'Faces' },
  { name: '🥺', code: '🥺', category: 'Faces' },
  { name: '😦', code: '😦', category: 'Faces' },
  { name: '😧', code: '😧', category: 'Faces' },
  { name: '😨', code: '😨', category: 'Faces' },
  { name: '😰', code: '😰', category: 'Faces' },
  { name: '😥', code: '😥', category: 'Faces' },
  { name: '😢', code: '😢', category: 'Faces' },
  { name: '😭', code: '😭', category: 'Faces' },
  { name: '😱', code: '😱', category: 'Faces' },
  { name: '😖', code: '😖', category: 'Faces' },
  { name: '😣', code: '😣', category: 'Faces' },
  { name: '😞', code: '😞', category: 'Faces' },
  { name: '😓', code: '😓', category: 'Faces' },
  { name: '😩', code: '😩', category: 'Faces' },
  { name: '😫', code: '😫', category: 'Faces' },
  { name: '🥱', code: '🥱', category: 'Faces' },
  { name: '😤', code: '😤', category: 'Faces' },
  { name: '😡', code: '😡', category: 'Faces' },
  { name: '😠', code: '😠', category: 'Faces' },
  { name: '🤬', code: '🤬', category: 'Faces' },
  { name: '😈', code: '😈', category: 'Faces' },
  { name: '👿', code: '👿', category: 'Faces' },
  { name: '💀', code: '💀', category: 'Faces' },
  { name: '☠️', code: '☠️', category: 'Faces' },
  { name: '💩', code: '💩', category: 'Faces' },
  { name: '🤡', code: '🤡', category: 'Faces' },
  { name: '👹', code: '👹', category: 'Faces' },
  { name: '👺', code: '👺', category: 'Faces' },
  { name: '👻', code: '👻', category: 'Faces' },
  { name: '👽', code: '👽', category: 'Faces' },
  { name: '👾', code: '👾', category: 'Faces' },
  { name: '🤖', code: '🤖', category: 'Faces' },
  { name: '🎃', code: '🎃', category: 'Objects' },
  { name: '😺', code: '😺', category: 'Animals' },
  { name: '😸', code: '😸', category: 'Animals' },
  { name: '😹', code: '😹', category: 'Animals' },
  { name: '😻', code: '😻', category: 'Animals' },
  { name: '😼', code: '😼', category: 'Animals' },
  { name: '😽', code: '😽', category: 'Animals' },
  { name: '🙀', code: '🙀', category: 'Animals' },
  { name: '😿', code: '😿', category: 'Animals' },
  { name: '😾', code: '😾', category: 'Animals' },
  { name: '❤️', code: '❤️', category: 'Hearts' },
  { name: '🧡', code: '🧡', category: 'Hearts' },
  { name: '💛', code: '💛', category: 'Hearts' },
  { name: '💚', code: '💚', category: 'Hearts' },
  { name: '💙', code: '💙', category: 'Hearts' },
  { name: '💜', code: '💜', category: 'Hearts' },
  { name: '🖤', code: '🖤', category: 'Hearts' },
  { name: '🤍', code: '🤍', category: 'Hearts' },
  { name: '🤎', code: '🤎', category: 'Hearts' },
  { name: '💔', code: '💔', category: 'Hearts' },
  { name: '❣️', code: '❣️', category: 'Hearts' },
  { name: '💕', code: '💕', category: 'Hearts' },
  { name: '💞', code: '💞', category: 'Hearts' },
  { name: '💓', code: '💓', category: 'Hearts' },
  { name: '💗', code: '💗', category: 'Hearts' },
  { name: '💖', code: '💖', category: 'Hearts' },
  { name: '💘', code: '💘', category: 'Hearts' },
  { name: '💝', code: '💝', category: 'Hearts' },
  { name: '💟', code: '💟', category: 'Hearts' }
];

const categories = ['All', 'Faces', 'Hearts', 'Animals', 'Objects'];

export function MicrosoftIconPicker({ isOpen, onClose, onIconSelect }: MicrosoftIconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIcon, setSelectedIcon] = useState('');

  if (!isOpen) return null;

  const filteredIcons = microsoftIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleIconClick = (iconCode: string) => {
    setSelectedIcon(iconCode);
  };

  const handleConfirm = () => {
    if (selectedIcon) {
      onIconSelect(selectedIcon);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Microsoft Icons</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-600 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-8 gap-2">
            {filteredIcons.map((icon) => {
              const isSelected = selectedIcon === icon.code;
              return (
                <button
                  key={icon.name}
                  onClick={() => handleIconClick(icon.code)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-xl ${
                    isSelected
                      ? 'bg-blue-100 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  title={icon.name}
                >
                  {icon.code}
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedIcon}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select Icon
          </button>
        </div>
      </div>
    </div>
  );
}