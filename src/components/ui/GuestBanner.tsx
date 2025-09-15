import React, { useState } from 'react';
import { X, UserPlus, Shield, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface GuestBannerProps {
  onSignUpClick: () => void;
  taskCount?: number;
}

export function GuestBanner({ onSignUpClick, taskCount = 0 }: GuestBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getBannerMessage = () => {
    if (taskCount >= 5) {
      return {
        icon: <UserPlus className="w-5 h-5" />,
        title: "Bạn đang làm rất tốt!",
        message: "Tạo tài khoản để không bao giờ mất dữ liệu nhé?",
        variant: "success" as const
      };
    }
    
    return {
      icon: <Shield className="w-5 h-5" />,
      title: "💡 Đăng ký tài khoản miễn phí",
      message: "để lưu trữ an toàn và đồng bộ công việc của bạn trên mọi thiết bị!",
      variant: "info" as const
    };
  };

  const { icon, title, message, variant } = getBannerMessage();

  const bannerStyles = {
    info: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800",
    success: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800"
  };

  const buttonStyles = {
    info: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };

  return (
    <div className={`relative border rounded-lg p-4 mb-6 ${bannerStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={onSignUpClick}
            size="sm"
            className={`${buttonStyles[variant]} shadow-sm`}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Đăng ký ngay
          </Button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Features highlight */}
      <div className="mt-3 pt-3 border-t border-current/20">
        <div className="flex items-center justify-center space-x-6 text-xs opacity-75">
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Bảo mật cao</span>
          </div>
          <div className="flex items-center space-x-1">
            <RefreshCw className="w-3 h-3" />
            <span>Đồng bộ đa thiết bị</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserPlus className="w-3 h-3" />
            <span>Miễn phí 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}