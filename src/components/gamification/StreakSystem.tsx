import React, { useState, useEffect } from 'react';
import { Flame, Snowflake, Shield, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { StreakProtectionService } from '@/services/streakProtectionService';

interface StreakSystemProps {
  className?: string;
}

export function StreakSystem({ className }: StreakSystemProps) {
  const { state, dispatch } = useApp();
  const [isFlameAnimating, setIsFlameAnimating] = useState(false);
  const [showStreakFreezeDialog, setShowStreakFreezeDialog] = useState(false);

  const { streak, bestStreak } = state;
  const equippedStreakFreezes = StreakProtectionService.getEquippedStreakFreezes();

  // Hiệu ứng hoạt họa cho ngọn lửa khi có streak
  useEffect(() => {
    if (streak > 0) {
      setIsFlameAnimating(true);
      const timer = setTimeout(() => setIsFlameAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const handleUseStreakFreeze = () => {
    if (equippedStreakFreezes > 0) {
      // Sử dụng thủ công Streak Freeze (thường thì sẽ tự động kích hoạt)
      const result = StreakProtectionService.checkAndUseStreakFreeze(streak);
      if (result.wasUsed) {
        toast.success(result.message);
      } else {
        toast.error('Không thể sử dụng Đóng Băng Chuỗi lúc này.');
      }
      setShowStreakFreezeDialog(false);
    }
  };

  const getStreakMessage = () => {
    if (streak === 0) {
      return "Hãy hoàn thành một công việc để bắt đầu chuỗi ngày!";
    } else if (streak < 7) {
      return `Tuyệt vời! Bạn đang có ${streak} ngày liên tiếp!`;
    } else if (streak < 30) {
      return `Ấn tượng! ${streak} ngày kiên trì!`;
    } else {
      return `Phi thường! ${streak} ngày - Bạn là một huyền thoại!`;
    }
  };

  const getStreakColor = () => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 7) return 'text-orange-500';
    if (streak < 30) return 'text-red-500';
    return 'text-blue-500';
  };

  const getFlameIcon = () => {
    if (streak === 0) {
      return <Flame className="w-8 h-8 text-gray-400" />;
    }
    
    return (
      <div className={`relative ${isFlameAnimating ? 'animate-pulse' : ''}`}>
        <Flame className={`w-8 h-8 ${getStreakColor()} ${isFlameAnimating ? 'animate-bounce' : ''}`} />
        {streak >= 7 && (
          <div className="absolute -top-1 -right-1">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFlameIcon()}
              <div>
                <CardTitle className="text-lg">Chuỗi Ngày Rực Lửa</CardTitle>
                <CardDescription>{getStreakMessage()}</CardDescription>
              </div>
            </div>
            {equippedStreakFreezes > 0 && (
              <Dialog open={showStreakFreezeDialog} onOpenChange={setShowStreakFreezeDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700 font-medium">{equippedStreakFreezes}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      Đóng Băng Chuỗi
                    </DialogTitle>
                    <DialogDescription>
                      Bạn có {equippedStreakFreezes} vật phẩm Đóng Băng Chuỗi đã trang bị. Chúng sẽ tự động kích hoạt để bảo vệ chuỗi ngày của bạn khi cần thiết.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">🛡️ Cách hoạt động:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Tự động kích hoạt vào 00:00 nếu bạn chưa hoàn thành mục tiêu ngày hôm trước</li>
                        <li>• Bảo vệ chuỗi ngày không bị reset về 0, giữ nguyên giá trị hiện tại</li>
                        <li>• Mỗi lần sử dụng tiêu tốn 1 vật phẩm đã trang bị</li>
                        <li>• Có thể trang bị tối đa {StreakProtectionService.getMaxEquippedFreezes()} vật phẩm</li>
                        <li>• Mua thêm tại Mind Gems Shop với giá {StreakProtectionService.getStreakFreezeCost()} 💎</li>
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setShowStreakFreezeDialog(false)} 
                        className="flex-1"
                      >
                        Đã hiểu
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          // Chuyển đến Mind Gems Shop để mua thêm
                          setShowStreakFreezeDialog(false);
                          toast.info('Mua thêm Đóng Băng Chuỗi tại Mind Gems Shop!');
                        }} 
                        className="flex-1"
                      >
                        Mua thêm
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border">
              <div className={`text-2xl font-bold ${getStreakColor()}`}>{streak}</div>
              <div className="text-sm text-gray-600">Ngày hiện tại</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{bestStreak}</div>
              <div className="text-sm text-gray-600">Kỷ lục cá nhân</div>
            </div>
          </div>
          
          {/* Progress to next milestone */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ đến mốc tiếp theo</span>
              <span className="font-medium">
                {streak < 7 ? `${streak}/7 ngày` : 
                 streak < 30 ? `${streak}/30 ngày` : 
                 streak < 100 ? `${streak}/100 ngày` : 'Đã đạt tất cả mốc!'}
              </span>
            </div>
            <Progress 
              value={
                streak < 7 ? (streak / 7) * 100 :
                streak < 30 ? ((streak - 7) / 23) * 100 :
                streak < 100 ? ((streak - 30) / 70) * 100 : 100
              } 
              className="h-2"
            />
          </div>

          {/* Streak milestones */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Mốc thành tích:</h4>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={streak >= 7 ? "default" : "secondary"} className="text-xs">
                7 ngày - Chiến Binh
              </Badge>
              <Badge variant={streak >= 30 ? "default" : "secondary"} className="text-xs">
                30 ngày - Bậc Thầy
              </Badge>
              <Badge variant={streak >= 100 ? "default" : "secondary"} className="text-xs">
                100 ngày - Huyền Thoại
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}