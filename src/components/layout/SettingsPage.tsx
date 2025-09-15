import React, { useState } from 'react';
import { X, User, Camera, Globe, Palette, Bell, ChevronRight } from 'lucide-react';
import { User as UserType } from '@/types';

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export function SettingsPage({ isOpen, onClose, user }: SettingsPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('VN');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [notificationSettings, setNotificationSettings] = useState({
    taskReminders: true,
    dailyDigest: false,
    weeklyReport: true,
    shareNotifications: true
  });

  if (!isOpen) return null;

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-8">
            {/* Quản lý tài khoản */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-gray-600" />
                Quản lý tài khoản
              </h3>
              <div className="space-y-4">
                {/* Thay đổi ảnh đại diện */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {user?.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Ảnh đại diện</p>
                      <p className="text-sm text-gray-600">Thay đổi ảnh đại diện của bạn</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Camera size={16} className="text-gray-600" />
                    Thay đổi
                  </button>
                </div>

                {/* Thay đổi thông tin cá nhân */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Thông tin cá nhân</h4>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Chỉnh sửa
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                      <input 
                        type="text" 
                        value={user?.name || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quản lý giao diện hiển thị */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Palette size={20} className="text-gray-600" />
                Quản lý giao diện hiển thị
              </h3>
              <div className="space-y-4">
                {/* Ngôn ngữ */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe size={16} className="text-gray-600" />
                      <h4 className="font-medium text-gray-900">Ngôn ngữ</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedLanguage('EN')}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedLanguage === 'EN'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setSelectedLanguage('VN')}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedLanguage === 'VN'
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                  </div>
                </div>

                {/* Màu sắc chủ đạo */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette size={16} className="text-gray-600" />
                    <h4 className="font-medium text-gray-900">Màu sắc chủ đạo</h4>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-gray-900 scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Màu tùy chỉnh</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trung tâm quản lý thông báo */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Bell size={20} className="text-gray-600" />
                Trung tâm quản lý thông báo
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    {/* Task Reminders */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Nhắc nhở nhiệm vụ</p>
                        <p className="text-sm text-gray-600">Nhận thông báo khi nhiệm vụ sắp đến hạn</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.taskReminders}
                          onChange={() => handleNotificationChange('taskReminders')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Daily Digest */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Tóm tắt hàng ngày</p>
                        <p className="text-sm text-gray-600">Nhận email tóm tắt các nhiệm vụ hàng ngày</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.dailyDigest}
                          onChange={() => handleNotificationChange('dailyDigest')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Weekly Report */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Báo cáo hàng tuần</p>
                        <p className="text-sm text-gray-600">Nhận báo cáo tiến độ hàng tuần</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReport}
                          onChange={() => handleNotificationChange('weeklyReport')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Share Notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Thông báo chia sẻ</p>
                        <p className="text-sm text-gray-600">Nhận thông báo khi có người chia sẻ nhiệm vụ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.shareNotifications}
                          onChange={() => handleNotificationChange('shareNotifications')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}