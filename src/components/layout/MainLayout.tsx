import { useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTranslation } from 'react-i18next';
import { Header } from '../layout/Header';
import { Board } from '../../features/board/components/Board';
import { TaskFormModal } from '../../features/tasks/components/TaskFormModal';
import { useTasks } from '../../features/tasks/hooks/useTasks';
import { StorageService } from '../../services/storage.service';
import type { Task, TaskFormData } from '../../features/tasks/types/task.types';
import type { TaskStatus, Theme, Language } from '../../types/global.types';

export function MainLayout() {
  const { i18n } = useTranslation();
  const { state, addTask, updateTask, deleteTask, moveTask } = useTasks();
  
  // Initialize with null to indicate not loaded yet
  const [theme, setTheme] = useState<Theme | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog');

  // Initialize language and theme from StorageService on mount
  useEffect(() => {
    const settings = StorageService.getSettings();
    console.log('Loaded settings from storage:', settings);
    
    // Set theme and language from storage
    setTheme(settings.theme);
    setLanguage(settings.language);
    i18n.changeLanguage(settings.language);
  }, [i18n]);

  // Apply theme and language changes when they are set
  useEffect(() => {
    // Only apply if both theme and language are loaded
    if (theme === null || language === null) return;
    
    console.log('Applying theme and language:', { theme, language });
    
    // Apply theme class to document
    document.documentElement.className = theme;
    
    // Apply RTL direction for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Save preferences to StorageService
    StorageService.updateTheme(theme);
    StorageService.updateLanguage(language);
    
    // Change i18n language
    i18n.changeLanguage(language);
  }, [theme, language, i18n]);

  const handleThemeToggle = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    console.log('Theme toggle:', theme, '->', newTheme);
    setTheme(newTheme);
  };

  const handleLanguageToggle = () => {
    const newLanguage: Language = language === 'en' ? 'ar' : 'en';
    console.log('Language toggle:', language, '->', newLanguage);
    setLanguage(newLanguage);
  };

  const handleAddTask = (status?: TaskStatus) => {
    setDefaultStatus(status || 'backlog');
    setEditingTask(null);
    setIsTaskModalVisible(true);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalVisible(true);
  };

  const handleTaskSubmit = (data: TaskFormData, taskId?: string) => {
    if (taskId) {
      updateTask(taskId, data);
    } else {
      addTask(data, defaultStatus);
    }
    setIsTaskModalVisible(false);
    setEditingTask(null);
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    moveTask(taskId, newStatus);
  };

  const handleModalCancel = () => {
    setIsTaskModalVisible(false);
    setEditingTask(null);
  };


  // Show loading while settings are being loaded
  if (theme === null || language === null || state.loading) {
    return (
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm, // Use default while loading
          token: {
            colorPrimary: 'rgb(59 130 246)',
            borderRadius: 8,
            fontFamily: 'Tajawal, Arial, sans-serif',
          },
        }}
        direction="ltr" // Use default while loading
      >
        <div className="app-container min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
                 style={{ borderColor: 'rgb(var(--blue))' }}></div>
            <p style={{ color: 'rgb(var(--text-color))' }}>Loading...</p>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  if (state.error) {
    return (
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: 'rgb(59 130 246)',
            borderRadius: 8,
            fontFamily: 'Tajawal, Arial, sans-serif',
          },
        }}
        direction={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="app-container min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgb(var(--text-color))' }}>
              Error Loading Tasks
            </h2>
            <p style={{ color: 'rgb(var(--text-color))' }}>{state.error}</p>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: 'rgb(59 130 246)',
          borderRadius: 8,
          fontFamily: 'Tajawal, Arial, sans-serif',
        },
      }}
      direction={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="app-container min-h-screen">
        {/* Header */}
        <Header
          theme={theme}
          language={language}
          searchQuery={searchQuery}
          onThemeToggle={handleThemeToggle}
          onLanguageToggle={handleLanguageToggle}
          onSearchChange={setSearchQuery}
        />

        {/* Main Board */}
        <div className="pb-6">
          <Board
            tasks={state.tasks}
            users={state.users}
            searchQuery={searchQuery}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            onAddTask={handleAddTask}
            onMoveTask={handleMoveTask}
          />
        </div>

        {/* Task Form Modal */}
        <TaskFormModal
          visible={isTaskModalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleTaskSubmit}
          task={editingTask}
          users={state.users}
        />
      </div>
    </ConfigProvider>
  );
}