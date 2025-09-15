import React from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  currentColor?: string;
}

// Predefined color palette
const colorPalette = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#8B5A2B', // Brown
  '#6B7280', // Gray
  '#1F2937', // Dark Gray
  '#059669', // Emerald
  '#7C3AED', // Violet
  '#DC2626', // Red Dark
  '#0891B2', // Sky
  '#65A30D'  // Green Dark
];

export function ColorPicker({ isOpen, onClose, onSelectColor, currentColor }: ColorPickerProps) {
  if (!isOpen) return null;

  const handleColorSelect = (color: string) => {
    onSelectColor(color);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Chọn màu sắc
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* Current Color Display */}
          {currentColor && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Màu hiện tại:</p>
              <div 
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: currentColor }}
              />
            </div>
          )}
          
          {/* Color Grid */}
          <div className="grid grid-cols-5 gap-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                  currentColor === color 
                    ? 'border-gray-800 ring-2 ring-gray-400' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Nhấp vào màu để áp dụng cho danh sách
            </p>
          </div>
        </div>
      </div>
    </>
  );
}