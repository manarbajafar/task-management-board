import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Input, Button } from 'antd';
import { UserOutlined, CalendarOutlined, TagOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { UserAssignment } from './UserAssignment';
import { ProjectDatePicker } from './ProjectDatePicker';
import { ProjectTags } from './ProjectTags';
import type { User } from '../../../types/global.types';

const { Title, Text } = Typography;

interface ProjectInfoProps {
  projectName: string;
  assignedUsers?: User[];
  dueDate?: Date;
  tags?: string[];
  onAddUser?: (user: { name: string; email: string }) => void;
  onRemoveUser?: (userId: string) => void;
  onDateChange?: (date: Date | null) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onProjectNameChange?: (newName: string) => void;
}

export function ProjectInfo({ 
  projectName,
  assignedUsers = [],
  dueDate,
  tags = [],
  onAddUser,
  onRemoveUser,
  onDateChange,
  onAddTag,
  onRemoveTag,
  onProjectNameChange
}: ProjectInfoProps) {
  const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  // Default handlers if not provided
  const handleAddUser = onAddUser || ((user) => {
    console.log('Add user:', user);
  });

  const handleDateChange = onDateChange || ((date) => {
    console.log('Date changed:', date);
  });

  const handleAddTag = onAddTag || ((tag) => {
    console.log('Add tag:', tag);
  });

  const handleRemoveTag = onRemoveTag || ((tag) => {
    console.log('Remove tag:', tag);
  });

  const handleProjectNameChange = onProjectNameChange || ((newName) => {
    console.log('Project name changed:', newName);
  });

  const handleSaveName = () => {
    if (tempName.trim() && tempName.trim() !== projectName) {
      handleProjectNameChange(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(projectName);
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div>
      {/* Project Header with Edit Functionality */}
      <div className="mb-4 md:mb-6">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              className="text-xl md:text-2xl font-bold"
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                border: '2px solid rgb(var(--blue))',
                borderRadius: '8px'
              }}
            />
            <Button
              type="text"
              icon={<CheckOutlined />}
              onClick={handleSaveName}
              className="hover:bg-green-50 w-6 h-6 p-0 flex items-center justify-center"
              style={{
                color: 'rgb(34 197 94)'
              }}
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
              className="hover:bg-red-50 w-6 h-6 p-0 flex items-center justify-center"
              style={{
                color: 'rgb(239 68 68)'
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-1 group">
            <Title 
              level={2} 
              className="mb-0 text-xl md:text-2xl font-bold break-words inline-flex items-center"
              style={{ color: 'rgb(var(--text-color))' }}
            >
              {projectName}
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setIsEditingName(true)}
                size="small"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 w-6 h-6 min-w-6 p-0 ml-2 border-none flex items-center justify-center"
                style={{
                  color: 'rgb(var(--text-color) / 0.6)',
                  fontSize: '14px'
                }}
                title={t('projectInfo.editName') || 'Edit project name'}
              />
            </Title>
          </div>
        )}
      </div>

      {/* Project Details  */}
      <div className="space-y-4">
        
        {/* Users Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <UserOutlined 
              style={{ 
                color: 'rgb(var(--text-color) / 0.6)' 
              }} 
            />
            <Text 
              className="text-sm font-medium whitespace-nowrap"
              style={{ 
                color: 'rgb(var(--text-color) / 0.7)'
              }}
            >
              {t('projectInfo.assignedTo')}:
            </Text>
          </div>
          <div className="flex-1 min-w-0">
            <UserAssignment
              assignedUsers={assignedUsers}
              onAddUser={handleAddUser}
              onRemoveUser={onRemoveUser}
            />
          </div>
        </div>

        {/* Due Date Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <CalendarOutlined 
              style={{ 
                color: 'rgb(var(--text-color) / 0.6)' 
              }} 
            />
            <Text 
              className="text-sm font-medium whitespace-nowrap"
              style={{ 
                color: 'rgb(var(--text-color) / 0.7)'
              }}
            >
              {t('projectInfo.dueDate')}:
            </Text>
          </div>
          <div className="flex-1 min-w-0">
            <ProjectDatePicker
              dueDate={dueDate}
              onDateChange={handleDateChange}
            />
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <TagOutlined 
              style={{ 
                color: 'rgb(var(--text-color) / 0.6)' 
              }} 
            />
            <Text 
              className="text-sm font-medium whitespace-nowrap"
              style={{ 
                color: 'rgb(var(--text-color) / 0.7)'
              }}
            >
              {t('projectInfo.tags')}:
            </Text>
          </div>
          <div className="flex-1 min-w-0">
            <ProjectTags
              tags={tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}