import React, { useState, useEffect } from 'react';
import { Download, Trash2, AlertTriangle, Shield, FileText, Database, Clock, CheckCircle, Key, Eye, EyeOff, Settings, Lock, Unlock, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { exportUserData, importUserData } from '@/services/mockApi';

interface ExportRequest {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
}

export function Advanced() {
  const { toast } = useToast();
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([
    {
      id: '1',
      status: 'completed',
      requestedAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:35:00Z',
      downloadUrl: '/api/exports/download/abc123',
      expiresAt: '2024-01-22T10:35:00Z'
    }
  ]);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);

  // Load security settings from localStorage on mount
  useEffect(() => {
    const savedSecuritySettings = localStorage.getItem('securitySettings');
    if (savedSecuritySettings) {
      try {
        const parsed = JSON.parse(savedSecuritySettings);
        setTwoFactorEnabled(parsed.twoFactorEnabled ?? false);
        setSessionTimeout(parsed.sessionTimeout ?? 30);
        setLoginNotifications(parsed.loginNotifications ?? true);
        setDataEncryption(parsed.dataEncryption ?? true);
        setShowPasswords(parsed.showPasswords ?? false);
        setAutoLogout(parsed.autoLogout ?? true);
      } catch (error) {
        console.error('Error loading security settings:', error);
      }
    }
  }, []);

  // Save security settings to localStorage whenever they change
  useEffect(() => {
    const securitySettings = {
      twoFactorEnabled,
      sessionTimeout,
      loginNotifications,
      dataEncryption,
      showPasswords,
      autoLogout
    };
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
  }, [twoFactorEnabled, sessionTimeout, loginNotifications, dataEncryption, showPasswords, autoLogout]);

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const result = await exportUserData();
      
      if (result.success && result.requestId) {
        const newRequest: ExportRequest = {
          id: result.requestId,
          status: 'pending',
          requestedAt: new Date().toISOString()
        };
        
        setExportRequests(prev => [newRequest, ...prev]);
        
        // Simulate processing
        setTimeout(() => {
          setExportRequests(prev => 
            prev.map(req => 
              req.id === newRequest.id 
                ? { ...req, status: 'processing' }
                : req
            )
          );
        }, 1000);
        
        // Simulate completion after 3 seconds
        setTimeout(() => {
          setExportRequests(prev => 
            prev.map(req => 
              req.id === newRequest.id 
                ? { 
                    ...req, 
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    downloadUrl: `/api/exports/download/${newRequest.id}`,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                  }
                : req
            )
          );
        }, 3000);
        
        toast({
          title: 'Yêu cầu xuất dữ liệu đã được gửi',
          description: 'Chúng tôi sẽ gửi email thông báo khi quá trình hoàn tất'
        });
      } else {
        throw new Error(result.message || 'Export failed');
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo yêu cầu xuất dữ liệu',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async (file: File) => {
    setIsImporting(true);
    
    try {
      const result = await importUserData(file);
      
      if (result.success) {
        const importSummary = result.importedItems 
          ? `Đã import: ${result.importedItems.lists} danh sách, ${result.importedItems.tasks} nhiệm vụ, ${result.importedItems.settings} cài đặt`
          : `Đã import thành công từ file ${file.name}`;
          
        toast({
          title: "Import dữ liệu thành công",
          description: importSummary
        });
      } else {
        throw new Error(result.message || 'Import failed');
      }
      
    } catch (error) {
      toast({
        title: "Lỗi import dữ liệu",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra khi import dữ liệu",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setTwoFactorEnabled(!twoFactorEnabled);
      toast({
        title: twoFactorEnabled ? "Đã tắt xác thực 2 bước" : "Đã bật xác thực 2 bước",
        description: twoFactorEnabled ? "Tài khoản của bạn ít an toàn hơn" : "Tài khoản của bạn được bảo vệ tốt hơn"
      });
    } catch (error) {
      toast({
        title: "Lỗi cập nhật bảo mật",
        description: "Không thể thay đổi cài đặt xác thực 2 bước",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deletePassword !== 'password123' || deleteConfirmText !== 'tôi đồng ý xóa vĩnh viễn tài khoản') {
      toast({
        title: 'Thông tin không chính xác',
        description: 'Vui lòng kiểm tra lại mật khẩu và văn bản xác nhận',
        variant: 'destructive'
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // TODO: Implement API call to DELETE /api/user/account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Tài khoản đã được xóa',
        description: 'Tài khoản của bạn đã được xóa vĩnh viễn'
      });
      
      // Redirect to login page
      // window.location.href = '/login';
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tài khoản. Vui lòng thử lại sau',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword('');
      setDeleteConfirmText('');
    }
  };

  const getStatusIcon = (status: ExportRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-500" />;
    }
  };

  const getStatusText = (status: ExportRequest['status']) => {
    switch (status) {
      case 'pending': return 'Đang chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'failed': return 'Thất bại';
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cài đặt nâng cao</h2>
        <p className="text-gray-600">Quản lý dữ liệu và các hành động quan trọng</p>
      </div>

      {/* Data Export/Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Quản lý dữ liệu
          </CardTitle>
          <CardDescription>
            Xuất hoặc nhập dữ liệu của bạn để sao lưu hoặc chuyển đổi giữa các thiết bị
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Section */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              Xuất dữ liệu
            </h4>
            <p className="text-sm text-gray-600">
              Tải về toàn bộ dữ liệu của bạn bao gồm danh sách, tasks, cài đặt và lịch sử hoạt động. 
              Dữ liệu sẽ được xuất dưới định dạng JSON và gửi qua email.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Quá trình xuất dữ liệu có thể mất vài phút</li>
                    <li>• Link tải về sẽ hết hạn sau 7 ngày</li>
                    <li>• Dữ liệu được mã hóa và bảo mật</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleExportData}
              disabled={isExporting}
              variant="outline"
            >
              {isExporting ? 'Đang xử lý...' : 'Yêu cầu xuất dữ liệu'}
            </Button>
          </div>

          {/* Import Section */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Nhập dữ liệu
            </h4>
            <p className="text-sm text-gray-600">
              Khôi phục dữ liệu từ file JSON đã xuất trước đó. Dữ liệu hiện tại sẽ được ghi đè.
            </p>
            
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportData(file);
                }}
                className="hidden"
                id="import-file"
                disabled={isImporting}
              />
              <Button 
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={isImporting}
                variant="outline"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang nhập...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn file JSON
                  </>
                )}
              </Button>
              <Badge variant="secondary">Chỉ hỗ trợ .json</Badge>
            </div>
          </div>
            
          {/* Export History */}
          {exportRequests.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Lịch sử xuất dữ liệu</h4>
              <div className="space-y-3">
                {exportRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getStatusText(request.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Yêu cầu: {new Date(request.requestedAt).toLocaleString('vi-VN')}
                        </div>
                        {request.completedAt && (
                          <div className="text-xs text-gray-500">
                            Hoàn thành: {new Date(request.completedAt).toLocaleString('vi-VN')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {request.status === 'completed' && request.downloadUrl && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" />
                          Tải về
                        </Button>
                        {request.expiresAt && (
                          <div className="text-xs text-gray-500">
                            Hết hạn: {new Date(request.expiresAt).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cài đặt bảo mật
          </CardTitle>
          <CardDescription>
            Quản lý các tùy chọn bảo mật và quyền riêng tư cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Key className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Xác thực 2 bước</h4>
                <p className="text-sm text-gray-600">Thêm lớp bảo vệ bổ sung cho tài khoản</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                {twoFactorEnabled ? "Đã bật" : "Đã tắt"}
              </Badge>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
          </div>

          {/* Session Management */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Quản lý phiên đăng nhập
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Tự động đăng xuất</p>
                  <p className="text-xs text-gray-600">Sau {sessionTimeout} phút không hoạt động</p>
                </div>
                <Switch
                  checked={autoLogout}
                  onCheckedChange={setAutoLogout}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Thông báo đăng nhập</p>
                  <p className="text-xs text-gray-600">Nhận thông báo khi có đăng nhập mới</p>
                </div>
                <Switch
                  checked={loginNotifications}
                  onCheckedChange={setLoginNotifications}
                />
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Bảo vệ dữ liệu
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Mã hóa dữ liệu</p>
                  <p className="text-xs text-gray-600">Mã hóa end-to-end cho dữ liệu nhạy cảm</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={dataEncryption ? "default" : "destructive"}>
                    {dataEncryption ? "Bật" : "Tắt"}
                  </Badge>
                  <Switch
                    checked={dataEncryption}
                    onCheckedChange={setDataEncryption}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Hiển thị mật khẩu</p>
                  <p className="text-xs text-gray-600">Cho phép hiển thị mật khẩu khi nhập</p>
                </div>
                <div className="flex items-center gap-2">
                  {showPasswords ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  <Switch
                    checked={showPasswords}
                    onCheckedChange={setShowPasswords}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Trash2 className="h-5 w-5" />
            Xóa tài khoản
          </CardTitle>
          <CardDescription className="text-red-700">
            Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn. Hành động này không thể hoàn tác.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Cảnh báo nghiêm trọng:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tất cả danh sách và tasks sẽ bị xóa vĩnh viễn</li>
                  <li>Lịch sử hoạt động và thống kê sẽ bị mất</li>
                  <li>Không thể khôi phục sau khi xóa</li>
                  <li>Tài khoản sẽ bị vô hiệu hóa ngay lập tức</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa tài khoản vĩnh viễn
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa tài khoản</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Để xác nhận việc xóa tài khoản, vui lòng nhập mật khẩu và văn bản xác nhận bên dưới.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gõ: "tôi đồng ý xóa vĩnh viễn tài khoản"
                </label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Nhập văn bản xác nhận"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setDeleteConfirmText('');
                }}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword || deleteConfirmText !== 'tôi đồng ý xóa vĩnh viễn tài khoản'}
                className="flex-1"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa tài khoản'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}