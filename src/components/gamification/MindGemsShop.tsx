import React, { useState } from 'react';
import { ShoppingCart, Gem, Snowflake, Palette, Image, Dice6, Shield, Zap, Gift } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface MindGemsShopProps {
  className?: string;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  category: 'utility' | 'cosmetic' | 'premium';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  inStock: boolean;
  owned?: boolean;
  maxOwned?: number;
}

const SHOP_ITEMS: ShopItem[] = [
  // Utility Items
  {
    id: 'streak-freeze',
    name: 'Đóng Băng Chuỗi',
    description: 'Bảo vệ chuỗi ngày của bạn khỏi bị reset khi quên làm việc. Tối đa 2 vật phẩm.',
    price: 200,
    icon: <Snowflake className="w-6 h-6" />,
    category: 'utility',
    rarity: 'rare',
    inStock: true,
    maxOwned: 2
  },
  {
    id: 'double-xp-boost',
    name: 'Tăng Tốc XP',
    description: 'Nhận gấp đôi XP trong 24 giờ tiếp theo. Hiệu quả tức thời!',
    price: 300,
    icon: <Zap className="w-6 h-6" />,
    category: 'utility',
    rarity: 'epic',
    inStock: true
  },
  {
    id: 'task-shield',
    name: 'Khiên Nhiệm Vụ',
    description: 'Bảo vệ bạn khỏi mất XP khi không hoàn thành task trong ngày.',
    price: 150,
    icon: <Shield className="w-6 h-6" />,
    category: 'utility',
    rarity: 'common',
    inStock: true
  },
  
  // Cosmetic Items
  {
    id: 'icon-pack-nature',
    name: 'Bộ Icon Thiên Nhiên',
    description: 'Bộ sưu tập 20 icon đẹp mắt với chủ đề thiên nhiên cho danh sách của bạn.',
    price: 500,
    icon: <Palette className="w-6 h-6" />,
    category: 'cosmetic',
    rarity: 'rare',
    inStock: true
  },
  {
    id: 'icon-pack-tech',
    name: 'Bộ Icon Công Nghệ',
    description: 'Bộ sưu tập 20 icon hiện đại với chủ đề công nghệ và lập trình.',
    price: 500,
    icon: <Palette className="w-6 h-6" />,
    category: 'cosmetic',
    rarity: 'rare',
    inStock: true
  },
  {
    id: 'theme-dark-mode',
    name: 'Chủ Đề Dark Mode Pro',
    description: 'Giao diện tối cao cấp với hiệu ứng gradient và animation mượt mà.',
    price: 800,
    icon: <Image className="w-6 h-6" />,
    category: 'cosmetic',
    rarity: 'epic',
    inStock: true
  },
  {
    id: 'theme-neon',
    name: 'Chủ Đề Neon Glow',
    description: 'Giao diện neon sáng rực với hiệu ứng phát sáng độc đáo.',
    price: 1200,
    icon: <Image className="w-6 h-6" />,
    category: 'cosmetic',
    rarity: 'legendary',
    inStock: true
  },
  
  // Premium Items
  {
    id: 'double-or-nothing',
    name: 'Cược Gấp Đôi',
    description: 'Cược Mind Gems rằng bạn sẽ duy trì chuỗi 7 ngày. Thành công = gấp đôi!',
    price: 1000,
    icon: <Dice6 className="w-6 h-6" />,
    category: 'premium',
    rarity: 'legendary',
    inStock: true
  },
  {
    id: 'mystery-box',
    name: 'Hộp Bí Ẩn',
    description: 'Mở để nhận ngẫu nhiên 1-3 vật phẩm có giá trị. May mắn sẽ mỉm cười!',
    price: 600,
    icon: <Gift className="w-6 h-6" />,
    category: 'premium',
    rarity: 'epic',
    inStock: true
  }
];

const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
};

const RARITY_TEXT_COLORS = {
  common: 'text-gray-700',
  rare: 'text-blue-700',
  epic: 'text-purple-700',
  legendary: 'text-yellow-700'
};

export function MindGemsShop({ className }: MindGemsShopProps) {
  const { state, dispatch } = useApp();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('utility');

  const { mindGems, streakFreezes } = state.gamification;

  const handlePurchase = (item: ShopItem) => {
    if (mindGems < item.price) {
      toast.error('Không đủ Mind Gems để mua vật phẩm này!');
      return;
    }

    if (item.id === 'streak-freeze' && streakFreezes >= (item.maxOwned || 1)) {
      toast.error(`Bạn đã có tối đa ${item.maxOwned} ${item.name}!`);
      return;
    }

    // Deduct gems
    dispatch({ type: 'SPEND_MIND_GEMS', payload: item.price });

    // Add item effects
    switch (item.id) {
      case 'streak-freeze':
        dispatch({ type: 'ADD_STREAK_FREEZE', payload: 1 });
        toast.success(`Đã mua ${item.name}! Chuỗi ngày của bạn được bảo vệ.`);
        break;
      case 'double-xp-boost':
        toast.success(`Đã kích hoạt ${item.name}! XP gấp đôi trong 24h tiếp theo.`);
        break;
      case 'task-shield':
        toast.success(`Đã trang bị ${item.name}! Bạn được bảo vệ khỏi mất XP.`);
        break;
      case 'double-or-nothing':
        toast.success(`Đã tham gia ${item.name}! Chúc bạn may mắn trong 7 ngày tới.`);
        break;
      case 'mystery-box':
        const rewards = Math.floor(Math.random() * 3) + 1;
        dispatch({ type: 'ADD_MIND_GEMS', payload: rewards * 100 });
        toast.success(`Hộp Bí Ẩn mang lại ${rewards * 100} Mind Gems!`);
        break;
      default:
        toast.success(`Đã mua ${item.name} thành công!`);
    }

    setShowPurchaseDialog(false);
    setSelectedItem(null);
  };

  const getItemsByCategory = (category: string) => {
    return SHOP_ITEMS.filter(item => item.category === category);
  };

  const canPurchase = (item: ShopItem) => {
    if (mindGems < item.price) return false;
    if (item.id === 'streak-freeze' && streakFreezes >= (item.maxOwned || 1)) return false;
    return item.inStock;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Mind Gems Shop</CardTitle>
                <CardDescription>Sử dụng Mind Gems để mua các vật phẩm hữu ích</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <Gem className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-purple-700">{mindGems.toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="utility">Tiện ích</TabsTrigger>
              <TabsTrigger value="cosmetic">Trang trí</TabsTrigger>
              <TabsTrigger value="premium">Cao cấp</TabsTrigger>
            </TabsList>
            
            <TabsContent value="utility" className="space-y-4">
              <div className="grid gap-4">
                {getItemsByCategory('utility').map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border-2 ${RARITY_COLORS[item.rarity]}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white ${RARITY_TEXT_COLORS[item.rarity]}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline" className={RARITY_TEXT_COLORS[item.rarity]}>
                              {item.rarity}
                            </Badge>
                            {item.id === 'streak-freeze' && (
                              <Badge variant="secondary">
                                {streakFreezes}/{item.maxOwned}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Gem className="w-4 h-4 text-purple-600" />
                          <span className="font-bold">{item.price}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedItem(item);
                            setShowPurchaseDialog(true);
                          }}
                          disabled={!canPurchase(item)}
                          variant={canPurchase(item) ? "default" : "secondary"}
                        >
                          {canPurchase(item) ? 'Mua' : 'Không thể mua'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cosmetic" className="space-y-4">
              <div className="grid gap-4">
                {getItemsByCategory('cosmetic').map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border-2 ${RARITY_COLORS[item.rarity]}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white ${RARITY_TEXT_COLORS[item.rarity]}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline" className={RARITY_TEXT_COLORS[item.rarity]}>
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Gem className="w-4 h-4 text-purple-600" />
                          <span className="font-bold">{item.price}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedItem(item);
                            setShowPurchaseDialog(true);
                          }}
                          disabled={!canPurchase(item)}
                          variant={canPurchase(item) ? "default" : "secondary"}
                        >
                          {canPurchase(item) ? 'Mua' : 'Không đủ Gems'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="premium" className="space-y-4">
              <div className="grid gap-4">
                {getItemsByCategory('premium').map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border-2 ${RARITY_COLORS[item.rarity]}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white ${RARITY_TEXT_COLORS[item.rarity]}`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge variant="outline" className={RARITY_TEXT_COLORS[item.rarity]}>
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Gem className="w-4 h-4 text-purple-600" />
                          <span className="font-bold">{item.price}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedItem(item);
                            setShowPurchaseDialog(true);
                          }}
                          disabled={!canPurchase(item)}
                          variant={canPurchase(item) ? "default" : "secondary"}
                        >
                          {canPurchase(item) ? 'Mua' : 'Không đủ Gems'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* How to earn gems */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">💎 Cách kiếm Mind Gems:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Duy trì chuỗi ngày (mỗi 7 ngày: +50 Gems)</li>
              <li>• Lên cấp (mỗi cấp: +100 Gems)</li>
              <li>• Đạt Top 3 trong giải đấu tuần</li>
              <li>• Hoàn thành các thành tích đặc biệt</li>
              <li>• Mở Hộp Bí Ẩn (may mắn!)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem?.icon}
              Xác nhận mua {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>Giá:</span>
              <div className="flex items-center gap-1">
                <Gem className="w-4 h-4 text-purple-600" />
                <span className="font-bold">{selectedItem?.price}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>Số dư hiện tại:</span>
              <div className="flex items-center gap-1">
                <Gem className="w-4 h-4 text-purple-600" />
                <span className="font-bold">{mindGems}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span>Số dư sau khi mua:</span>
              <div className="flex items-center gap-1">
                <Gem className="w-4 h-4 text-purple-600" />
                <span className="font-bold">{mindGems - (selectedItem?.price || 0)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => selectedItem && handlePurchase(selectedItem)} 
                className="flex-1"
                disabled={!selectedItem || !canPurchase(selectedItem)}
              >
                Xác nhận mua
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPurchaseDialog(false)} 
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}