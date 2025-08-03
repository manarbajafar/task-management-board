import { useTranslation } from 'react-i18next';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { DraggableTaskCard } from '../../tasks/components/DraggableTaskCard';
import type { Task } from '../../tasks/types/task.types';
import type { TaskStatus } from '../../../types/global.types';

const { Text } = Typography;

interface ColumnProps {
  id: TaskStatus;
  statusClass: string;
  tasks: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddTask?: (status: TaskStatus) => void;
}

export function Column({ id, statusClass, tasks, onTaskEdit, onTaskDelete, onAddTask }: ColumnProps) {
  const { t } = useTranslation();
  
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      type: 'column',
      status: id
    }
  });

  const style = {
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
    transition: 'background-color 200ms ease',
  };

  return (
    <div 
      ref={setNodeRef}
      className={`column-container ${statusClass} h-full flex flex-col`}
      style={style}
    >
      {/* Column Header - Title with Task Count */}
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        <div className="flex items-center gap-2">
          <Text 
            className="column-title font-semibold"
            style={{ color: 'rgb(var(--text-color))' }}
          >
            {t(`taskBoard.columns.${id}`)}
          </Text>
          <span 
            className="task-count px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgb(var(--bg-hover))',
              color: 'rgb(var(--text-color) / 0.7)',
              border: '1px solid rgb(var(--border-color))'
            }}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex flex-col flex-1 px-4 pb-4">
        {/* Tasks List with proper spacing */}
        <div className="flex-1 space-y-3 min-h-20">
          {tasks.map(task => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))}

          {/* Empty State - Only show when no tasks */}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Text 
                className="text-sm"
                style={{ color: 'rgb(var(--text-color) / 0.4)' }}
              >
                {t('taskBoard.empty.noTasks')}
              </Text>
            </div>
          )}
        </div>

        {/* Add Task Button at Bottom */}
        <div className="mt-4">
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => onAddTask?.(id)}
            className="w-full flex items-center justify-center gap-2 border-dashed transition-all duration-200"
            style={{
              height: '44px',
              borderRadius: '8px',
              borderColor: 'rgb(var(--border-color))',
              color: 'rgb(var(--text-color) / 0.6)',
              border: '1px dashed rgb(var(--border-color))'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgb(var(--blue))';
              e.currentTarget.style.color = 'rgb(var(--blue))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgb(var(--border-color))';
              e.currentTarget.style.color = 'rgb(var(--text-color) / 0.6)';
            }}
          >
            {t('taskBoard.addTask')}
          </Button>
        </div>
      </div>
    </div>
  );
}