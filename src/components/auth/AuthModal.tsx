import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SocialLoginButton } from './SocialLoginButton';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDataMigration } from '@/services/dataMigration';
import { guestStorage } from '@/utils/guestStorage';
import { loginUser, signupUser, socialLogin } from '@/services/mockApi';
import { DailyLoginService } from '@/services/dailyLoginSystem';
import { useToast } from '@/components/ui/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}

export function AuthModal({ isOpen, onClose, mode: initialMode = 'login', onModeChange }: AuthModalProps) {
  const { dispatch } = useApp();
  const { setIsAuthenticated } = useAuth();
  const { hasDataToMigrate, migrateData, createMigrationNotification } = useDataMigration();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let authResult;
      
      if (initialMode === 'login') {
        authResult = await loginUser(formData.email, formData.password);
      } else {
        authResult = await signupUser(formData.name, formData.email, formData.password, formData.confirmPassword);
      }
      
      if (!authResult.success) {
        setMigrationStatus({
          show: true,
          success: false,
          message: authResult.message
        });
        return;
      }
      
      const userData = authResult.user;
      
      // Kiểm tra và migrate dữ liệu guest nếu có
      if (hasDataToMigrate()) {
        const guestData = guestStorage.getGuestData();
        if (guestData) {
          const migrationMessage = createMigrationNotification(guestData);
          setMigrationStatus({
            show: true,
            success: false,
            message: migrationMessage
          });
          
          // Thực hiện migration
          const migrationResult = await migrateData(userData);
          
          setMigrationStatus({
            show: true,
            success: migrationResult.success,
            message: migrationResult.message
          });
          
          // Đợi 2 giây để user đọc thông báo
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      dispatch({ type: 'SET_USER', payload: userData });
      setIsAuthenticated(true);
      
      // Xử lý daily login reward
      const dailyLoginResult = DailyLoginService.processLogin();
      if (dailyLoginResult.isFirstLoginToday && dailyLoginResult.totalGemsEarned > 0) {
        // Cập nhật Mind Gems trong state
        dispatch({ type: 'ADD_MIND_GEMS', payload: dailyLoginResult.totalGemsEarned });
        
        // Hiển thị thông báo
        toast({
          title: '🎉 Chào mừng trở lại!',
          description: dailyLoginResult.messages.join(' '),
          duration: 5000,
        });
      }
      
      // Reset form và đóng modal
      setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      setMigrationStatus({ show: false, success: false, message: '' });
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      setMigrationStatus({
        show: true,
        success: false,
        message: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setIsLoading(true);
    
    try {
      const authResult = await socialLogin(provider);
      
      if (!authResult.success) {
        setMigrationStatus({
          show: true,
          success: false,
          message: authResult.message
        });
        return;
      }
      
      const userData = authResult.user;
      
      // Kiểm tra và migrate dữ liệu guest nếu có
      if (hasDataToMigrate()) {
        const guestData = guestStorage.getGuestData();
        if (guestData) {
          const migrationMessage = createMigrationNotification(guestData);
          setMigrationStatus({
            show: true,
            success: false,
            message: migrationMessage
          });
          
          // Thực hiện migration
          const migrationResult = await migrateData(userData);
          
          setMigrationStatus({
            show: true,
            success: migrationResult.success,
            message: migrationResult.message
          });
          
          // Đợi 2 giây để user đọc thông báo
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      dispatch({ type: 'SET_USER', payload: userData });
      setIsAuthenticated(true);
      
      // Xử lý daily login reward
      const dailyLoginResult = DailyLoginService.processLogin();
      if (dailyLoginResult.isFirstLoginToday && dailyLoginResult.totalGemsEarned > 0) {
        // Cập nhật Mind Gems trong state
        dispatch({ type: 'ADD_MIND_GEMS', payload: dailyLoginResult.totalGemsEarned });
        
        // Hiển thị thông báo
        toast({
          title: '🎉 Chào mừng trở lại!',
          description: dailyLoginResult.messages.join(' '),
          duration: 5000,
        });
      }
      
      // Reset và đóng modal
      setMigrationStatus({ show: false, success: false, message: '' });
      onClose();
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      setMigrationStatus({
        show: true,
        success: false,
        message: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Migration Status */}
          {migrationStatus.show && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              migrationStatus.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-blue-50 border border-blue-200'
            }`}>
              {migrationStatus.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
              <p className={`text-sm ${
                migrationStatus.success ? 'text-green-800' : 'text-blue-800'
              }`}>
                {migrationStatus.message}
              </p>
            </div>
          )}
          
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {initialMode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập họ và tên"
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Nhập email của bạn"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {initialMode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Nhập lại mật khẩu"
                    required
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : (initialMode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">HOẶC</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="facebook"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
            />
            <SocialLoginButton
              provider="github"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            />
          </div>

          {/* Mode Switch */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {initialMode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button
                type="button"
                onClick={() => onModeChange?.(initialMode === 'login' ? 'signup' : 'login')}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                disabled={isLoading}
              >
                {initialMode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}