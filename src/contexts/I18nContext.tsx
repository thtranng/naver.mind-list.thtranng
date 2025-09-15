import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  vi: {
    // Common
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Chỉnh sửa',
    'common.share': 'Chia sẻ',
    'common.copy': 'Sao chép',
    'common.success': 'Thành công',
    'common.error': 'Lỗi',
    'common.loading': 'Đang tải...',
    'common.confirm': 'Xác nhận',
    'common.close': 'Đóng',
    
    // Settings
    'settings.theme': 'Giao diện',
    'settings.language': 'Ngôn ngữ',
    'settings.theme.light': 'Sáng',
    'settings.theme.dark': 'Tối',
    'settings.theme.system': 'Theo hệ thống',
    'settings.language.changed': 'Đã chuyển sang',
    
    // List management
    'list.name': 'Tên danh sách',
    'list.color': 'Màu sắc',
    'list.icon': 'Biểu tượng',
    'list.pin': 'Ghim',
    'list.unpin': 'Bỏ ghim',
    'list.share': 'Chia sẻ danh sách',
    'list.delete': 'Xóa danh sách',
    
    // Share modal
    'share.title': 'Chia sẻ danh sách',
    'share.link': 'Liên kết',
    'share.email': 'Email',
    'share.social': 'Mạng xã hội',
    'share.shareableLink': 'Liên kết chia sẻ',
    'share.copy.success': 'Đã sao chép liên kết!',
    'share.email.address': 'Địa chỉ email',
    'share.email.placeholder': 'Nhập địa chỉ email...',
    'share.email.send': 'Gửi email',
    'share.whatsapp': 'WhatsApp',
    'share.telegram': 'Telegram'
  },
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.share': 'Share',
    'common.copy': 'Copy',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.loading': 'Loading...',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    
    // Settings
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',
    'settings.language.changed': 'Switched to',
    
    // List management
    'list.name': 'List name',
    'list.color': 'Color',
    'list.icon': 'Icon',
    'list.pin': 'Pin',
    'list.unpin': 'Unpin',
    'list.share': 'Share list',
    'list.delete': 'Delete list',
    
    // Share modal
    'share.title': 'Share List',
    'share.link': 'Link',
    'share.email': 'Email',
    'share.social': 'Social Media',
    'share.shareableLink': 'Shareable Link',
    'share.copy.success': 'Link copied!',
    'share.email.address': 'Email Address',
    'share.email.placeholder': 'Enter email address...',
    'share.email.send': 'Send Email',
    'share.whatsapp': 'WhatsApp',
    'share.telegram': 'Telegram'
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'vi';
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export type { Language };