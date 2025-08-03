import { useTranslation } from 'react-i18next';
import { Button, Select } from 'antd';
import { PlusOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import type { Priority, User } from '../../../types/global.types';
import type { Task } from '../../tasks/types/task.types';

const { Option } = Select;

interface BoardFiltersProps {
  selectedPriority?: Priority;
  selectedAssignee?: string;
  allUsers: User[];
  searchQuery: string;
  filteredTasks: Task[];
  totalTasks: number;
  onPriorityChange: (priority?: Priority) => void;
  onAssigneeChange: (assigneeId?: string) => void;
  onClearFilters: () => void;
  onAddTask: () => void;
}

export function BoardFilters({
  selectedPriority,
  selectedAssignee,
  allUsers,
  searchQuery,
  filteredTasks,
  totalTasks,
  onPriorityChange,
  onAssigneeChange,
  onClearFilters,
  onAddTask
}: BoardFiltersProps) {
  const { t } = useTranslation();

  const hasActiveFilters = searchQuery || selectedPriority || selectedAssignee;

  return (
    <>
      {/* Actions and Filters Row */}
      <div className="pt-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Add Task Button */}
          <div className="w-full lg:w-auto">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddTask}
              className="w-full lg:w-auto h-10 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: 'rgb(var(--blue))',
                borderColor: 'rgb(var(--blue))',
                boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)'
              }}
            >
              {t('taskBoard.addTask')}
            </Button>
          </div>

          {/* Filters Section */}
          <div className="w-full lg:w-auto">
            
            {/* Filter Label */}
            <div className="flex items-center justify-start gap-2 mb-3 lg:mb-0 lg:inline-flex" style={{ marginInlineEnd: '1rem' }}>
              <FilterOutlined 
                className="text-base"
                style={{ color: 'rgb(var(--text-color) / 0.6)' }}
              />
              <span 
                className="font-medium text-sm"
                style={{ color: 'rgb(var(--text-color))' }}
              >
                {t('taskBoard.filters.title')}
              </span>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row lg:inline-flex items-stretch sm:items-center gap-3">
              
              {/* Priority Filter */}
              <Select
                placeholder={t('taskBoard.filters.priority')}
                value={selectedPriority}
                onChange={onPriorityChange}
                allowClear
                className="w-full sm:w-32 lg:w-32 h-10"
                style={{
                  backgroundColor: 'rgb(var(--bg-container))',
                  borderColor: 'rgb(var(--border-color))',
                  color: 'rgb(var(--text-color))'
                }}
              >
                <Option value="high">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: 'rgb(239 68 68)' }}
                    ></div>
                    <span className="text-sm" style={{ color: 'rgb(var(--text-color))' }}>
                      {t('taskBoard.priority.high')}
                    </span>
                  </div>
                </Option>
                <Option value="medium">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: 'rgb(245 158 11)' }}
                    ></div>
                    <span className="text-sm" style={{ color: 'rgb(var(--text-color))' }}>
                      {t('taskBoard.priority.medium')}
                    </span>
                  </div>
                </Option>
                <Option value="low">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: 'rgb(34 197 94)' }}
                    ></div>
                    <span className="text-sm" style={{ color: 'rgb(var(--text-color))' }}>
                      {t('taskBoard.priority.low')}
                    </span>
                  </div>
                </Option>
              </Select>

              {/* Assignee Filter */}
              <Select
                placeholder={t('taskBoard.filters.assignee')}
                value={selectedAssignee}
                onChange={onAssigneeChange}
                allowClear
                className="w-full sm:w-36 lg:w-36 h-10"
                style={{
                  backgroundColor: 'rgb(var(--bg-container))',
                  borderColor: 'rgb(var(--border-color))',
                  color: 'rgb(var(--text-color))'
                }}
              >
                {allUsers.map(user => (
                  <Option key={user.id} value={user.id} style={{ color: 'rgb(var(--text-color))' }}>
                    <span className="text-sm" style={{ color: 'rgb(var(--text-color))' }}>
                      {user.name}
                    </span>
                  </Option>
                ))}
              </Select>

              {/* Clear Filters */}
              {(selectedPriority || selectedAssignee) && (
                <Button
                  type="text"
                  icon={<ClearOutlined />}
                  onClick={onClearFilters}
                  className="w-full sm:w-auto h-10 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-sm"
                  style={{
                    color: 'rgb(var(--text-color))',
                    borderColor: 'rgb(var(--border-color))'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(var(--blue))';
                    e.currentTarget.style.color = 'rgb(var(--blue))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(var(--border-color))';
                    e.currentTarget.style.color = 'rgb(var(--text-color))';
                  }}
                >
                  {t('taskBoard.filters.clear')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary (merged here) */}
      {hasActiveFilters && (
        <div className="-mt-2">
          <div 
            className="rounded-lg p-3 border text-center" 
            style={{ 
              backgroundColor: 'rgb(var(--blue) / 0.05)', 
              borderColor: 'rgb(var(--blue) / 0.2)' 
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-color))' }}>
              {t('taskBoard.showing')} <strong>{filteredTasks.length}</strong> {t('taskBoard.of')} <strong>{totalTasks}</strong> {t('taskBoard.tasks')}
            </p>
            {searchQuery && (
              <p className="text-xs mt-1" style={{ color: 'rgb(var(--text-color) / 0.7)' }}>
                {t('taskBoard.searchResults')}: "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}