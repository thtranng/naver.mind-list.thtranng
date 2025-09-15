import React, { useState, useEffect } from 'react';
import { Heart, AlertTriangle, Clock, Gem } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { StreakProtectionService } from '@/services/streakProtectionService';

interface StreakRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousStreak: number;
}

export const StreakRepairModal: React.FC<StreakRepairModalProps> = ({
  isOpen,
  onClose,
  previousStreak
}) => {
  const { state, dispatch } = useApp();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lấy thông tin ưu đãi sửa chữa
  const repairOffer = StreakProtectionService.getStreakRepairOffer(previousStreak);

  useEffect(() => {
    if (!isOpen || !repairOffer) return;

    // Tính thời gian còn lại (48 giờ từ khi chuỗi bị đứt)
    const updateTimeLeft = () => {
      const now = Date.now();
      const remaining = repairOffer.expiresAt - now;
      setTimeLeft(Math.max(0, remaining));
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [isOpen, repairOffer]);

  const formatTimeLeft = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRepairStreak = async () => {
    if (!repairOffer || state.gamification.mindGems < repairOffer.cost) {
      toast.error('Không đủ Mind Gems để sửa chữa chuỗi ngày!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Sử dụng service để sửa chữa chuỗi
      const result = StreakProtectionService.repairStreak(previousStreak, repairOffer.cost);
      
      if (result.success) {
        // Dispatch action để cập nhật state
        dispatch({
          type: 'REPAIR_STREAK',
          payload: undefined
        });
        
        toast.success(`🎉 Chuỗi ngày đã được khôi phục thành công! Chuỗi hiện tại: ${result.restoredStreak} ngày`);
        onClose();
      } else {
        toast.error(result.message || 'Có lỗi xảy ra khi sửa chữa chuỗi ngày!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi sửa chữa chuỗi ngày!');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!repairOffer || timeLeft <= 0) {
    return null;
  }

  const canAfford = state.gamification.mindGems >= repairOffer.cost;
  const progressPercentage = ((48 * 60 * 60 * 1000 - timeLeft) / (48 * 60 * 60 * 1000)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Ôi không! Chuỗi ngày bị đứt
          </DialogTitle>
          <DialogDescription>
            Chuỗi {previousStreak} ngày của bạn đã bị ngắt. Đây là cơ hội duy nhất để khôi phục!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thông tin ưu đãi */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-red-900 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Ưu đãi Sửa Chữa Đặc biệt
              </h4>
              <Badge variant="destructive" className="text-xs">
                Chỉ 1 lần
              </Badge>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              <div className="flex justify-between">
                <span>Chuỗi ngày bị mất:</span>
                <span className="font-medium">{previousStreak} ngày</span>
              </div>
              <div className="flex justify-between">
                <span>Chi phí khôi phục:</span>
                <span className="font-medium flex items-center gap-1">
                  {repairOffer.cost} <Gem className="w-3 h-3" />
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mind Gems hiện có:</span>
                <span className={`font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  {state.gamification.mindGems} <Gem className="w-3 h-3 inline" />
                </span>
              </div>
            </div>
          </div>

          {/* Thời gian còn lại */}
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Thời gian còn lại: {formatTimeLeft(timeLeft)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-yellow-700 mt-1">
              Ưu đãi này sẽ hết hạn sau 48 giờ kể từ khi chuỗi bị đứt
            </p>
          </div>

          {/* Lợi ích của việc sửa chữa */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-900 mb-2">✨ Lợi ích khi khôi phục:</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Giữ lại toàn bộ {previousStreak} ngày đã nỗ lực</li>
              <li>• Tiếp tục hành trình không bị gián đoạn</li>
              <li>• Duy trì động lực và thói quen tích cực</li>
              <li>• Tránh phải bắt đầu lại từ đầu</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Bỏ qua
            </Button>
            <Button 
              onClick={handleRepairStreak}
              disabled={!canAfford || isProcessing}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              {isProcessing ? (
                'Đang xử lý...'
              ) : (
                `Khôi phục (${repairOffer.cost} 💎)`
              )}
            </Button>
          </div>

          {!canAfford && (
            <p className="text-xs text-red-600 text-center">
              Bạn cần thêm {repairOffer.cost - state.gamification.mindGems} Mind Gems để sử dụng tính năng này
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};