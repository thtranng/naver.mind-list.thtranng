import React, { useState } from 'react';
import { LogOut, Shield, AlertTriangle, CheckCircle, Smartphone, Monitor, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logoutUser, logoutAllDevices, terminateSession } from '@/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

interface ActiveSession {
  id: string;
  deviceName: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

const activeSessions: ActiveSession[] = [
  {
    id: 'current',
    deviceName: 'Windows PC',
    browser: 'Chrome 120.0',
    location: 'Hà Nội, Việt Nam',
    lastActive: new Date().toISOString(),
    isCurrent: true,
    deviceType: 'desktop'
  },
  {
    id: 'session_2',
    deviceName: 'iPhone 15',
    browser: 'Safari Mobile',
    location: 'Hà Nội, Việt Nam',
    lastActive: '2024-01-15T14:30:00Z',
    isCurrent: false,
    deviceType: 'mobile'
  },
  {
    id: 'session_3',
    deviceName: 'MacBook Pro',
    browser: 'Safari 17.0',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    lastActive: '2024-01-14T09:15:00Z',
    isCurrent: false,
    deviceType: 'desktop'
  }
];

export function Logout() {
  const { toast } = useToast();
  const { setIsAuthenticated } = useAuth();
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(activeSessions);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone size={16} className="text-gray-500" />;
      case 'desktop':
        return <Monitor size={16} className="text-gray-500" />;
      default:
        return <Globe size={16} className="text-gray-500" />;
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const result = await logoutUser();
      
      if (result.success) {
        // Reset authentication state
        setIsAuthenticated(false);
        
        // Clear user data from app state
        dispatch({ type: 'SET_USER', payload: null });
        
        toast({
          title: 'Đăng xuất thành công',
          description: 'Bạn đã được đăng xuất khỏi tài khoản'
        });
        
        // Navigate to home page (which will show login modal for unauthenticated users)
        navigate('/');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Lỗi đăng xuất',
        description: error instanceof Error ? error.message : 'Không thể đăng xuất. Vui lòng thử lại',
        variant: 'destructive'
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    
    try {
      const result = await logoutAllDevices();
      
      if (result.success) {
        // Clear all sessions
        setSessions([]);
        
        toast({
          title: 'Đăng xuất tất cả thiết bị thành công',
          description: 'Bạn đã được đăng xuất khỏi tất cả thiết bị'
        });
        
        // Redirect to login page
        // window.location.href = '/login';
        console.log('Redirecting to login page...');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể đăng xuất tất cả thiết bị. Vui lòng thử lại',
        variant: 'destructive'
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutAllModal(false);
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      const result = await terminateSession(sessionId);
      
      if (result.success) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        
        toast({
          title: 'Đăng xuất thành công',
          description: 'Đã đăng xuất khỏi thiết bị được chọn'
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể đăng xuất khỏi thiết bị này',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Đăng xuất</h2>
        <p className="text-gray-600">Quản lý phiên đăng nhập và đăng xuất khỏi tài khoản</p>
      </div>

      {/* Current Session Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={20} className="text-green-600" />
          <h3 className="text-lg font-medium text-gray-900">Phiên hiện tại</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Thiết bị</div>
            <div className="font-medium text-gray-900">Windows PC - Chrome 120.0</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Vị trí</div>
            <div className="font-medium text-gray-900">Hà Nội, Việt Nam</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Đăng nhập lúc</div>
            <div className="font-medium text-gray-900">
              {new Date().toLocaleString('vi-VN')}
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Phiên đăng nhập khác</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogoutAllModal(true)}
            disabled={sessions.filter(s => !s.isCurrent).length === 0}
          >
            Đăng xuất tất cả
          </Button>
        </div>
        
        {sessions.filter(session => !session.isCurrent).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Không có phiên đăng nhập nào khác</p>
            <p className="text-sm mt-1">Tài khoản của bạn chỉ đang đăng nhập trên thiết bị này</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.filter(session => !session.isCurrent).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(session.deviceType)}
                  <div>
                    <div className="font-medium text-gray-900">
                      {session.deviceName} - {session.browser}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.location} • Hoạt động lần cuối: {new Date(session.lastActive).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogoutSession(session.id)}
                >
                  Đăng xuất
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Actions */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hành động đăng xuất</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Đăng xuất thiết bị này</div>
              <div className="text-sm text-gray-500">
                Đăng xuất khỏi thiết bị hiện tại và chuyển về trang đăng nhập
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Đăng xuất tất cả thiết bị</div>
              <div className="text-sm text-gray-500">
                Đăng xuất khỏi tất cả thiết bị và vô hiệu hóa tất cả phiên đăng nhập
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowLogoutAllModal(true)}
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất tất cả
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LogOut className="text-blue-600" size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Xác nhận đăng xuất</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản? Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1"
              >
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout All Confirmation Modal */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Đăng xuất tất cả thiết bị</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi tất cả thiết bị? Tất cả phiên đăng nhập sẽ bị vô hiệu hóa và bạn cần đăng nhập lại trên mọi thiết bị.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutAllModal(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogoutAll}
                disabled={isLoggingOut}
                className="flex-1"
              >
                {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất tất cả'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}