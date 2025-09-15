import React from 'react';
import { X, Star, Gem } from 'lucide-react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RewardModal({ isOpen, onClose }: RewardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="text-center">
          {/* Celebration Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Star size={40} className="text-white fill-current" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Xuất sắc!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Bạn đã nắm được cách sử dụng Mind List rồi đó!
          </p>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phần thưởng của bạn:
            </h3>
            
            <div className="flex items-center justify-center gap-8">
              {/* XP Reward */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <span className="text-white font-bold text-lg">XP</span>
                </div>
                <div className="text-2xl font-bold text-green-600">+50</div>
                <div className="text-sm text-gray-600">Experience</div>
              </div>

              {/* Gems Reward */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Gem size={24} className="text-white fill-current" />
                </div>
                <div className="text-2xl font-bold text-purple-600">+10</div>
                <div className="text-sm text-gray-600">Mind Gems</div>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Star size={20} className="fill-current" />
              <span className="font-medium">Thành tựu mở khóa: "Người mới bắt đầu"</span>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            Tiếp tục khám phá Mind List! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}