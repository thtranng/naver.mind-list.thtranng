import React, { useState, useEffect } from 'react';
import { Zap, Calendar, Brain, Clock, Target, Sparkles, Bot, TrendingUp, Settings, Crown, Star, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SmartFeature {
  id: string;
  feature: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  category: 'automation' | 'intelligence' | 'productivity';
  isPremium?: boolean;
}

const smartFeatures: SmartFeature[] = [
  {
    id: 'my_day_list',
    feature: 'MY_DAY_AUTO_POPULATE',
    title: 'Danh sách "Ngày của tôi" tự động',
    description: 'Tự động thêm các task quan trọng vào danh sách hàng ngày',
    icon: Calendar,
    enabled: true,
    category: 'automation'
  },
  {
    id: 'smart_date_recognition',
    feature: 'SMART_DATE_RECOGNITION',
    title: 'Nhận diện ngày tháng thông minh',
    description: 'Tự động phát hiện và đặt ngày hạn từ văn bản ("ngày mai", "thứ 2 tuần sau")',
    icon: Brain,
    enabled: false,
    category: 'intelligence'
  },
  {
    id: 'auto_categorization',
    feature: 'AUTO_CATEGORIZATION',
    title: 'Phân loại task tự động',
    description: 'AI tự động gợi ý danh sách phù hợp cho task mới',
    icon: Bot,
    enabled: true,
    category: 'intelligence',
    isPremium: true
  },
  {
    id: 'smart_reminders',
    feature: 'SMART_REMINDERS',
    title: 'Nhắc nhở thông minh',
    description: 'Đặt thời gian nhắc nhở dựa trên độ ưu tiên và deadline',
    icon: Clock,
    enabled: false,
    category: 'automation'
  },
  {
    id: 'focus_mode',
    feature: 'FOCUS_MODE',
    title: 'Chế độ tập trung',
    description: 'Tự động ẩn các task không liên quan khi làm việc',
    icon: Target,
    enabled: true,
    category: 'productivity'
  },
  {
    id: 'productivity_insights',
    feature: 'PRODUCTIVITY_INSIGHTS',
    title: 'Thống kê năng suất',
    description: 'Phân tích thói quen làm việc và đưa ra gợi ý cải thiện',
    icon: TrendingUp,
    enabled: false,
    category: 'productivity',
    isPremium: true
  },
  {
    id: 'smart_scheduling',
    feature: 'SMART_SCHEDULING',
    title: 'Lập lịch thông minh',
    description: 'Gợi ý thời gian tối ưu để thực hiện các task',
    icon: Sparkles,
    enabled: false,
    category: 'automation',
    isPremium: true
  }
];

const categoryLabels = {
  automation: 'Tự động hóa',
  intelligence: 'Trí tuệ nhân tạo',
  productivity: 'Năng suất'
};

const categoryIcons = {
  automation: Zap,
  intelligence: Brain,
  productivity: Target
};

export function SmartFeatures() {
  const { toast } = useToast();
  const [features, setFeatures] = useState<SmartFeature[]>(smartFeatures);
  const [aiSensitivity, setAiSensitivity] = useState([70]);
  const [learningMode, setLearningMode] = useState('adaptive');
  const [autoSaveFrequency, setAutoSaveFrequency] = useState('5min');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedFeatures = localStorage.getItem('smartFeatures');
    const savedAiSensitivity = localStorage.getItem('aiSensitivity');
    const savedLearningMode = localStorage.getItem('learningMode');
    const savedAutoSaveFrequency = localStorage.getItem('autoSaveFrequency');

    if (savedFeatures) {
      try {
        const parsedFeatures = JSON.parse(savedFeatures);
        setFeatures(parsedFeatures);
      } catch (error) {
        console.error('Failed to parse saved smart features:', error);
      }
    }

    if (savedAiSensitivity) {
      setAiSensitivity([parseInt(savedAiSensitivity)]);
    }

    if (savedLearningMode) {
      setLearningMode(savedLearningMode);
    }

    if (savedAutoSaveFrequency) {
      setAutoSaveFrequency(savedAutoSaveFrequency);
    }
  }, []);

  // Save AI sensitivity to localStorage
  const handleAiSensitivityChange = (value: number[]) => {
    setAiSensitivity(value);
    localStorage.setItem('aiSensitivity', value[0].toString());
  };

  // Save learning mode to localStorage
  const handleLearningModeChange = (mode: string) => {
    setLearningMode(mode);
    localStorage.setItem('learningMode', mode);
  };

  // Save auto save frequency to localStorage
  const handleAutoSaveFrequencyChange = (frequency: string) => {
    setAutoSaveFrequency(frequency);
    localStorage.setItem('autoSaveFrequency', frequency);
  };

  const handleToggle = async (featureId: string, enabled: boolean) => {
    const feature = features.find(f => f.id === featureId);
    
    // Check if premium feature
    if (feature?.isPremium && enabled) {
      toast({
        title: 'Tính năng Premium',
        description: 'Tính năng này yêu cầu gói Premium. Vui lòng nâng cấp tài khoản.',
        variant: 'destructive'
      });
      return;
    }

    // Update local state immediately
    const updatedFeatures = features.map(f => 
      f.id === featureId 
        ? { ...f, enabled }
        : f
    );
    setFeatures(updatedFeatures);
    
    // Save to localStorage
    localStorage.setItem('smartFeatures', JSON.stringify(updatedFeatures));

    try {
      // TODO: Implement API call to PUT /api/settings/features
      if (feature) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock API payload: { "feature": "SMART_DATE_RECOGNITION", "enabled": false }
        console.log('API Call:', {
          feature: feature.feature,
          enabled
        });
        
        toast({
          title: 'Thành công',
          description: `${enabled ? 'Bật' : 'Tắt'} tính năng "${feature.title}"`
        });
      }
    } catch (error) {
      // Revert on error
      setFeatures(prev => 
        prev.map(f => 
          f.id === featureId 
            ? { ...f, enabled: !enabled }
            : f
        )
      );
      
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật cài đặt tính năng',
        variant: 'destructive'
      });
    }
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, SmartFeature[]>);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Cài đặt Thông minh
          </CardTitle>
          <CardDescription>
            Kích hoạt các tính năng AI và tự động hóa để tăng hiệu quả làm việc
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cấu hình AI
          </CardTitle>
          <CardDescription>
            Tùy chỉnh cách AI hoạt động và học hỏi từ thói quen của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Sensitivity */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Độ nhạy AI: {aiSensitivity[0]}%</Label>
            <p className="text-sm text-gray-500">Điều chỉnh mức độ tích cực của AI trong việc đưa ra gợi ý</p>
            <Slider
              value={aiSensitivity}
              onValueChange={handleAiSensitivityChange}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Thận trọng</span>
              <span>Cân bằng</span>
              <span>Tích cực</span>
            </div>
          </div>

          {/* Learning Mode */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Chế độ học</Label>
            <Select value={learningMode} onValueChange={handleLearningModeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Thận trọng - Ít thay đổi</SelectItem>
                <SelectItem value="adaptive">Thích ứng - Cân bằng</SelectItem>
                <SelectItem value="aggressive">Tích cực - Học nhanh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Auto-save Frequency */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tần suất tự động lưu</Label>
            <Select value={autoSaveFrequency} onValueChange={handleAutoSaveFrequencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1min">Mỗi phút</SelectItem>
                <SelectItem value="5min">Mỗi 5 phút</SelectItem>
                <SelectItem value="15min">Mỗi 15 phút</SelectItem>
                <SelectItem value="30min">Mỗi 30 phút</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Smart Features by Category */}
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => {
        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5 text-blue-600" />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          feature.isPremium ? 'bg-gradient-to-br from-purple-100 to-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon size={20} className={feature.isPremium ? 'text-purple-600' : 'text-gray-600'} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={feature.id} className="text-base font-medium text-gray-900 cursor-pointer">
                              {feature.title}
                            </Label>
                            {feature.isPremium && (
                              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      
                      <Switch
                        id={feature.id}
                        checked={feature.enabled}
                        onCheckedChange={(checked) => handleToggle(feature.id, checked)}
                        disabled={feature.isPremium && !feature.enabled}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Active Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Tính năng đang hoạt động
          </CardTitle>
          <CardDescription>
            Các tính năng thông minh hiện đang hỗ trợ bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {features.filter(f => f.enabled).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.filter(f => f.enabled).map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{feature.title}</span>
                      {feature.isPremium && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Chưa có tính năng thông minh nào được kích hoạt
              </p>
              <Button variant="outline" onClick={() => {
                setFeatures(prev => prev.map(f => 
                  !f.isPremium ? { ...f, enabled: true } : f
                ));
                toast({ title: 'Thành công', description: 'Đã bật các tính năng cơ bản' });
              }}>
                Bật tính năng cơ bản
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Hiệu suất AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-gray-500">Độ chính xác gợi ý</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+23%</div>
              <div className="text-sm text-gray-500">Tăng năng suất</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-500">Task được tối ưu</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Upgrade CTA */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5" />
                <h4 className="text-lg font-semibold">Nâng cấp lên Premium</h4>
              </div>
              <p className="text-purple-100 mb-4">
                Mở khóa tất cả tính năng AI và nhận được nhiều insights hơn về năng suất làm việc
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>AI nâng cao</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Phân tích chi tiết</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Tự động hóa</span>
                </div>
              </div>
            </div>
            <Button 
              className="bg-white text-purple-600 hover:bg-purple-50 font-medium"
              onClick={() => {
                toast({ 
                  title: 'Chuyển hướng', 
                  description: 'Đang chuyển đến trang nâng cấp...' 
                });
              }}
            >
              Nâng cấp ngay
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}