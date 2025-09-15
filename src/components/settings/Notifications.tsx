import React, { useState, useEffect } from 'react';
import { Bell, Mail, Clock, Users, Smartphone, Volume2, VolumeX, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationSetting } from '@/types';

const notificationSettings: NotificationSetting[] = [
  {
    id: 'task_reminders',
    type: 'reminder',
    title: 'Nhắc nhở công việc',
    description: 'Thông báo khi công việc sắp đến hạn hoặc quá hạn',
    icon: Clock,
    enabled: true,
    category: 'reminders',
    requiresAuth: true
  },
  {
    id: 'assignment_notifications',
    type: 'assignment',
    title: 'Thông báo giao việc',
    description: 'Nhận thông báo khi có người giao việc cho bạn',
    icon: Users,
    enabled: false,
    category: 'collaboration',
    requiresAuth: true
  },
  {
    id: 'daily_summary',
    type: 'summary',
    title: 'Tổng hợp hàng ngày',
    description: 'Email tổng hợp công việc và tiến độ hàng ngày',
    icon: Mail,
    enabled: true,
    category: 'reports',
    requiresAuth: true
  },
  {
    id: 'weekly_report',
    type: 'report',
    title: 'Báo cáo tuần',
    description: 'Báo cáo chi tiết về năng suất và hoàn thành công việc',
    icon: Mail,
    enabled: false,
    category: 'reports',
    requiresAuth: true
  },
  {
    id: 'push_notifications',
    type: 'push',
    title: 'Thông báo đẩy',
    description: 'Nhận thông báo trực tiếp trên thiết bị',
    icon: Smartphone,
    enabled: true,
    category: 'reminders',
    requiresAuth: true
  }
];

const categoryLabels = {
  reminders: 'Nhắc nhở',
  collaboration: 'Cộng tác',
  reports: 'Báo cáo'
};

export function Notifications() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<NotificationSetting[]>(notificationSettings);
  const [reminderTime, setReminderTime] = useState('15min');
  const [quietHours, setQuietHours] = useState({ start: '22:00', end: '08:00' });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState([70]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed.settings || notificationSettings);
        setReminderTime(parsed.reminderTime || '15min');
        setQuietHours(parsed.quietHours || { start: '22:00', end: '08:00' });
        setSoundEnabled(parsed.soundEnabled ?? true);
        setVolume(parsed.volume || [70]);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settingsToSave = {
      settings,
      reminderTime,
      quietHours,
      soundEnabled,
      volume
    };
    localStorage.setItem('notificationSettings', JSON.stringify(settingsToSave));
  }, [settings, reminderTime, quietHours, soundEnabled, volume]);

  const handleToggle = (settingId: string, enabled: boolean) => {
    if (!isAuthenticated) {
      toast({
        title: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để sử dụng tính năng thông báo',
        variant: 'destructive'
      });
      return;
    }

    setSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled }
          : setting
      )
    );

    const setting = settings.find(s => s.id === settingId);
    if (setting) {
      toast({
        title: 'Cập nhật thành công',
        description: `${enabled ? 'Bật' : 'Tắt'} thông báo "${setting.title}"`
      });
    }
  };

  const handleReminderTimeChange = (value: string) => {
    setReminderTime(value);
    toast({
      title: 'Cập nhật thành công',
      description: `Thời gian nhắc nhở đã được đặt thành ${value === '5min' ? '5 phút' : value === '15min' ? '15 phút' : value === '30min' ? '30 phút' : '1 giờ'} trước`
    });
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Thông báo
            </CardTitle>
            <CardDescription>
              Đăng nhập để quản lý cài đặt thông báo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cần đăng nhập
              </h3>
              <p className="text-gray-500 mb-4">
                Vui lòng đăng nhập để cấu hình thông báo và nhận nhắc nhở về công việc của bạn.
              </p>
              <Button onClick={() => toast({
                title: 'Tính năng đang phát triển',
                description: 'Chức năng đăng nhập sẽ được thêm sau'
              })}>
                Đăng nhập ngay
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt Thông báo
          </CardTitle>
          <CardDescription>
            Quản lý cách bạn nhận thông báo về công việc và hoạt động
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notification Categories */}
      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySettings.map((setting) => {
              const IconComponent = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor={setting.id} className="text-sm font-medium">
                        {setting.title}
                      </Label>
                      <p className="text-sm text-gray-500">
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
          </CardContent>
        </Card>
      ))}

      {/* Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt Nhắc nhở
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Thời gian nhắc nhở trước</Label>
            <Select value={reminderTime} onValueChange={handleReminderTimeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5min">5 phút trước</SelectItem>
                <SelectItem value="15min">15 phút trước</SelectItem>
                <SelectItem value="30min">30 phút trước</SelectItem>
                <SelectItem value="1hour">1 giờ trước</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Giờ yên tĩnh</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Từ</Label>
                <Select value={quietHours.start} onValueChange={(value) => setQuietHours(prev => ({ ...prev, start: value }))}>
                  <SelectTrigger>
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
              <div>
                <Label className="text-sm text-gray-500">Đến</Label>
                <Select value={quietHours.end} onValueChange={(value) => setQuietHours(prev => ({ ...prev, end: value }))}>
                  <SelectTrigger>
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
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-gray-500" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-500" />
                )}
                <Label>Âm thanh thông báo</Label>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            
            {soundEnabled && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-500">Âm lượng</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Nhỏ</span>
                  <span>{volume[0]}%</span>
                  <span>Lớn</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Kiểm tra Thông báo</CardTitle>
          <CardDescription>
            Gửi thông báo thử để kiểm tra cài đặt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => {
              toast({
                title: 'Thông báo thử nghiệm',
                description: 'Đây là thông báo thử nghiệm để kiểm tra cài đặt của bạn'
              });
            }}
            className="w-full"
          >
            Gửi thông báo thử
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}