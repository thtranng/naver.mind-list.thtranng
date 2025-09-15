import React from 'react';
import { Gem, Calendar, TrendingUp, Users, Trophy, Gift, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GEM_RULES } from '@/services/gemSystem';

interface GemEarningMethod {
  icon: React.ReactNode;
  title: string;
  description: string;
  amount: number;
  frequency: string;
  color: string;
  category: 'daily' | 'progress' | 'social' | 'special';
}

const gemEarningMethods: GemEarningMethod[] = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Đăng nhập hàng ngày',
    description: 'Đăng nhập vào ứng dụng mỗi ngày',
    amount: GEM_RULES.DAILY_LOGIN,
    frequency: 'Hàng ngày',
    color: 'bg-blue-500',
    category: 'daily'
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Lên cấp',
    description: 'Đạt đủ XP để lên cấp độ mới',
    amount: GEM_RULES.LEVEL_UP_BASE,
    frequency: 'Khi lên cấp',
    color: 'bg-purple-500',
    category: 'progress'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Chuỗi 7 ngày',
    description: 'Duy trì streak đăng nhập 7 ngày liên tiếp',
    amount: GEM_RULES.STREAK_7_DAYS,
    frequency: 'Mỗi 7 ngày',
    color: 'bg-orange-500',
    category: 'daily'
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Giới thiệu bạn bè',
    description: 'Mời bạn bè tham gia sử dụng ứng dụng',
    amount: GEM_RULES.REFERRAL,
    frequency: 'Mỗi lời mời',
    color: 'bg-green-500',
    category: 'social'
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: 'Top 3 giải đấu',
    description: 'Đạt vị trí top 3 trong giải đấu tuần',
    amount: GEM_RULES.TOURNAMENT_TOP3,
    frequency: 'Hàng tuần',
    color: 'bg-yellow-500',
    category: 'special'
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: 'Hộp bí ẩn',
    description: 'Mở các hộp quà bí ẩn trong game',
    amount: GEM_RULES.MYSTERY_BOX,
    frequency: 'Ngẫu nhiên',
    color: 'bg-pink-500',
    category: 'special'
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Hoàn thành thành tích',
    description: 'Đạt được các mốc thành tích đặc biệt',
    amount: GEM_RULES.ACHIEVEMENT_MEDIUM,
    frequency: 'Khi đạt được',
    color: 'bg-indigo-500',
    category: 'progress'
  }
];

const categoryLabels = {
  daily: 'Hàng ngày',
  progress: 'Tiến độ',
  social: 'Xã hội',
  special: 'Đặc biệt'
};

const categoryColors = {
  daily: 'bg-blue-100 text-blue-800',
  progress: 'bg-purple-100 text-purple-800',
  social: 'bg-green-100 text-green-800',
  special: 'bg-yellow-100 text-yellow-800'
};

export function GemEarningGuide() {
  const groupedMethods = gemEarningMethods.reduce((acc, method) => {
    if (!acc[method.category]) {
      acc[method.category] = [];
    }
    acc[method.category].push(method);
    return acc;
  }, {} as Record<string, GemEarningMethod[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gem className="w-6 h-6 text-blue-500" />
          Cách kiếm Mind Gems 💎
        </CardTitle>
        <CardDescription>
          Khám phá các cách để kiếm Mind Gems và mua sắm trong Shop
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedMethods).map(([category, methods]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                {categoryLabels[category as keyof typeof categoryLabels]}
              </Badge>
            </div>
            
            <div className="grid gap-3">
              {methods.map((method, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${method.color} text-white`}>
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{method.frequency}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                      <span>+{method.amount}</span>
                      <Gem className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Tips Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Mẹo để kiếm nhiều Gems hơn
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Đăng nhập hàng ngày để duy trì streak và nhận bonus</li>
            <li>• Hoàn thành nhiều task để kiếm XP và lên cấp nhanh hơn</li>
            <li>• Tham gia giải đấu để có cơ hội nhận thưởng lớn</li>
            <li>• Mời bạn bè tham gia để nhận bonus giới thiệu</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}