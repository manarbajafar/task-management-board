import type { Priority, TaskStatus, User } from '../../../types/global.types';

// Main Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignee?: User;
  tags: string[];
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Task form data (for creating/editing tasks)
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  assigneeId?: string;
  tags: string[];
  dueDate?: Date;
}

// Task filters (for search and filtering)
export interface TaskFilters {
  search: string;
  priority?: Priority;
  assignee?: string;
  tags: string[];
  status?: TaskStatus;
}