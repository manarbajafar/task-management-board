import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';

interface ProjectDatePickerProps {
  dueDate?: Date;
  onDateChange: (date: Date | null) => void;
}

export function ProjectDatePicker({ dueDate, onDateChange }: ProjectDatePickerProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleNativeDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== NATIVE DATE INPUT DEBUG ===');
    console.log('1. Native input onChange triggered');
    console.log('2. Input value:', event.target.value);
    
    const dateValue = event.target.value;
    const newDate = dateValue ? new Date(dateValue) : null;
    console.log('3. Converted to Date:', newDate);
    
    if (typeof onDateChange === 'function') {
      console.log('4. Calling onDateChange with:', newDate);
      onDateChange(newDate);
      console.log('5. onDateChange called successfully');
    }
    
    setIsEditing(false);
    console.log('6. Set editing to false');
    console.log('=== END NATIVE DATE INPUT DEBUG ===');
  };

  const formatDate = (date: Date) => {
    return dayjs(date).format('MMM DD, YYYY');
  };

  const formatDateMobile = (date: Date) => {
    return dayjs(date).format('MMM DD');
  };

  const getDaysUntilDue = (date: Date) => {
    const today = dayjs();
    const due = dayjs(date);
    const diff = due.diff(today, 'day');
    
    if (diff < 0) return { text: t('projectInfo.overdue'), color: 'rgb(239 68 68)' };
    if (diff === 0) return { text: t('projectInfo.dueToday'), color: 'rgb(245 158 11)' };
    if (diff <= 3) return { text: t('projectInfo.dueSoon'), color: 'rgb(245 158 11)' };
    return { text: `${diff} ${t('projectInfo.daysLeft')}`, color: 'rgb(34 197 94)' };
  };

  React.useEffect(() => {
    console.log('ProjectDatePicker - Props changed:');
    console.log('- dueDate:', dueDate);
    console.log('- onDateChange type:', typeof onDateChange);
  }, [dueDate, onDateChange]);

  if (isEditing) {
    console.log('ProjectDatePicker - Rendering in editing mode');
    return (
      <div className="flex items-center gap-2 w-auto">
        <input
          type="date"
          value={dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : ''}
          onChange={handleNativeDateChange}
          autoFocus
          className="w-40 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            border: '1px solid rgb(var(--border-color))',
            backgroundColor: 'rgb(var(--bg-container))',
            color: 'rgb(var(--text-color))'
          }}
          onBlur={() => {
            // Don't auto-close on blur to allow user to select date
          }}
        />
        
        <Button
          size="small"
          onClick={() => setIsEditing(false)}
          className="flex-shrink-0 text-xs px-2 py-1 h-auto"
        >
          {t('common.cancel')}
        </Button>
      </div>
    );
  }

  console.log('ProjectDatePicker - Rendering in display mode, dueDate:', dueDate);
  return (
    <div className="flex items-center w-auto min-w-0">
      {dueDate ? (
        <Tooltip title={t('projectInfo.clickToEditDate')}>
          <div 
            onClick={() => {
              console.log('Date display clicked - switching to editing mode');
              setIsEditing(true);
            }}
            className="flex items-center gap-2 cursor-pointer p-1 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 w-auto min-w-0"
          >
            {/* Desktop view */}
            <span 
              className="hidden sm:block text-sm font-medium flex-shrink-0"
              style={{ 
                color: 'rgb(var(--text-color))'
              }}
            >
              {formatDate(dueDate)}
            </span>
            
            {/* Mobile view */}
            <span 
              className="sm:hidden text-sm font-medium flex-shrink-0"
              style={{ 
                color: 'rgb(var(--text-color))'
              }}
            >
              {formatDateMobile(dueDate)}
            </span>
            
            <span 
              className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
              style={{
                color: getDaysUntilDue(dueDate).color,
                backgroundColor: `${getDaysUntilDue(dueDate).color}20`
              }}
            >
              {getDaysUntilDue(dueDate).text}
            </span>
          </div>
        </Tooltip>
      ) : (
        <Button
          type="text"
          size="small"
          onClick={() => {
            console.log('Set due date button clicked - switching to editing mode');
            setIsEditing(true);
          }}
          className="text-sm px-2 py-1 h-auto w-auto text-left justify-start"
          style={{ 
            color: 'rgb(var(--text-color) / 0.6)'
          }}
        >
          {t('projectInfo.setDueDate')}
        </Button>
      )}
    </div>
  );
}