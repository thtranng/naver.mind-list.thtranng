import React, { useState } from 'react';
import { Bell, Clock, Mail, Smartphone, Calendar, Zap, Settings, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { NotificationSetting } from '@/types';
import { updateNotificationSetting, getNotificationSettings } from '@/services/mockApi';

const notificationSettings: NotificationSetting[] = [
  {
    id: 'task_reminders',
    type: 'TASK_REMINDER',
    title: 'Nhắc nhở công việc',
    description: 'Nhận thông báo khi có task sắp đến hạn',
    icon: Clock,
    enabled: true,
    category: 'tasks'
  },
  {
    id: 'task_completed',
    type: 'TASK_COMPLETED',
    title: 'Hoàn thành công việc',
    description: 'Thông báo khi bạn hoàn thành một task',
    icon: Calendar,
    enabled: true,
    category: 'tasks'
  },
  {
    id: 'daily_summary',
    type: 'DAILY_SUMMARY',
    title: 'Tổng kết hàng ngày',
    description: 'Nhận báo cáo tiến độ công việc cuối ngày',
    icon: Mail,
    enabled: false,
    category: 'tasks'
  },
  {
    id: 'system_updates',
    type: 'SYSTEM_UPDATE',
    title: 'Cập nhật hệ thống',
    description: 'Thông báo về các tính năng mới và cập nhật',
    icon: Zap,
    enabled: true,
    category: 'system'
  },
  {
    id: 'security_alerts',
    type: 'SECURITY_ALERT',
    title: 'Cảnh báo bảo mật',
    description: 'Thông báo về hoạt động đăng nhập bất thường',
    icon: Bell,
    enabled: true,
    category: 'system'
  },
  {
    id: 'mobile_push',
    type: 'MOBILE_PUSH',
    title: 'Thông báo đẩy trên điện thoại',
    description: 'Nhận thông báo trên ứng dụng di động',
    icon: Smartphone,
    enabled: false,
    category: 'system'
  }
];

const categoryLabels = {
  tasks: 'Công việc',
  system: 'Hệ thống',
  social: 'Xã hội'
};

export function NotificationManagement() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSetting[]>(notificationSettings);
  const [quietHours, setQuietHours] = useState({ start: '22:00', end: '08:00', enabled: true });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [frequency, setFrequency] = useState('immediate');

  const handleToggle = async (settingId: string, enabled: boolean) => {
    // Update local state immediately for better UX
    setSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled }
          : setting
      )
    );

    try {
      const setting = settings.find(s => s.id === settingId);
      if (setting) {
        const result = await updateNotificationSetting(setting.type, enabled);
        
        if (result.success) {
          toast({
            title: 'Thành công',
            description: `${enabled ? 'Bật' : 'Tắt'} thông báo "${setting.title}"`
          });
        } else {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      // Revert on error
      setSettings(prev => 
        prev.map(setting => 
          setting.id === settingId 
            ? { ...setting, enabled: !enabled }
            : setting
        )
      );
      
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật cài đặt thông báo',
        variant: 'destructive'
      });
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Quản lý Thông báo
          </CardTitle>
          <CardDescription>
            Kiểm soát các loại thông báo bạn muốn nhận và tùy chỉnh cài đặt nâng cao
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt nâng cao
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="h-5 w-5 text-blue-600" /> : <VolumeX className="h-5 w-5 text-gray-400" />}
                <div>
                  <Label className="text-base font-medium">Âm thanh thông báo</Label>
                  <p className="text-sm text-gray-500">Phát âm thanh khi có thông báo mới</p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            
            {soundEnabled && (
              <div className="ml-8 space-y-3">
                <Label className="text-sm font-medium">Âm lượng: {volume[0]}%</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-indigo-600" />
                <div>
                  <Label className="text-base font-medium">Giờ yên lặng</Label>
                  <p className="text-sm text-gray-500">Tắt thông báo trong khoảng thời gian này</p>
                </div>
              </div>
              <Switch
                checked={quietHours.enabled}
                onCheckedChange={(enabled) => setQuietHours(prev => ({ ...prev, enabled }))}
              />
            </div>
            
            {quietHours.enabled && (
              <div className="ml-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Từ:</Label>
                  <Select value={quietHours.start} onValueChange={(start) => setQuietHours(prev => ({ ...prev, start }))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Đến:</Label>
                  <Select value={quietHours.end} onValueChange={(end) => setQuietHours(prev => ({ ...prev, end }))}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Notification Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tần suất thông báo</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Ngay lập tức</SelectItem>
                <SelectItem value="batched_15">Gộp mỗi 15 phút</SelectItem>
                <SelectItem value="batched_30">Gộp mỗi 30 phút</SelectItem>
                <SelectItem value="batched_60">Gộp mỗi giờ</SelectItem>
                <SelectItem value="daily">Tổng kết hàng ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySettings.map((setting) => {
                const Icon = setting.icon;
                return (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={setting.id} className="text-base font-medium text-gray-900 cursor-pointer">
                          {setting.title}
                        </Label>
                        <p className="text-sm text-gray-500 mt-1">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    
                    <Switch
                      id={setting.id}
                      checked={setting.enabled}
                      onCheckedChange={(checked) => handleToggle(setting.id, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Notification Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Xem trước thông báo
          </CardTitle>
          <CardDescription>
            Đây là ví dụ về cách thông báo sẽ hiển thị với cài đặt hiện tại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-blue-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Nhắc nhở công việc</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Bạn có 3 công việc sắp đến hạn trong 2 giờ tới
                  </div>
                  <div className="text-xs text-gray-500 mt-2">2 phút trước</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Calendar size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Hoàn thành công việc</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Chúc mừng! Bạn đã hoàn thành "Thiết kế giao diện mới"
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Vừa xong</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Quản lý tất cả thông báo cùng một lúc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setSettings(prev => prev.map(s => ({ ...s, enabled: true })));
                toast({ title: 'Thành công', description: 'Đã bật tất cả thông báo' });
              }}
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Bell className="h-4 w-4 mr-2" />
              Bật tất cả
            </Button>
            
            <Button
              onClick={() => {
                setSettings(prev => prev.map(s => ({ ...s, enabled: false })));
                toast({ title: 'Thành công', description: 'Đã tắt tất cả thông báo' });
              }}
              variant="outline"
            >
              <VolumeX className="h-4 w-4 mr-2" />
              Tắt tất cả
            </Button>
            
            <Button
              onClick={() => {
                setSettings(prev => prev.map(s => 
                  s.category === 'tasks' ? { ...s, enabled: true } : s
                ));
                toast({ title: 'Thành công', description: 'Đã bật thông báo công việc' });
              }}
              variant="outline"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Chỉ công việc
            </Button>
            
            <Button
              onClick={() => {
                // Reset to default settings
                setSettings(notificationSettings);
                setSoundEnabled(true);
                setVolume([75]);
                setQuietHours({ start: '22:00', end: '08:00', enabled: true });
                setFrequency('immediate');
                toast({ title: 'Thành công', description: 'Đã khôi phục cài đặt mặc định' });
              }}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Khôi phục mặc định
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}