import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { MoonOutlined, SunOutlined, TranslationOutlined } from '@ant-design/icons';
import { SearchBar } from '../SearchBar';
import { useState, useEffect } from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  searchQuery: string;
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
  onSearchChange: (value: string) => void;
}

export function Header({ 
  theme, 
  language, 
  searchQuery,
  onThemeToggle, 
  onLanguageToggle, 
  onSearchChange
}: HeaderProps) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size for responsive placeholder
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Dynamic placeholder based on screen size
  const getSearchPlaceholder = () => {
    if (isMobile) {
      return t('taskBoard.search.mobilePlaceholder', 'Search tasks...');
    }
    return t('taskBoard.search.placeholder');
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm bg-[rgb(var(--bg-container))] border-b border-[rgb(var(--border-color))]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="flex-1 min-w-0 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={getSearchPlaceholder()}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* Language Toggle Button */}
            <Button
              className="h-10 px-3 sm:px-3 rounded-lg font-medium text-sm border border-[rgb(var(--border-color))] 
                         bg-transparent text-[rgb(var(--text-color))] transition-all duration-200 
                         hover:border-[rgb(var(--blue))] hover:text-[rgb(var(--blue))] hover:-translate-y-0.5
                         flex items-center gap-1.5 whitespace-nowrap"
              icon={<TranslationOutlined />}
              onClick={onLanguageToggle}
            >
              <span className="hidden xs:inline sm:inline">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </Button>

            {/* Theme Toggle Button */}
            <Button
              className="h-10 w-10 rounded-lg border border-[rgb(var(--border-color))] 
                         bg-transparent text-[rgb(var(--text-color))] transition-all duration-200
                         hover:border-[rgb(var(--blue))] hover:text-[rgb(var(--blue))] hover:-translate-y-0.5
                         flex items-center justify-center"
              icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
              onClick={onThemeToggle}
              title={t(`common.theme.${theme === 'light' ? 'dark' : 'light'}`)}
            />
          </div>
        </div>
      </header>
      
      {/* Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[rgb(var(--blue))] to-[rgb(var(--blue))/0.7]" />
    </>
  );
}