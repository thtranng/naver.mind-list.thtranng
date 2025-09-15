import React, { useState, useRef } from 'react';
import { Camera, Eye, EyeOff, Monitor, Smartphone, Tablet, Shield, AlertTriangle, CheckCircle, Clock, MapPin, Trash2, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Session {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ipAddress: string;
  browser: string;
  os: string;
  loginTime: string;
  isSecure: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'profile_update' | 'suspicious_activity';
  description: string;
  timestamp: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
}

// Mock data for sessions
const mockSessions: Session[] = [
  {
    id: '1',
    deviceName: 'Chrome on Windows',
    deviceType: 'desktop',
    location: 'Hà Nội, Việt Nam',
    lastActive: 'Hiện tại',
    isCurrent: true,
    ipAddress: '192.168.1.100',
    browser: 'Chrome 120.0',
    os: 'Windows 11',
    loginTime: '2024-01-15 09:30',
    isSecure: true
  },
  {
    id: '2',
    deviceName: 'Safari on iPhone',
    deviceType: 'mobile',
    location: 'Hà Nội, Việt Nam',
    lastActive: '2 giờ trước',
    isCurrent: false,
    ipAddress: '192.168.1.101',
    browser: 'Safari 17.0',
    os: 'iOS 17.2',
    loginTime: '2024-01-15 07:15',
    isSecure: true
  },
  {
    id: '3',
    deviceName: 'Edge on Windows',
    deviceType: 'desktop',
    location: 'TP.HCM, Việt Nam',
    lastActive: '1 ngày trước',
    isCurrent: false,
    ipAddress: '203.162.4.191',
    browser: 'Edge 120.0',
    os: 'Windows 10',
    loginTime: '2024-01-14 14:22',
    isSecure: false
  }
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'login',
    description: 'Đăng nhập thành công từ thiết bị mới',
    timestamp: '2024-01-15 09:30',
    location: 'Hà Nội, Việt Nam',
    severity: 'low'
  },
  {
    id: '2',
    type: 'password_change',
    description: 'Mật khẩu đã được thay đổi',
    timestamp: '2024-01-14 16:45',
    location: 'Hà Nội, Việt Nam',
    severity: 'medium'
  },
  {
    id: '3',
    type: 'suspicious_activity',
    description: 'Phát hiện đăng nhập từ vị trí bất thường',
    timestamp: '2024-01-14 14:22',
    location: 'TP.HCM, Việt Nam',
    severity: 'high'
  }
];

export function AccountManagement() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    username: state.user?.username || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [securityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSecurityEvents, setShowSecurityEvents] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!state.user) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật ảnh đại diện khi chưa đăng nhập',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type and size
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: 'Lỗi',
        description: 'Chỉ hỗ trợ file JPEG và PNG',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: 'Lỗi',
        description: 'Kích thước file không được vượt quá 5MB',
        variant: 'destructive'
      });
      return;
    }

    // TODO: Implement actual upload to POST /api/user/avatar
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarUrl = e.target?.result as string;
      dispatch({
        type: 'SET_USER',
        payload: { ...state.user!, avatarUrl }
      });
      toast({
        title: 'Thành công',
        description: 'Cập nhật ảnh đại diện thành công'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = () => {
    if (!state.user) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật thông tin khi chưa đăng nhập',
        variant: 'destructive'
      });
      return;
    }

    // Validation
    if (!profileForm.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Tên không được để trống',
        variant: 'destructive'
      });
      return;
    }

    if (!profileForm.username.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Tên người dùng không được để trống',
        variant: 'destructive'
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(profileForm.username)) {
      toast({
        title: 'Lỗi',
        description: 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới',
        variant: 'destructive'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      toast({
        title: 'Lỗi',
        description: 'Email không hợp lệ',
        variant: 'destructive'
      });
      return;
    }

    // TODO: Implement API call to PUT /api/user/profile
    dispatch({
      type: 'SET_USER',
      payload: {
        ...state.user!,
        name: profileForm.name,
        email: profileForm.email,
        username: profileForm.username
      }
    });

    toast({
      title: 'Thành công',
      description: 'Cập nhật thông tin thành công'
    });
  };

  const handlePasswordChange = () => {
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu mới và xác nhận không khớp',
        variant: 'destructive'
      });
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
        variant: 'destructive'
      });
      return;
    }

    // TODO: Implement API call to PUT /api/user/password
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    toast({
      title: 'Thành công',
      description: 'Đổi mật khẩu thành công'
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    // TODO: Implement API call to DELETE /api/user/sessions/{sessionId}
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast({
      title: 'Thành công',
      description: 'Đã đăng xuất khỏi thiết bị'
    });
  };

  const handleLogoutAllSessions = () => {
    // TODO: Implement API call to DELETE /api/user/sessions/all
    setSessions(sessions.filter(s => s.isCurrent));
    toast({
      title: 'Thành công',
      description: 'Đã đăng xuất khỏi tất cả thiết bị khác'
    });
  };

  const handleToggleTwoFactor = () => {
    // TODO: Implement 2FA setup/disable
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? 'Đã tắt' : 'Đã bật',
      description: `Xác thực hai yếu tố đã được ${twoFactorEnabled ? 'tắt' : 'bật'}`
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quản lý Tài khoản</h2>
        <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
      </div>

      {/* Security Alert */}
      {securityEvents.some(event => event.severity === 'high') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Phát hiện hoạt động bất thường trên tài khoản của bạn. Vui lòng kiểm tra lại các phiên đăng nhập.
          </AlertDescription>
        </Alert>
      )}

      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ảnh đại diện
          </CardTitle>
          <CardDescription>
            Cập nhật ảnh đại diện của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={state.user?.avatarUrl || '/placeholder.svg'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-lg"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera size={16} />
              </button>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full"
              >
                Thay đổi ảnh
              </Button>
              <p className="text-sm text-gray-500">
                JPEG hoặc PNG, tối đa 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên hiển thị</Label>
              <Input
                id="name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                onBlur={handleProfileUpdate}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                onBlur={handleProfileUpdate}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Label htmlFor="username">Tên người dùng</Label>
            <Input
              id="username"
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              onBlur={handleProfileUpdate}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật tài khoản
          </CardTitle>
          <CardDescription>
            Quản lý mật khẩu và cài đặt bảo mật
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two Factor Authentication */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Xác thực hai yếu tố</h4>
                <p className="text-sm text-gray-600">Tăng cường bảo mật với xác thực 2FA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                {twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
              </Badge>
              <Button
                variant={twoFactorEnabled ? 'destructive' : 'default'}
                size="sm"
                onClick={handleToggleTwoFactor}
              >
                {twoFactorEnabled ? 'Tắt' : 'Bật'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Password Change */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Thay đổi mật khẩu</h4>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button onClick={handlePasswordChange} className="w-full">
                Cập nhật mật khẩu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Quản lý phiên đăng nhập
              </CardTitle>
              <CardDescription>
                Theo dõi và quản lý các thiết bị đã đăng nhập
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogoutAllSessions}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              return (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <DeviceIcon size={20} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{session.deviceName}</span>
                        {session.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Hiện tại
                          </Badge>
                        )}
                        {!session.isSecure && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Không an toàn
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.lastActive}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {session.browser} • {session.os} • IP: {session.ipAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLogoutSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Đăng xuất
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Hoạt động bảo mật
              </CardTitle>
              <CardDescription>
                Lịch sử các hoạt động liên quan đến bảo mật
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSecurityEvents(!showSecurityEvents)}
            >
              {showSecurityEvents ? 'Ẩn' : 'Xem tất cả'}
            </Button>
          </div>
        </CardHeader>
        {showSecurityEvents && (
          <CardContent>
            <div className="space-y-3">
              {securityEvents.map((event) => {
                const SeverityIcon = getSeverityIcon(event.severity);
                return (
                  <div key={event.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      event.severity === 'high' ? 'bg-red-100' :
                      event.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <SeverityIcon className={`h-4 w-4 ${
                        event.severity === 'high' ? 'text-red-600' :
                        event.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{event.description}</span>
                        <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                          {event.severity === 'high' ? 'Cao' : event.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.timestamp}
                        </span>
                        <span className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}