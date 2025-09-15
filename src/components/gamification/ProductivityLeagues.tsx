import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Diamond, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductivityLeaguesProps {
  className?: string;
}

interface LeaguePlayer {
  id: string;
  name: string;
  avatar?: string;
  weeklyXP: number;
  level: number;
  position: number;
  trend: 'up' | 'down' | 'same';
}

interface League {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  minLevel: number;
  description: string;
}

const LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Đồng',
    icon: <Medal className="w-5 h-5" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    minLevel: 1,
    description: 'Giải đấu dành cho người mới bắt đầu'
  },
  {
    id: 'silver',
    name: 'Bạc',
    icon: <Award className="w-5 h-5" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    minLevel: 10,
    description: 'Dành cho những người có kinh nghiệm'
  },
  {
    id: 'gold',
    name: 'Vàng',
    icon: <Trophy className="w-5 h-5" />,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    minLevel: 25,
    description: 'Giải đấu cho các chuyên gia'
  },
  {
    id: 'platinum',
    name: 'Bạch Kim',
    icon: <Crown className="w-5 h-5" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    minLevel: 40,
    description: 'Dành cho những bậc thầy'
  },
  {
    id: 'diamond',
    name: 'Kim Cương',
    icon: <Diamond className="w-5 h-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    minLevel: 60,
    description: 'Giải đấu cao nhất - Chỉ dành cho huyền thoại'
  }
];

// Mock data for league players
const generateMockPlayers = (userPosition: number, userWeeklyXP: number): LeaguePlayer[] => {
  const players: LeaguePlayer[] = [];
  
  // Generate 30 players
  for (let i = 1; i <= 30; i++) {
    if (i === userPosition) {
      // User's data
      players.push({
        id: 'user',
        name: 'Bạn',
        weeklyXP: userWeeklyXP,
        level: 12,
        position: i,
        trend: 'same'
      });
    } else {
      // Generate random players
      const baseXP = Math.max(50, userWeeklyXP + (userPosition - i) * 20 + Math.random() * 100 - 50);
      players.push({
        id: `player-${i}`,
        name: `Người chơi ${i}`,
        weeklyXP: Math.floor(baseXP),
        level: Math.floor(Math.random() * 20) + 5,
        position: i,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same'
      });
    }
  }
  
  return players.sort((a, b) => b.weeklyXP - a.weeklyXP).map((player, index) => ({
    ...player,
    position: index + 1
  }));
};

export function ProductivityLeagues({ className }: ProductivityLeaguesProps) {
  const { state } = useApp();
  const { gamification } = state;
  const { weeklyXP, leaguePosition, leagueName } = gamification;
  
  const [players, setPlayers] = useState<LeaguePlayer[]>([]);
  const [currentLeague, setCurrentLeague] = useState<League | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  // Find current league
  useEffect(() => {
    const league = LEAGUES.find(l => l.name === leagueName) || LEAGUES[1]; // Default to Silver
    setCurrentLeague(league);
  }, [leagueName]);

  // Generate mock players
  useEffect(() => {
    const mockPlayers = generateMockPlayers(leaguePosition, weeklyXP);
    setPlayers(mockPlayers);
  }, [leaguePosition, weeklyXP]);

  // Calculate time left in week
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const nextMonday = new Date();
      nextMonday.setDate(now.getDate() + (7 - now.getDay() + 1) % 7);
      nextMonday.setHours(0, 0, 0, 0);
      
      const diff = nextMonday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ days, hours, minutes });
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const getPositionColor = (position: number) => {
    if (position <= 5) return 'text-green-600 bg-green-50';
    if (position <= 20) return 'text-blue-600 bg-blue-50';
    return 'text-red-600 bg-red-50';
  };

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (position === 2) return <Trophy className="w-4 h-4 text-gray-400" />;
    if (position === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return null;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const userPlayer = players.find(p => p.id === 'user');

  if (!currentLeague) return null;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${currentLeague.bgColor}`}>
                <div className={currentLeague.color}>
                  {currentLeague.icon}
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">Giải đấu {currentLeague.name}</CardTitle>
                <CardDescription>{currentLeague.description}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Thời gian còn lại</div>
              <div className="text-lg font-bold text-blue-600">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
              <TabsTrigger value="leagues">Các giải đấu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="leaderboard" className="space-y-4">
              {/* User's current position */}
              {userPlayer && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getPositionColor(userPlayer.position)}`}>
                        #{userPlayer.position}
                      </div>
                      <div>
                        <div className="font-medium">Vị trí của bạn</div>
                        <div className="text-sm text-gray-600">{userPlayer.weeklyXP} XP tuần này</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Khu vực</div>
                      <div className="font-medium">
                        {userPlayer.position <= 5 ? 'Thăng hạng 🔥' :
                         userPlayer.position <= 20 ? 'An toàn 😊' : 'Nguy hiểm ⚠️'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Bảng xếp hạng tuần này:</h4>
                <div className="max-h-96 overflow-y-auto space-y-1">
                  {players.map((player) => (
                    <div 
                      key={player.id} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        player.id === 'user' ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            getPositionColor(player.position)
                          }`}>
                            {player.position <= 3 ? getPositionIcon(player.position) : player.position}
                          </div>
                          {getTrendIcon(player.trend)}
                        </div>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`font-medium ${player.id === 'user' ? 'text-blue-700' : ''}`}>
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-500">Lv.{player.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{player.weeklyXP} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone indicators */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
                  <div className="font-medium text-green-700">Top 1-5</div>
                  <div className="text-green-600">Thăng hạng</div>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
                  <div className="font-medium text-blue-700">Top 6-20</div>
                  <div className="text-blue-600">Giữ hạng</div>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
                  <div className="font-medium text-red-700">Top 21-30</div>
                  <div className="text-red-600">Xuống hạng</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="leagues" className="space-y-4">
              <div className="space-y-3">
                {LEAGUES.map((league, index) => {
                  const isCurrentLeague = league.id === currentLeague.id;
                  const isUnlocked = state.gamification.level >= league.minLevel;
                  
                  return (
                    <div 
                      key={league.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCurrentLeague 
                          ? 'border-blue-500 bg-blue-50' 
                          : isUnlocked 
                            ? 'border-gray-200 bg-white' 
                            : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isUnlocked ? league.bgColor : 'bg-gray-100'
                          }`}>
                            <div className={isUnlocked ? league.color : 'text-gray-400'}>
                              {league.icon}
                            </div>
                          </div>
                          <div>
                            <div className={`font-medium ${
                              isCurrentLeague ? 'text-blue-700' : isUnlocked ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              Giải đấu {league.name}
                            </div>
                            <div className="text-sm text-gray-600">{league.description}</div>
                            <div className="text-xs text-gray-500">Yêu cầu: Level {league.minLevel}+</div>
                          </div>
                        </div>
                        <div>
                          {isCurrentLeague && (
                            <Badge variant="default">Hiện tại</Badge>
                          )}
                          {!isUnlocked && (
                            <Badge variant="secondary">Khóa</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">💡 Cách thức hoạt động:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Mỗi tuần bạn sẽ được xếp vào một bảng đấu với 30 người cùng cấp độ</li>
                  <li>• Bảng xếp hạng dựa trên tổng XP kiếm được trong tuần</li>
                  <li>• Top 5: Thăng hạng lên giải đấu cao hơn</li>
                  <li>• Top 6-20: Giữ nguyên hạng hiện tại</li>
                  <li>• Top 21-30: Xuống hạng thấp hơn</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}