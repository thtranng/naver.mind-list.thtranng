import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Globe, Palette, Check, Sparkles, Settings } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { applyNewHeaderColor, loadSavedThemeColor, getSavedThemeColor, predefinedColors } from '@/lib/colorUtils';
import { PremiumFeatureLock } from '@/components/ui/PremiumFeatureLock';
import { getUserProfile } from '@/services/mockApi';

type Theme = 'light' | 'dark' | 'system';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface LanguageOption {
  value: Language;
  label: string;
  flag: string;
}

const themeOptions: ThemeOption[] = [
  {
    value: 'light',
    label: 'Sáng',
    icon: Sun,
    description: 'Giao diện sáng'
  },
  {
    value: 'dark',
    label: 'Tối',
    icon: Moon,
    description: 'Giao diện tối'
  },
  {
    value: 'system',
    label: 'Theo hệ thống',
    icon: Monitor,
    description: 'Tự động theo cài đặt hệ thống'
  }
];

const languageOptions: LanguageOption[] = [
  {
    value: 'vi',
    label: 'Tiếng Việt',
    flag: '🇻🇳'
  },
  {
    value: 'en',
    label: 'English',
    flag: '🇺🇸'
  }
];

export function InterfaceDisplay() {
  const { toast } = useToast();
  const { state, dispatch } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState<Theme>('system');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [customColor, setCustomColor] = useState('#2563eb');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHeaderColorUnlocked, setIsHeaderColorUnlocked] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColor = getSavedThemeColor();

    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }

    setSelectedLanguage(language);

    if (savedColor) {
      setCustomColor(savedColor);
      dispatch({ type: 'SET_THEME_COLOR', payload: savedColor });
      // Load and apply the saved color on component mount
      loadSavedThemeColor();
    }
  }, [dispatch]);

  // Load user profile and check premium features
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });

        // Check if user has unlocked dark_mode_pro
        if (userProfile && userProfile.unlocked_items) {
          const hasHeaderColorFeature = userProfile.unlocked_items.includes('dark_mode_pro');
          setIsHeaderColorUnlocked(hasHeaderColorFeature);
        } else {
          setIsHeaderColorUnlocked(false);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Default to locked state if API fails
        setIsHeaderColorUnlocked(false);
      }
    };

    loadUserProfile();
  }, [dispatch]);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', selectedTheme === 'dark');
    }
  }, [selectedTheme]);

  // Auto-sync language to display
  useEffect(() => {
    // Automatically sync language changes to the display
    if (selectedLanguage !== language) {
      setSelectedLanguage(language);
    }
    
    // Update document language attribute for accessibility
    document.documentElement.lang = language === 'vi' ? 'vi-VN' : 'en-US';
  }, [language, selectedLanguage]);

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme);

    toast({
      title: 'Thành công',
      description: `Đã chuyển sang chế độ ${themeOptions.find(t => t.value === theme)?.label.toLowerCase()}`
    });
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setLanguage(language);
    
    toast({
      title: t('common.success'),
      description: `${t('settings.language.changed')} ${languageOptions.find(l => l.value === language)?.label}`
    });
  };

  const handlePredefinedColorChange = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex);
    const selectedColor = predefinedColors[colorIndex];

    // Apply the new color using colorUtils
    applyNewHeaderColor(selectedColor.color);

    // Update app context
    dispatch({ type: 'SET_THEME_COLOR', payload: selectedColor.color });

    // Update custom color input to match
    setCustomColor(selectedColor.color);

    toast({
      title: "Màu sắc Header đã được cập nhật",
      description: `Đã chuyển sang ${selectedColor.name}`,
    });
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);

    // Apply the new color using colorUtils
    applyNewHeaderColor(color);

    // Update app context
    dispatch({ type: 'SET_THEME_COLOR', payload: color });

    // Reset predefined color selection
    setSelectedColorIndex(-1);

    toast({
      title: "Màu sắc Header đã được cập nhật",
      description: "Đã áp dụng màu tùy chỉnh",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Giao diện & Hiển thị</h2>
        <p className="text-gray-600">Tùy chỉnh giao diện và ngôn ngữ hiển thị</p>
      </div>

      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Ngôn ngữ
          </CardTitle>
          <CardDescription>
            Chọn ngôn ngữ hiển thị cho ứng dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languageOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  selectedLanguage === option.value
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={option.value}
                  checked={selectedLanguage === option.value}
                  onChange={() => handleLanguageChange(option.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{option.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                  </div>
                </div>
                {selectedLanguage === option.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chế độ hiển thị
          </CardTitle>
          <CardDescription>
            Chọn chế độ sáng, tối hoặc theo hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`relative flex flex-col items-center gap-3 p-6 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedTheme === option.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={selectedTheme === option.value}
                    onChange={() => handleThemeChange(option.value)}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-full ${
                    selectedTheme === option.value ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon
                      size={24}
                      className={selectedTheme === option.value ? 'text-blue-600' : 'text-gray-500'}
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                  </div>
                  {selectedTheme === option.value && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Header Color Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Màu sắc Header
              </CardTitle>
              <CardDescription>
                Tùy chỉnh màu sắc cho thanh header
              </CardDescription>
            </div>
            {isHeaderColorUnlocked && (
              <Badge variant="default" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>

          {isHeaderColorUnlocked ? (
            <div className="space-y-6">
              {/* Predefined Colors */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Màu có sẵn</h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {predefinedColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handlePredefinedColorChange(index)}
                      className={`relative group p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                        selectedColorIndex === index
                          ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded-md mb-2 shadow-sm"
                        style={{
                          backgroundColor: color.color
                        }}
                      ></div>
                      <div className="text-xs font-medium text-gray-700 text-center truncate">{color.name}</div>
                      {selectedColorIndex === index && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Color Picker */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Màu tùy chỉnh</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer shadow-sm"
                    />
                    <div className="flex-1">
                      <Label htmlFor="custom-color" className="text-sm text-gray-600">Mã màu</Label>
                      <input
                        id="custom-color"
                        type="text"
                        value={customColor}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                        placeholder="#2563eb"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCustomColorChange(customColor)}
                    className="sm:self-end"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <PremiumFeatureLock
              featureName="Tùy chỉnh màu sắc Header"
              requiredItem="dark_mode_pro"
              requiredItemName="Chủ đề Dark Mode Pro"
              description="Sở hữu Chủ đề Dark Mode Pro để mở khóa tùy chỉnh màu sắc Header."
              className="min-h-[200px]"
            >
              {/* Disabled Color Options Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Màu có sẵn</h4>
                <div className="grid grid-cols-4 gap-3">
                  {predefinedColors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border-2 border-gray-200 opacity-60"
                    >
                      <div
                        className="w-full h-6 rounded-md mb-2"
                        style={{
                          backgroundColor: color.color
                        }}
                      ></div>
                      <div className="text-xs font-medium text-gray-700 text-center">{color.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Màu tùy chỉnh</h4>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 border border-gray-300 rounded-lg bg-blue-500 opacity-60"></div>
                  <input
                    type="text"
                    value="#2563eb"
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    placeholder="#2563eb"
                  />
                  <Button disabled variant="secondary">
                    Áp dụng
                  </Button>
                </div>
              </div>
            </PremiumFeatureLock>
          )}
        </CardContent>
      </Card>


    </div>
  );
}