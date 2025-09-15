import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Cloud, CloudOff, Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cloudStorageService } from '@/services/cloudStorageService';
import { useToast } from '@/components/ui/use-toast';

export function CloudStorageSettings() {
  const { 
    isCloudSyncEnabled, 
    setIsCloudSyncEnabled, 
    cloudSyncStatus, 
    lastSyncTime,
    syncToCloud,
    syncFromCloud 
  } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleToggleCloudSync = async (enabled: boolean) => {
    if (enabled) {
      // Enable cloud sync - authenticate with Google
      setIsConnecting(true);
      try {
        const result = await cloudStorageService.authenticate();
        if (result.success) {
          setIsCloudSyncEnabled(true);
          toast({
            title: 'Kết nối thành công',
            description: 'Đã kết nối với Google Drive'
          });
        } else {
          toast({
            title: 'Lỗi kết nối',
            description: result.message,
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Lỗi kết nối',
          description: 'Không thể kết nối với Google Drive',
          variant: 'destructive'
        });
      } finally {
        setIsConnecting(false);
      }
    } else {
      // Disable cloud sync - sign out
      try {
        await cloudStorageService.signOut();
        setIsCloudSyncEnabled(false);
        toast({
          title: 'Đã ngắt kết nối',
          description: 'Đã ngắt kết nối khỏi Google Drive'
        });
      } catch (error) {
        toast({
          title: 'Lỗi ngắt kết nối',
          description: 'Không thể ngắt kết nối',
          variant: 'destructive'
        });
      }
    }
  };

  const handleManualSync = async (direction: 'upload' | 'download') => {
    try {
      if (direction === 'upload') {
        await syncToCloud();
      } else {
        await syncFromCloud();
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  const getStatusIcon = () => {
    switch (cloudSyncStatus) {
      case 'syncing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return isCloudSyncEnabled ? <Cloud className="h-4 w-4 text-blue-500" /> : <CloudOff className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (cloudSyncStatus) {
      case 'syncing':
        return 'Đang đồng bộ...';
      case 'success':
        return 'Đồng bộ thành công';
      case 'error':
        return 'Lỗi đồng bộ';
      default:
        return isCloudSyncEnabled ? 'Đã kết nối' : 'Chưa kết nối';
    }
  };

  const getStatusVariant = () => {
    switch (cloudSyncStatus) {
      case 'syncing':
        return 'secondary';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return isCloudSyncEnabled ? 'default' : 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Lưu trữ đám mây
        </CardTitle>
        <CardDescription>
          Đồng bộ dữ liệu với Google Drive để bảo vệ và truy cập từ mọi thiết bị
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cloud Sync Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Kích hoạt đồng bộ đám mây</div>
            <div className="text-xs text-muted-foreground">
              Tự động lưu và khôi phục dữ liệu từ Google Drive
            </div>
          </div>
          <Switch
            checked={isCloudSyncEnabled}
            onCheckedChange={handleToggleCloudSync}
            disabled={isConnecting || cloudSyncStatus === 'syncing'}
          />
        </div>

        {/* Status Display */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Trạng thái</div>
          <Badge variant={getStatusVariant()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>

        {/* Last Sync Time */}
        {lastSyncTime && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Lần đồng bộ cuối</div>
            <div className="text-xs text-muted-foreground">
              {new Date(lastSyncTime).toLocaleString('vi-VN')}
            </div>
          </div>
        )}

        {/* Manual Sync Controls */}
        {isCloudSyncEnabled && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Đồng bộ thủ công</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleManualSync('upload')}
                disabled={cloudSyncStatus === 'syncing'}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Tải lên
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleManualSync('download')}
                disabled={cloudSyncStatus === 'syncing'}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Tải lên: Lưu dữ liệu hiện tại lên Google Drive<br />
              Tải xuống: Khôi phục dữ liệu từ Google Drive (sẽ ghi đè dữ liệu hiện tại)
            </div>
          </div>
        )}

        {/* Connection Instructions */}
        {!isCloudSyncEnabled && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-1">Cách kích hoạt đồng bộ đám mây:</div>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Bật công tắc "Kích hoạt đồng bộ đám mây"</li>
              <li>2. Đăng nhập vào tài khoản Google của bạn</li>
              <li>3. Cấp quyền truy cập Google Drive</li>
              <li>4. Dữ liệu sẽ được tự động đồng bộ</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}