import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  vi: {
    // App
    'app.name': 'MIND LIST',
    
    // Authentication
    'auth.login': 'Đăng nhập',
    'auth.logout': 'Đăng xuất',
    'auth.signup': 'Đăng ký',
    'auth.try': 'Dùng thử',
    'auth.search': 'Tìm kiếm...',
    
    // Navigation
    'nav.list': 'Danh sách',
    'nav.calendar': 'Lịch',
    'nav.analytics': 'Phân tích',
    'nav.achievements': 'Thành tích',
    'nav.gamification': 'GAMIFICATION',
    
    // Common
    'common.success': 'Thành công',
    'settings.language.changed': 'Đã thay đổi ngôn ngữ thành'
  },
  en: {
    // App
    'app.name': 'MIND LIST',
    
    // Authentication
    'auth.login': 'Log in',
    'auth.logout': 'Log out',
    'auth.signup': 'Sign up',
    'auth.try': 'Try it',
    'auth.search': 'Search...',
    
    // Navigation
    'nav.list': 'List',
    'nav.calendar': 'Calendar',
    'nav.analytics': 'Analytics',
    'nav.achievements': 'Achievements',
    'nav.gamification': 'Gamification',
    
    // Common
    'common.success': 'Success',
    'settings.language.changed': 'Language changed to'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}