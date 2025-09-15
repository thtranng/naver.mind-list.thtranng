import React from 'react';
import { UserPlus, Star, Trophy, Gem, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuestCallToActionProps {
  onSignUpClick: () => void;
}

export function GuestCallToAction({ onSignUpClick }: GuestCallToActionProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-blue-200">
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Tạo tài khoản miễn phí để bắt đầu hành trình!
          </h3>
          <p className="text-gray-600 text-sm">
            Lưu giữ tiến độ và nhận những phần thưởng hấp dẫn
          </p>
        </div>
        
        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600">Lên cấp độ</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gem className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600">Mind Gems</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600">Thành tích</p>
          </div>
        </div>
        
        {/* Call to Action Button */}
        <Button 
          onClick={onSignUpClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Đăng ký ngay
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        {/* Note */}
        <p className="text-xs text-gray-500">
          🎉 Hoàn toàn miễn phí • Không cần thẻ tín dụng
        </p>
      </div>
    </div>
  );
}