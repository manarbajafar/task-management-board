import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder, 
  size = 'large',
  className = '',
  style 
}: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div 
      className={`w-full rounded-lg border transition-all duration-200 hover:transform hover:-translate-y-0.5 ${className}`}
      style={{ 
        backgroundColor: 'transparent',
        borderColor: 'rgb(var(--border-color))',
        ...style 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--blue))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--border-color))';
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--blue))';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--border-color))';
      }}
    >
      <Input
        size={size}
        prefix={<SearchOutlined style={{ color: 'rgb(var(--text-color) / 0.5)' }} />}
        placeholder={placeholder || t('common.search.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-0 bg-transparent focus:shadow-none hover:bg-transparent"
        style={{ 
          boxShadow: 'none',
          backgroundColor: 'transparent',
          color: 'rgb(var(--text-color))',
          height: '38px'
        }}
      />
    </div>
  );
}