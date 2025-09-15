import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

// Predefined color palette for lists
const colorPalette = [
  { name: 'Blue', value: '#3B82F6', bg: 'bg-blue-500' },
  { name: 'Red', value: '#EF4444', bg: 'bg-red-500' },
  { name: 'Green', value: '#10B981', bg: 'bg-emerald-500' },
  { name: 'Yellow', value: '#F59E0B', bg: 'bg-amber-500' },
  { name: 'Purple', value: '#8B5CF6', bg: 'bg-violet-500' },
  { name: 'Pink', value: '#EC4899', bg: 'bg-pink-500' },
  { name: 'Indigo', value: '#6366F1', bg: 'bg-indigo-500' },
  { name: 'Teal', value: '#14B8A6', bg: 'bg-teal-500' },
  { name: 'Orange', value: '#F97316', bg: 'bg-orange-500' },
  { name: 'Cyan', value: '#06B6D4', bg: 'bg-cyan-500' },
  { name: 'Lime', value: '#84CC16', bg: 'bg-lime-500' },
  { name: 'Rose', value: '#F43F5E', bg: 'bg-rose-500' },
  { name: 'Slate', value: '#64748B', bg: 'bg-slate-500' },
  { name: 'Gray', value: '#6B7280', bg: 'bg-gray-500' },
  { name: 'Zinc', value: '#71717A', bg: 'bg-zinc-500' },
  { name: 'Stone', value: '#78716C', bg: 'bg-stone-500' }
];

export function ColorPicker({ isOpen, onClose, onColorSelect, currentColor }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor || '#3B82F6');

  if (!isOpen) return null;

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleConfirm = () => {
    onColorSelect(selectedColor);
    onClose();
  };

  const getCurrentColorName = () => {
    const color = colorPalette.find(c => c.value === selectedColor);
    return color ? color.name : 'Custom';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-80 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Choose a Color</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        {/* Selected Color Preview */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
            <div>
              <p className="font-medium">{getCurrentColorName()}</p>
              <p className="text-sm text-gray-500">{selectedColor}</p>
            </div>
          </div>
        </div>

        {/* Color Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-3">
            {colorPalette.map((color) => {
              const isSelected = selectedColor === color.value;
              return (
                <button
                  key={color.value}
                  onClick={() => handleColorClick(color.value)}
                  className={`
                    relative w-16 h-16 rounded-lg transition-all duration-200 border-2
                    ${isSelected 
                      ? 'border-gray-400 scale-105 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={`${color.name} (${color.value})`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check size={20} className="text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Select Color
          </Button>
        </div>
      </div>
    </div>
  );
}