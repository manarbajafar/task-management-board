import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Space, Tag, Typography, Button, Popconfirm, Tooltip } from 'antd';
import {  CalendarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Task } from '../types/task.types';

const { Text } = Typography;

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onClick, onEdit, onDelete }: TaskCardProps) {
  const { t } = useTranslation();

  const getPriorityClass = (priority: string): string => {
    return `priority-${priority}`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click when clicking action buttons
    if ((e.target as HTMLElement).closest('.task-actions')) {
      return;
    }
    onClick?.();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDelete?.(task.id);
  };

  return (
    <div 
      className="task-card group relative cursor-pointer pt-8"
      onClick={handleCardClick}
    >
      {/* Task Actions */}
      <div className="task-actions absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out z-10">
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={handleEdit}
            className="flex items-center justify-center w-6 h-6 p-0 transition-colors"
            style={{ 
              color: 'rgb(var(--text-color) / 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'rgb(var(--blue))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgb(var(--text-color) / 0.5)';
            }}
          />
          <Popconfirm
            title={t('taskBoard.task.confirmDelete')}
            description={t('taskBoard.task.confirmDeleteDesc')}
            onConfirm={handleDelete}
            okText={t('taskBoard.task.delete')}
            cancelText={t('taskBoard.task.cancel')}
            placement="topRight"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-6 h-6 p-0 transition-colors"
              style={{ 
                color: 'rgb(var(--text-color) / 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgb(239 68 68)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgb(var(--text-color) / 0.5)';
              }}
            />
          </Popconfirm>
        </Space>
      </div>

      {/* Task Title - Completely separate row */}
      <div className="w-full mt-4">
        <Text 
          className="task-title block text-base font-semibold leading-tight break-words"
          style={{ color: 'rgb(var(--text-color))' }}
        >
          {task.title}
        </Text>
      </div>
      
      {/* Task Description */}
      {task.description && (
        <div>
          <Text 
            className="task-description block text-sm leading-relaxed"
            style={{ color: 'rgb(var(--text-color) / 0.7)' }}
          >
            {task.description}
          </Text>
        </div>
      )}
      
      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="mt-3 mb-1 flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <Tag 
              key={tag} 
              className="text-xs"
              style={{
                backgroundColor: 'rgb(var(--bg-hover))',
                color: 'rgb(var(--text-color))',
                border: '1px solid rgb(var(--border-color))'
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Priority */}
        <Tag 
          className={`${getPriorityClass(task.priority)} text-xs border-0 mt-1`}
        >
          {t(`taskBoard.priority.${task.priority}`)}
        </Tag>
        
        {/* Assignee  */}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <Tooltip title={`${task.assignee.name}`}>
              <Avatar
                size="default"
                style={{
                  backgroundColor: 'rgb(var(--blue))',
                  color: 'white',
                  border: '2px solid rgb(var(--bg-container))',
                  fontSize: '14px'
                }}
              >
                {task.assignee.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          </div>
        )}
      </div>
      
      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center gap-1 mt-2">
          <CalendarOutlined 
            className="text-xs" 
            style={{ color: 'rgb(var(--text-color) / 0.4)' }}
          />
          <Text 
            className="text-xs"
            style={{ color: 'rgb(var(--text-color) / 0.6)' }}
          >
            {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        </div>
      )}
    </div>
  );
}