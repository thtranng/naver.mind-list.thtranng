import React, { useState } from 'react';
import { X, Clock, RotateCcw } from 'lucide-react';
import { RepeatSettings } from '../../types/repeat';

interface TimeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: TimeSettings) => void;
  initialSettings?: TimeSettings;
}

export interface TimeSettings {
  time?: string;
  earlyReminder: 'none' | '10min' | '30min' | '1hour' | '1week' | '1month' | 'custom';
  customReminderValue?: number;
  customReminderUnit?: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
  repeatSettings?: RepeatSettings;
}

export function TimeSettingsModal({ isOpen, onClose, onSave, initialSettings }: TimeSettingsModalProps) {
  const [settings, setSettings] = useState<TimeSettings>({
    time: initialSettings?.time || '',
    earlyReminder: initialSettings?.earlyReminder || 'none',
    customReminderValue: initialSettings?.customReminderValue || 1,
    customReminderUnit: initialSettings?.customReminderUnit || 'hours',
    repeatSettings: initialSettings?.repeatSettings || {
      type: 'never',
      interval: 1,
      endType: 'never',
      isActive: true
    },
  });

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold">Time Settings</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
              />
            </div>

            {/* Early Reminder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Early Reminder
              </label>
              <select
                value={settings.earlyReminder}
                onChange={(e) => setSettings({ ...settings, earlyReminder: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
              >
                <option value="none">None</option>
                <option value="10min">10 minutes before</option>
                <option value="30min">30 minutes before</option>
                <option value="1hour">1 hour before</option>
                <option value="1week">1 week before</option>
                <option value="1month">1 month before</option>
                <option value="custom">Custom</option>
              </select>

              {settings.earlyReminder === 'custom' && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    value={settings.customReminderValue}
                    onChange={(e) => setSettings({ ...settings, customReminderValue: parseInt(e.target.value) })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
                    placeholder="Value"
                  />
                  <select
                    value={settings.customReminderUnit}
                    onChange={(e) => setSettings({ ...settings, customReminderUnit: e.target.value as any })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              )}
            </div>

            {/* Repeat Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <RotateCcw size={16} className="inline mr-1" />
                Lặp lại
              </label>
              <select
                value={settings.repeatSettings?.type || 'never'}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  repeatSettings: { 
                    ...settings.repeatSettings!, 
                    type: e.target.value as any 
                  } 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
              >
                <option value="never">Không lặp lại</option>
                <option value="hourly">Hàng giờ</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekdays">Các ngày trong tuần</option>
                <option value="weekends">Cuối tuần</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="yearly">Hàng năm</option>
              </select>
            </div>



            {/* End Repeat */}
            {settings.repeatSettings?.type !== 'never' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kết thúc lặp lại
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="endType"
                      value="never"
                      checked={settings.repeatSettings?.endType === 'never'}
                      onChange={() => setSettings({ 
                        ...settings, 
                        repeatSettings: { 
                          ...settings.repeatSettings!, 
                          endType: 'never' 
                        } 
                      })}
                      className="mr-2"
                    />
                    Lặp lại mãi mãi
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="endType"
                      value="date"
                      checked={settings.repeatSettings?.endType === 'date'}
                      onChange={() => setSettings({ 
                        ...settings, 
                        repeatSettings: { 
                          ...settings.repeatSettings!, 
                          endType: 'date' 
                        } 
                      })}
                      className="mr-2"
                    />
                    Kết thúc vào ngày
                  </label>
                  {settings.repeatSettings?.endType === 'date' && (
                    <input
                      type="date"
                      value={settings.repeatSettings?.endDate ? (settings.repeatSettings.endDate instanceof Date ? settings.repeatSettings.endDate.toISOString().split('T')[0] : new Date(settings.repeatSettings.endDate).toISOString().split('T')[0]) : ''}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        repeatSettings: { 
                          ...settings.repeatSettings!, 
                          endDate: new Date(e.target.value) 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue ml-6"
                    />
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-mind-list-primary-blue text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}