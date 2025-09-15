import React from 'react';
import { UserPlus, Sparkles, Trophy, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestCallToActionProps {
  onSignUpClick: () => void;
}

export function GuestCallToAction({ onSignUpClick }: GuestCallToActionProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mt-6">
      <div className="text-center space-y-4">
        {/* Icon and Title */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="p-2 bg-indigo-100 rounded-full">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Bắt đầu hành trình của bạn!</h3>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
          Tạo tài khoản miễn phí để bắt đầu hành trình, lưu giữ tiến độ và nhận những phần thưởng hấp dẫn!
        </p>
        
        {/* Features Preview */}
        <div className="flex justify-center gap-6 my-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Lên cấp</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gem className="w-4 h-4 text-purple-500" />
            <span>Mind Gems</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Thành tích</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={onSignUpClick}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          size="lg"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Đăng ký ngay
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          Hoàn toàn miễn phí • Không cần thẻ tín dụng
        </p>
      </div>
    </div>
  );
}