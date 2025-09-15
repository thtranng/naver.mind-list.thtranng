import tinycolor from 'tinycolor2';

/**
 * Applies a new header color theme by updating CSS custom properties
 * @param userSelectedColor - The color selected by the user (e.g., '#6D28D9')
 */
export function applyNewHeaderColor(userSelectedColor: string): void {
  // Primary color is the user's selected color
  const primaryColor = userSelectedColor;
  
  // Convert to tinycolor for manipulation
  const color = tinycolor(userSelectedColor);
  
  // Calculate secondary color by lightening the primary color by 25%
  const secondaryColor = color.lighten(25).toString();
  
  // Convert hex colors to HSL format for CSS custom properties
  const primaryHsl = tinycolor(primaryColor).toHsl();
  const secondaryHsl = tinycolor(secondaryColor).toHsl();
  
  // Format HSL values for CSS (without alpha)
  const primaryCssValue = `${Math.round(primaryHsl.h)} ${Math.round(primaryHsl.s * 100)}% ${Math.round(primaryHsl.l * 100)}%`;
  const secondaryCssValue = `${Math.round(secondaryHsl.h)} ${Math.round(secondaryHsl.s * 100)}% ${Math.round(secondaryHsl.l * 100)}%`;
  
  // Get root element to update CSS custom properties
  const root = document.documentElement;
  
  // Update the CSS custom properties
  root.style.setProperty('--theme-color-primary', primaryCssValue);
  root.style.setProperty('--theme-color-secondary', secondaryCssValue);
  
  // Save user's color choice to localStorage for persistence
  localStorage.setItem('userThemeColor', primaryColor);
}

/**
 * Loads and applies the saved theme color from localStorage
 */
export function loadSavedThemeColor(): void {
  const savedColor = localStorage.getItem('userThemeColor');
  if (savedColor) {
    applyNewHeaderColor(savedColor);
  }
}

/**
 * Gets the currently saved theme color from localStorage
 * @returns The saved theme color or null if none exists
 */
export function getSavedThemeColor(): string | null {
  return localStorage.getItem('userThemeColor');
}

/**
 * Predefined color options for quick selection
 */
export const predefinedColors = [
  { name: 'Xanh dương mặc định', color: '#2563eb' },
  { name: 'Tím đậm', color: '#6d28d9' },
  { name: 'Xanh lá', color: '#16a34a' },
  { name: 'Cam', color: '#ea580c' },
  { name: 'Hồng', color: '#db2777' },
  { name: 'Xanh ngọc', color: '#0891b2' },
  { name: 'Đỏ', color: '#dc2626' },
  { name: 'Vàng', color: '#ca8a04' }
];