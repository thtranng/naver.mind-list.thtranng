import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { DatePicker } from '../ui/date-picker';

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  dueDate?: Date;
  onDueDateChange: (date: Date | undefined) => void;
}

export function DateTimePicker({
  isOpen,
  onClose,
  dueDate,
  onDueDateChange
}: DateTimePickerProps) {

  if (!isOpen) return null;

  const handleDateSelect = (date: Date | undefined) => {
    onDueDateChange(date);
  };



  const quickDateOptions = [
    { label: 'Hôm nay', value: new Date() },
    { label: 'Ngày mai', value: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { label: 'Tuần tới', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Đặt ngày</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-4">
            {/* Quick date options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Chọn nhanh</h4>
              <div className="grid grid-cols-3 gap-2">
                {quickDateOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleDateSelect(option.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date picker */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Chọn ngày cụ thể</h4>
              <DatePicker
                date={dueDate}
                onDateChange={handleDateSelect}
                placeholder="Chọn ngày"
              />
            </div>

            {/* Clear date */}
            {dueDate && (
              <button
                onClick={() => onDueDateChange(undefined)}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <X size={16} />
                Xóa ngày hạn
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-mind-list-primary-blue rounded-md hover:bg-blue-600 transition-colors"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
}