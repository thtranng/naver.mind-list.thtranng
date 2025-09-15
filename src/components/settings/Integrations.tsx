import React, { useState } from 'react';
import { Link, Calendar, Mail, Github, Slack, Trello, CheckCircle, AlertCircle, ExternalLink, Settings, Zap, MessageSquare, Database, Cloud, Shield, Webhook, BarChart3, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { CloudStorageSettings } from '@/components/CloudStorageSettings';

interface Integration {
  id: string;
  provider: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isConnected: boolean;
  connectedAt?: string;
  features: string[];
  category: 'calendar' | 'productivity' | 'communication' | 'development' | 'analytics' | 'storage' | 'automation';
  isPremium?: boolean;
  syncEnabled?: boolean;
  lastSync?: string;
}

const integrations: Integration[] = [
  {
    id: 'google_calendar',
    provider: 'google-calendar',
    name: 'Google Calendar',
    description: 'Đồng bộ tasks với lịch Google Calendar',
    icon: Calendar,
    color: 'bg-blue-500',
    isConnected: false,
    features: ['Tự động tạo sự kiện từ tasks', 'Nhắc nhở qua email', 'Đồng bộ 2 chiều'],
    category: 'calendar',
    syncEnabled: true
  },
  {
    id: 'outlook_calendar',
    provider: 'outlook-calendar',
    name: 'Outlook Calendar',
    description: 'Tích hợp với Microsoft Outlook',
    icon: Calendar,
    color: 'bg-blue-600',
    isConnected: true,
    connectedAt: '2024-01-15',
    features: ['Đồng bộ lịch làm việc', 'Nhắc nhở cuộc họp', 'Quản lý thời gian'],
    category: 'calendar',
    syncEnabled: true,
    lastSync: '2024-01-20 14:30'
  },
  {
    id: 'gmail',
    provider: 'gmail',
    name: 'Gmail',
    description: 'Tạo tasks từ email quan trọng',
    icon: Mail,
    color: 'bg-red-500',
    isConnected: false,
    features: ['Chuyển email thành task', 'Gắn nhãn tự động', 'Theo dõi email'],
    category: 'productivity'
  },
  {
    id: 'slack',
    provider: 'slack',
    name: 'Slack',
    description: 'Nhận thông báo và tạo tasks từ Slack',
    icon: Slack,
    color: 'bg-purple-500',
    isConnected: true,
    connectedAt: '2024-01-10',
    features: ['Bot thông báo', 'Tạo task từ tin nhắn', 'Báo cáo tiến độ'],
    category: 'communication',
    syncEnabled: true,
    lastSync: '2024-01-20 15:45'
  },
  {
    id: 'github',
    provider: 'github',
    name: 'GitHub',
    description: 'Đồng bộ issues và pull requests',
    icon: Github,
    color: 'bg-gray-800',
    isConnected: false,
    features: ['Tạo task từ issues', 'Theo dõi PR', 'Thống kê commit'],
    category: 'development'
  },
  {
    id: 'trello',
    provider: 'trello',
    name: 'Trello',
    description: 'Import boards và cards từ Trello',
    icon: Trello,
    color: 'bg-blue-400',
    isConnected: false,
    features: ['Import boards', 'Đồng bộ cards', 'Chuyển đổi dữ liệu'],
    category: 'productivity'
  },
  {
    id: 'discord',
    provider: 'discord',
    name: 'Discord',
    description: 'Nhận thông báo và quản lý tasks qua Discord',
    icon: MessageSquare,
    color: 'bg-indigo-500',
    isConnected: false,
    features: ['Bot thông báo', 'Slash commands', 'Báo cáo tiến độ'],
    category: 'communication'
  },
  {
    id: 'notion',
    provider: 'notion',
    name: 'Notion',
    description: 'Đồng bộ với Notion databases',
    icon: FileText,
    color: 'bg-gray-700',
    isConnected: false,
    features: ['Đồng bộ databases', 'Import pages', 'Tạo templates'],
    category: 'productivity',
    isPremium: true
  },
  {
    id: 'google_drive',
    provider: 'google-drive',
    name: 'Google Drive',
    description: 'Lưu trữ và chia sẻ files',
    icon: Cloud,
    color: 'bg-green-500',
    isConnected: false,
    features: ['Backup tự động', 'Chia sẻ files', 'Sync folders'],
    category: 'storage'
  },
  {
    id: 'dropbox',
    provider: 'dropbox',
    name: 'Dropbox',
    description: 'Cloud storage và file sharing',
    icon: Cloud,
    color: 'bg-blue-700',
    isConnected: false,
    features: ['File backup', 'Team sharing', 'Version control'],
    category: 'storage'
  },
  {
    id: 'zapier',
    provider: 'zapier',
    name: 'Zapier',
    description: 'Tự động hóa workflow với 5000+ apps',
    icon: Zap,
    color: 'bg-orange-500',
    isConnected: false,
    features: ['Workflow automation', 'Trigger actions', 'Multi-app integration'],
    category: 'automation',
    isPremium: true
  },
  {
    id: 'webhooks',
    provider: 'webhooks',
    name: 'Webhooks',
    description: 'Custom integrations với API endpoints',
    icon: Webhook,
    color: 'bg-gray-600',
    isConnected: false,
    features: ['Custom endpoints', 'Real-time sync', 'API integration'],
    category: 'automation',
    isPremium: true
  },
  {
    id: 'google_analytics',
    provider: 'google-analytics',
    name: 'Google Analytics',
    description: 'Theo dõi productivity metrics',
    icon: BarChart3,
    color: 'bg-yellow-500',
    isConnected: false,
    features: ['Task analytics', 'Time tracking', 'Performance reports'],
    category: 'analytics',
    isPremium: true
  },
  {
    id: 'zoom',
    provider: 'zoom',
    name: 'Zoom',
    description: 'Tạo meetings từ tasks và events',
    icon: Video,
    color: 'bg-blue-500',
    isConnected: false,
    features: ['Auto meeting creation', 'Calendar sync', 'Recording links'],
    category: 'communication'
  }
];

const categoryLabels = {
  calendar: 'Lịch & Thời gian',
  productivity: 'Năng suất',
  communication: 'Giao tiếp',
  development: 'Phát triển',
  analytics: 'Phân tích',
  storage: 'Lưu trữ',
  automation: 'Tự động hóa'
};

export function Integrations() {
  const { toast } = useToast();
  const [integrationList, setIntegrationList] = useState<Integration[]>(integrations);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const handleConnect = async (integration: Integration) => {
    setConnectingId(integration.id);
    
    try {
      // TODO: Implement OAuth 2.0 flow
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock API call to POST /api/integrations/{provider}
      console.log('Connecting to:', integration.provider);
      
      setIntegrationList(prev => 
        prev.map(item => 
          item.id === integration.id 
            ? { 
                ...item, 
                isConnected: true, 
                connectedAt: new Date().toISOString().split('T')[0] 
              }
            : item
        )
      );
      
      toast({
        title: 'Kết nối thành công',
        description: `Đã kết nối với ${integration.name}`
      });
    } catch (error) {
      toast({
        title: 'Lỗi kết nối',
        description: `Không thể kết nối với ${integration.name}`,
        variant: 'destructive'
      });
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (integration: Integration) => {
    try {
      // TODO: Implement API call to DELETE /api/integrations/{provider}
      console.log('Disconnecting from:', integration.provider);
      
      setIntegrationList(prev => 
        prev.map(item => 
          item.id === integration.id 
            ? { 
                ...item, 
                isConnected: false, 
                connectedAt: undefined,
                syncEnabled: false,
                lastSync: undefined
              }
            : item
        )
      );
      
      toast({
        title: 'Ngắt kết nối thành công',
        description: `Đã ngắt kết nối với ${integration.name}`
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: `Không thể ngắt kết nối với ${integration.name}`,
        variant: 'destructive'
      });
    }
  };

  const handleSync = async (integration: Integration) => {
    setSyncingId(integration.id);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrationList(prev => 
        prev.map(item => 
          item.id === integration.id 
            ? { 
                ...item, 
                lastSync: new Date().toLocaleString('vi-VN')
              }
            : item
        )
      );
      
      toast({
        title: 'Đồng bộ thành công',
        description: `Đã đồng bộ dữ liệu với ${integration.name}`
      });
    } catch (error) {
      toast({
        title: 'Lỗi đồng bộ',
        description: `Không thể đồng bộ với ${integration.name}`,
        variant: 'destructive'
      });
    } finally {
      setSyncingId(null);
    }
  };

  const handleToggleSync = (integration: Integration) => {
    setIntegrationList(prev => 
      prev.map(item => 
        item.id === integration.id 
          ? { ...item, syncEnabled: !item.syncEnabled }
          : item
      )
    );
  };

  const filteredIntegrations = integrationList.filter(integration => {
    if (showPremiumOnly && !integration.isPremium) return false;
    if (selectedCategory !== 'all' && integration.category !== selectedCategory) return false;
    return true;
  });

  const groupedIntegrations = filteredIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const connectedCount = integrationList.filter(i => i.isConnected).length;
  const premiumCount = integrationList.filter(i => i.isPremium).length;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tích hợp</h2>
        <p className="text-gray-600">Kết nối với các dịch vụ yêu thích để tăng hiệu quả làm việc</p>
      </div>

      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan tích hợp</CardTitle>
          <CardDescription>Trạng thái kết nối và thống kê</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{connectedCount}</div>
              <div className="text-sm text-gray-500">Đã kết nối</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{integrationList.length}</div>
              <div className="text-sm text-gray-500">Tổng dịch vụ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{premiumCount}</div>
              <div className="text-sm text-gray-500">Premium</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ kết nối</span>
              <span>{Math.round((connectedCount / integrationList.length) * 100)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(connectedCount / integrationList.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Danh mục:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">Tất cả</option>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={showPremiumOnly} 
                onCheckedChange={setShowPremiumOnly}
                id="premium-filter"
              />
              <label htmlFor="premium-filter" className="text-sm font-medium">Chỉ Premium</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {categoryLabels[category as keyof typeof categoryLabels]}
              <Badge variant="secondary">{categoryIntegrations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryIntegrations.map((integration) => {
                const Icon = integration.icon;
                const isConnecting = connectingId === integration.id;
                const isSyncing = syncingId === integration.id;
                
                return (
                  <Card key={integration.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${integration.color} text-white`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {integration.name}
                              {integration.isPremium && (
                                <Badge className="ml-2" variant="outline">Premium</Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {integration.isConnected ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <AlertCircle size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Tính năng:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {integration.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {integration.isConnected && (
                        <div className="space-y-2">
                          {integration.connectedAt && (
                            <div className="text-xs text-gray-500">
                              Kết nối từ {new Date(integration.connectedAt).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                          
                          {integration.lastSync && (
                            <div className="text-xs text-gray-500">
                              Đồng bộ lần cuối: {integration.lastSync}
                            </div>
                          )}
                          
                          {integration.syncEnabled !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">Tự động đồng bộ</span>
                              <Switch
                                checked={integration.syncEnabled}
                                onCheckedChange={() => handleToggleSync(integration)}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {integration.isConnected ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnect(integration)}
                              className="flex-1"
                            >
                              Ngắt kết nối
                            </Button>
                            {integration.syncEnabled !== undefined && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSync(integration)}
                                disabled={isSyncing}
                                className="px-3"
                              >
                                {isSyncing ? (
                                  <Settings size={14} className="animate-spin" />
                                ) : (
                                  <Settings size={14} />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3"
                            >
                              <ExternalLink size={14} />
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => handleConnect(integration)}
                            disabled={isConnecting || (integration.isPremium && !integration.isConnected)}
                            className="flex-1"
                            size="sm"
                          >
                            {isConnecting ? 'Đang kết nối...' : integration.isPremium ? 'Nâng cấp để kết nối' : 'Kết nối'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Cloud Storage Settings */}
      <CloudStorageSettings />

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cần hỗ trợ?</CardTitle>
          <CardDescription>
            Nếu bạn gặp khó khăn trong việc kết nối hoặc cần hỗ trợ thêm, vui lòng tham khảo hướng dẫn hoặc liên hệ với chúng tôi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText size={16} className="mr-2" />
              Xem hướng dẫn
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare size={16} className="mr-2" />
              Liên hệ hỗ trợ
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield size={16} className="mr-2" />
              Bảo mật & Quyền riêng tư
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}