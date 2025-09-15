import React, { useState } from 'react';
import { Menu, Search, Flame, User } from 'lucide-react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { SmartSearchBar } from '../search/SmartSearchBar';
import { LevelIndicator } from './LevelIndicator';
import { UserProfile } from './UserProfile';
import { NotificationCenter } from './NotificationCenter';
import { AuthModal } from '../auth/AuthModal';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onToggleSidebar }: HeaderProps) {
   const { state, dispatch } = useApp();
   const { isAuthenticated, setIsAuthenticated } = useAuth();
   const { t } = useLanguage();
   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
   const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleTryLogin = () => {
    const tryUser = {
      id: 'try-user',
      name: 'Try User',
      email: 'try@example.com',
      username: 'try_user',
      avatarUrl: null
    };
    dispatch({ type: 'SET_USER', payload: tryUser });
    setIsAuthenticated(true);
  };

  return (
    <>
      <header className="mind-list-header h-15 flex">
        {/* Hộp Con #1 (Bên trái): Logo với chiều rộng bằng sidebar */}
        <div className="w-80 flex items-center px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1 hover:bg-white/10 rounded transition-colors mr-4"
          >
            <Menu size={20} />
          </button>
          
          <Logo />
        </div>

        {/* Hộp Con #2 (Bên phải): Navigation và controls */}
        <div className="flex-1 flex items-center justify-between px-4 py-3">
          {/* Desktop Navigation - căn trái */}
          <div className="hidden md:block">
            <Navigation />
          </div>
          
          {/* Mobile Navigation placeholder */}
          <div className="md:hidden"></div>

          {/* Controls - căn phải */}
          <div className="flex items-center gap-4">
            <SmartSearchBar 
              placeholder="Search"
              className="w-64"
            />
            <LevelIndicator />
            <NotificationCenter />
            {state.user ? (
              <UserProfile user={state.user} />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTryLogin}
                  className="px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  Try now
                </button>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  {t('auth.login')}
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-white/90 rounded-lg transition-colors text-sm font-medium"
                >
                  {t('auth.signup')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}