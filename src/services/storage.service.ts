import type { Task } from '../features/tasks/types/task.types';
import type { User, Theme, Language, TaskStatus } from '../types/global.types';

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'taskboard-tasks',
  USERS: 'taskboard-users',
  PROJECT_INFO: 'taskboard-project-info',
  SETTINGS: 'taskboard-settings',
} as const;

// Interfaces
export interface ProjectInfo {
  name: string;
  description?: string;
  assignedUsers: User[];
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AppSettings {
  theme: Theme;
  language: Language;
}

// Raw interfaces for localStorage parsing
interface RawProjectInfo {
  name: string;
  description?: string;
  assignedUsers: RawUser[];
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface RawUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface RawTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee?: RawUser;
  tags: string[];
  status: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Simplified Storage Service
 * Handles all localStorage operations for a single project application
 */
export class StorageService {
  // =============================================================================
  // GENERIC STORAGE HELPERS
  // =============================================================================

  private static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  private static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  // =============================================================================
  // TASK OPERATIONS
  // =============================================================================

  static getTasks(): Task[] {
    const rawTasks = this.get<RawTask[]>(STORAGE_KEYS.TASKS, []);
    return rawTasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      assignee: task.assignee ? {
        ...task.assignee,
        createdAt: new Date(task.assignee.createdAt),
        updatedAt: new Date(task.assignee.updatedAt),
      } : undefined,
    })) as Task[];
  }

  static saveTasks(tasks: Task[]): void {
    this.set(STORAGE_KEYS.TASKS, tasks);
  }

  static addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  static updateTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }
  }

  static deleteTask(taskId: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(filteredTasks);
  }

  static moveTask(taskId: string, newStatus: TaskStatus): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        status: newStatus,
        updatedAt: new Date(),
      };
      this.saveTasks(tasks);
    }
  }

  // =============================================================================
  // USER OPERATIONS
  // =============================================================================

  static getUsers(): User[] {
    const rawUsers = this.get<RawUser[]>(STORAGE_KEYS.USERS, []);
    return rawUsers.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }));
  }

  static saveUsers(users: User[]): void {
    this.set(STORAGE_KEYS.USERS, users);
  }

  static addUser(user: User): void {
    const users = this.getUsers();
    // Check if user already exists by email
    if (!users.find(u => u.email === user.email)) {
      users.push(user);
      this.saveUsers(users);
    }
  }

  static updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  static deleteUser(userId: string): void {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    this.saveUsers(filteredUsers);
  }

  // =============================================================================
  // PROJECT INFO OPERATIONS (SIMPLIFIED TO SINGLE PROJECT)
  // =============================================================================

  static getProjectInfo(): ProjectInfo {
    const rawProjectInfo = this.get<RawProjectInfo | null>(STORAGE_KEYS.PROJECT_INFO, null);
    
    if (!rawProjectInfo) {
      // Return default project info if none exists
      return {
        name: 'لوحة إدارة المهام',
        description: 'Task management board',
        assignedUsers: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return {
      ...rawProjectInfo,
      createdAt: new Date(rawProjectInfo.createdAt),
      updatedAt: new Date(rawProjectInfo.updatedAt),
      dueDate: rawProjectInfo.dueDate ? new Date(rawProjectInfo.dueDate) : undefined,
      assignedUsers: rawProjectInfo.assignedUsers.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }))
    };
  }

  static saveProjectInfo(projectInfo: ProjectInfo): void {
    this.set(STORAGE_KEYS.PROJECT_INFO, {
      ...projectInfo,
      updatedAt: new Date()
    });
  }

  static initializeDefaultProjectInfo(): void {
    const existing = this.get<RawProjectInfo | null>(STORAGE_KEYS.PROJECT_INFO, null);
    
    if (!existing) {
      const defaultProjectInfo: ProjectInfo = {
        name: 'لوحة إدارة المهام',
        description: 'Task management board',
        assignedUsers: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.saveProjectInfo(defaultProjectInfo);
    }
  }

  static addUserToProject(user: { name: string; email: string }): void {
    const projectInfo = this.getProjectInfo();
    
    // Get or create user
    const existingUsers = this.getUsers();
    let userToAdd = existingUsers.find(u => u.email === user.email);
    
    if (!userToAdd) {
      userToAdd = {
        id: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.addUser(userToAdd);
    }
    
    // Check if user is already assigned to project
    const isUserAlreadyAssigned = projectInfo.assignedUsers.some(
      u => u.id === userToAdd!.id
    );
    
    if (!isUserAlreadyAssigned) {
      projectInfo.assignedUsers.push(userToAdd);
      this.saveProjectInfo(projectInfo);
    }
  }

  static removeUserFromProject(userId: string): void {
    const projectInfo = this.getProjectInfo();
    projectInfo.assignedUsers = projectInfo.assignedUsers.filter(
      user => user.id !== userId
    );
    this.saveProjectInfo(projectInfo);
  }

  static updateProjectDueDate(dueDate: Date | null): void {
    const projectInfo = this.getProjectInfo();
    projectInfo.dueDate = dueDate || undefined;
    this.saveProjectInfo(projectInfo);
  }

  static addProjectTag(tag: string): void {
    const projectInfo = this.getProjectInfo();
    if (!projectInfo.tags.includes(tag)) {
      projectInfo.tags.push(tag);
      this.saveProjectInfo(projectInfo);
    }
  }

  static removeProjectTag(tag: string): void {
    const projectInfo = this.getProjectInfo();
    projectInfo.tags = projectInfo.tags.filter(t => t !== tag);
    this.saveProjectInfo(projectInfo);
  }

  static updateProjectName(name: string): void {
    const projectInfo = this.getProjectInfo();
    projectInfo.name = name;
    this.saveProjectInfo(projectInfo);
  }

  static updateProjectDescription(description: string): void {
    const projectInfo = this.getProjectInfo();
    projectInfo.description = description;
    this.saveProjectInfo(projectInfo);
  }

  // =============================================================================
  // SETTINGS OPERATIONS
  // =============================================================================

  static getSettings(): AppSettings {
    return this.get<AppSettings>(STORAGE_KEYS.SETTINGS, {
      theme: 'light',
      language: 'en',
    });
  }

  static saveSettings(settings: AppSettings): void {
    this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  static updateTheme(theme: Theme): void {
    const settings = this.getSettings();
    this.saveSettings({ ...settings, theme });
  }

  static updateLanguage(language: Language): void {
    const settings = this.getSettings();
    this.saveSettings({ ...settings, language });
  }

  // =============================================================================
  // UTILITY OPERATIONS
  // =============================================================================

  static getProjectStats(): {
    totalUsers: number;
    totalTags: number;
    isOverdue: boolean;
    daysUntilDue?: number;
  } {
    const projectInfo = this.getProjectInfo();

    const stats = {
      totalUsers: projectInfo.assignedUsers.length,
      totalTags: projectInfo.tags.length,
      isOverdue: false,
      daysUntilDue: undefined as number | undefined
    };

    if (projectInfo.dueDate) {
      const today = new Date();
      const dueDate = new Date(projectInfo.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      stats.isOverdue = daysDiff < 0;
      stats.daysUntilDue = daysDiff;
    }

    return stats;
  }

  static exportData(): string {
    const data = {
      tasks: this.getTasks(),
      users: this.getUsers(),
      projectInfo: this.getProjectInfo(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.users) this.saveUsers(data.users);
      if (data.projectInfo) this.saveProjectInfo(data.projectInfo);
      if (data.settings) this.saveSettings(data.settings);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  }

  static getStorageUsage(): { used: number; available: number; percentage: number } {
    try {
      const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
      let used = 0;
      
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      return {
        used,
        available: total - used,
        percentage: (used / total) * 100
      };
    } catch {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}