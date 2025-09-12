import React from 'react';
import { Search, Flame, Calendar, BarChart3, List } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const Header: React.FC = () => {
  const { activeView, setActiveView, user } = useAppStore();

  const navigationItems = [
    { id: 'list' as const, label: 'List', icon: List },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between border-b">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary-foreground rounded flex items-center justify-center">
          <List className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold sketchy">MIND LIST</h1>
      </div>

      {/* Navigation & Search */}
      <div className="flex items-center space-x-6">
        {/* Navigation Tabs */}
        <nav className="flex bg-primary-foreground/10 rounded-lg p-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg pl-10 pr-4 py-2 text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30 focus:bg-primary-foreground/20"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Streak Counter */}
        <div className="flex items-center space-x-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="font-bold text-lg">{user.streak}</span>
          <span className="text-sm font-medium">STREAK</span>
        </div>

        {/* Profile Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <span className="text-sm font-semibold">{user.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;