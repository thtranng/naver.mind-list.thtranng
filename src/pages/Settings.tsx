import React, { useState } from 'react';
import { User, Palette, Bell, Zap, Link, Settings as SettingsIcon, LogOut, Shield, ChevronRight } from 'lucide-react';
import { AccountManagement } from '@/components/settings/AccountManagement';
import { InterfaceDisplay } from '@/components/settings/InterfaceDisplay';
import { NotificationManagement } from '@/components/settings/NotificationManagement';
import { SmartFeatures } from '@/components/settings/SmartFeatures';
import { Integrations } from '@/components/settings/Integrations';
import { Advanced } from '@/components/settings/Advanced';
import { Logout } from '@/components/settings/Logout';

import { useAuth } from '@/contexts/AuthContext';

type SettingsSection = 
  | 'account' 
  | 'interface' 
  | 'notifications' 
  | 'smart-features' 
  | 'integrations' 
  | 'advanced' 
  | 'logout';

interface MenuItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'account',
    label: 'Quản lý Tài khoản',
    icon: User,
    description: 'Thông tin cá nhân, bảo mật và phiên đăng nhập'
  },
  {
    id: 'interface',
    label: 'Giao diện & Hiển thị',
    icon: Palette,
    description: 'Ngôn ngữ, chế độ sáng/tối và tùy chỉnh giao diện'
  },
  {
    id: 'notifications',
    label: 'Quản lý Thông báo',
    icon: Bell,
    description: 'Kiểm soát các loại thông báo bạn nhận được'
  },
  {
    id: 'smart-features',
    label: 'Cài đặt Thông minh',
    icon: Zap,
    description: 'Tính năng tự động hóa và thông minh'
  },
  {
    id: 'integrations',
    label: 'Tích hợp',
    icon: Link,
    description: 'Kết nối với các dịch vụ bên thứ ba'
  },
  {
    id: 'advanced',
    label: 'Nâng cao',
    icon: Shield,
    description: 'Xuất dữ liệu và xóa tài khoản'
  },
  {
    id: 'logout',
    label: 'Đăng xuất',
    icon: LogOut,
    description: 'Thoát khỏi tài khoản hiện tại'
  }
];

export default function Settings() {
  const { isAuthenticated } = useAuth();

  // Filter menu items based on authentication status
  const getAvailableMenuItems = () => {
    if (!isAuthenticated) {
      // For guest users, only show interface, smart-features, and advanced
      return menuItems.filter(item =>
        ['interface', 'smart-features', 'advanced'].includes(item.id)
      );
    }
    // For authenticated users, show all items
    return menuItems;
  };

  const availableMenuItems = getAvailableMenuItems();

  // Set default active section based on authentication status
  const getDefaultSection = (): SettingsSection => {
    if (!isAuthenticated) {
      return 'interface'; // Default to interface for guest users
    }
    return 'account'; // Default to account for authenticated users
  };

  const [activeSection, setActiveSection] = useState<SettingsSection>(getDefaultSection());

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountManagement />;
      case 'interface':
        return <InterfaceDisplay />;
      case 'notifications':
        return <NotificationManagement />;
      case 'smart-features':
        return <SmartFeatures />;
      case 'integrations':
        return <Integrations />;
      case 'advanced':
        return <Advanced />;
      case 'logout':
        return <Logout />;
      default:
        return <AccountManagement />;
    }
  };

  return (
      <div className="h-full bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
            <p className="text-gray-600">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn</p>
          </div>

          <div className="flex gap-8">
            {/* Navigation Menu */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <nav className="p-2">
                  {availableMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.label}</div>
                          <div className="text-sm text-gray-500 truncate">{item.description}</div>
                        </div>
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform ${
                            isActive ? 'text-blue-600 rotate-90' : 'text-gray-400'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}