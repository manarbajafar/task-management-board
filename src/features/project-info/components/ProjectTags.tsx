import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Input, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ProjectTagsProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  maxTags?: number;
}

export function ProjectTags({ 
  tags, 
  onAddTag, 
  onRemoveTag, 
  maxTags = 5 
}: ProjectTagsProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim()) && tags.length < maxTags) {
      onAddTag(inputValue.trim());
      setInputValue('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    } else if (e.key === 'Escape') {
      setInputValue('');
      setIsAdding(false);
    }
  };

  const tagColors = [
    { bg: 'rgb(59 130 246 / 0.1)', color: 'rgb(59 130 246)', border: 'rgb(59 130 246 / 0.3)' }, // blue
    { bg: 'rgb(34 197 94 / 0.1)', color: 'rgb(34 197 94)', border: 'rgb(34 197 94 / 0.3)' }, // green
    { bg: 'rgb(245 158 11 / 0.1)', color: 'rgb(245 158 11)', border: 'rgb(245 158 11 / 0.3)' }, // amber
    { bg: 'rgb(168 85 247 / 0.1)', color: 'rgb(168 85 247)', border: 'rgb(168 85 247 / 0.3)' }, // purple
    { bg: 'rgb(239 68 68 / 0.1)', color: 'rgb(239 68 68)', border: 'rgb(239 68 68 / 0.3)' }, // red
  ];

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      
      {/* Existing Tags */}
      {tags.map((tag, index) => {
        const colorScheme = getTagColor(index);
        return (
          <Tag
            key={tag}
            closable
            onClose={() => onRemoveTag(tag)}
            style={{
              backgroundColor: colorScheme.bg,
              color: colorScheme.color,
              border: `1px solid ${colorScheme.border}`,
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              margin: 0
            }}
            className="cursor-pointer"
          >
            {tag}
          </Tag>
        );
      })}

      {/* Add Tag Input */}
      {isAdding ? (
        <Input
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={() => {
            if (inputValue.trim()) {
              handleAddTag();
            } else {
              setIsAdding(false);
            }
          }}
          placeholder={t('projectInfo.enterTag')}
          autoFocus
          style={{ 
            width: 140,
            borderRadius: '12px',
            flexShrink: 0
          }}
        />
      ) : (
        /* Add Tag Button */
        tags.length < maxTags && (
          <Tooltip title={t('projectInfo.addTag')}>
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setIsAdding(true)}
              style={{
                color: 'rgb(var(--text-color) / 0.6)',
                border: '1px dashed rgb(var(--border-color))',
                borderRadius: '12px',
                height: '24px',
                padding: '0 8px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="hover:border-blue-400 hover:text-blue-500"
            >
              {tags.length === 0 ? t('projectInfo.addTags') : ''}
            </Button>
          </Tooltip>
        )
      )}

      {/* Empty state message */}
      {tags.length === 0 && !isAdding && (
        <span 
          style={{ 
            color: 'rgb(var(--text-color) / 0.4)',
            fontSize: '12px',
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
        </span>
      )}
      
      {/* Tag Limit Indicator */}
      {tags.length >= maxTags && (
        <span 
          style={{ 
            color: 'rgb(var(--text-color) / 0.5)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {t('projectInfo.maxTagsReached')}
        </span>
      )}
    </div>
  );
}